import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js';
import appointmentsRouter from './routes/appointments.js';
import servicesRouter from './routes/services.js';
import barbersRouter from './routes/barbers.js';
import clientsRouter from './routes/clients.js';
import paymentsRouter from './routes/payments.js';
import reputationRouter from './routes/clientReputation.js';
import configRouter from './routes/config.js';
import marketingRouter from './routes/marketing.js';
import { initMarketingEngine } from './utils/marketingEngine.js';
import { initBackupEngine } from './utils/backupEngine.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // En producción deberías restringir esto
        methods: ["GET", "POST", "PATCH"]
    }
});

const PORT = process.env.PORT || 3001;

// Guardar io en la app para usarlo en las rutas
app.set('io', io);

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' })); // Limit body size

// Rate Limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login attempts per window
    message: { error: 'Demasiados intentos de inicio de sesión. Reintente en 15 minutos.' }
});

const publicApiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 appointments per hour
    message: { error: 'Límite de reservas públicas alcanzado. Reintente más tarde.' }
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/turnos/public', publicApiLimiter);

// Routes
app.use('/api/turnos', appointmentsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/barbers', barbersRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reputation', reputationRouter);
app.use('/api/config', configRouter);
app.use('/api/marketing', marketingRouter);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'FLOW API',
        version: '1.0.0',
        endpoints: {
            status: '/api/status',
            login: '/api/auth/login',
            turnos: '/api/turnos'
        }
    });
});

// Status Check

// Status Check
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running with Prisma & JWT Auth' });
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password (Bcrypt only)
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user info (excluding password)
        const { password_hash, ...userResult } = user;
        res.json({
            success: true,
            user: userResult,
            token: token
        });

    } catch (error) {
        res.status(500).json({ error: 'Auth error' });
    }
});

// Register Endpoint (SaaS - New Barbershop)
app.post('/api/auth/register', async (req, res) => {
    const { email, password, full_name, phone, barbershop_name } = req.body;

    if (!email || !password || !full_name || !barbershop_name) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios (Email, Password, Nombre, Barbería)' });
    }

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Transaction: Create Barbershop + Admin User
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Create Barbershop
            const newBarbershop = await prisma.barbershop.create({
                data: {
                    name: barbershop_name,
                    phone: phone,
                    email: email, // Contact email
                    address: 'Sin dirección configurada'
                }
            });

            // 2. Create User (Admin) linked to Barbershop
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password_hash,
                    full_name,
                    phone,
                    role: 'ADMIN', // Default role for creator
                    barbershop_id: newBarbershop.id
                }
            });

            return { newBarbershop, newUser };
        });

        // Generate JWT
        const token = jwt.sign(
            {
                id: result.newUser.id,
                email: result.newUser.email,
                role: result.newUser.role,
                barbershopId: result.newBarbershop.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return success
        const { password_hash: ph, ...userResult } = result.newUser;
        res.json({
            success: true,
            user: userResult,
            barbershop: result.newBarbershop,
            token: token
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Error al registrar la barbería' });
    }
});

// Initialize Engines
initMarketingEngine(io);
initBackupEngine();

// Socket.io Connection
io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('SERVER_ERROR:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Algo salió mal' : err.message
    });
});

// Start Server
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FLOW Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
