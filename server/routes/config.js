import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/config/barbershop/:id
router.get('/barbershop/:id', authenticateToken, async (req, res) => {
    try {
        const barbershop = await prisma.barbershop.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { payment_methods: true }
        });
        res.json({ success: true, data: barbershop });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener configuración de la barbería' });
    }
});

// PATCH /api/config/barbershop/:id
router.patch('/barbershop/:id', authenticateToken, async (req, res) => {
    const { name, address, phone, logo_url, currency } = req.body;
    try {
        // En un entorno real, verificar si el usuario es 'owner'
        const updated = await prisma.barbershop.update({
            where: { id: parseInt(req.params.id) },
            data: { name, address, phone, logo_url, currency }
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la barbería' });
    }
});

// GET /api/config/payment-methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
    try {
        const methods = await prisma.paymentMethod.findMany({
            where: { barbershop_id: req.user.barbershop_id || 1 }
        });
        res.json({ success: true, data: methods });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener métodos de pago' });
    }
});

// POST /api/config/payment-methods
router.post('/payment-methods', authenticateToken, async (req, res) => {
    const { method_type, display_name, account_info, qr_code_url } = req.body;
    try {
        const newMethod = await prisma.paymentMethod.create({
            data: {
                barbershop_id: req.user.barbershop_id || 1,
                method_type,
                display_name,
                account_info,
                qr_code_url
            }
        });
        res.json({ success: true, data: newMethod });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear método de pago' });
    }
});

export default router;
