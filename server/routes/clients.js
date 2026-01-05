import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/clients - Search or List clients
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { search } = req.query;
        let where = {
            barbershop_id: 1 // Default por ahora
        };

        if (search) {
            where.OR = [
                { full_name: { contains: search } },
                { phone: { contains: search } }
            ];
        }

        const clients = await prisma.client.findMany({
            where,
            include: {
                loyalty: true,
                _count: {
                    select: { appointments: true }
                }
            },
            orderBy: { full_name: 'asc' }
        });

        res.json({ success: true, data: clients });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ success: false, error: 'Error fetching clients' });
    }
});

// POST /api/clients - Create new client
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { full_name, email, phone, notes, birthday } = req.body;

        if (!full_name || !phone) {
            return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' });
        }

        const client = await prisma.client.create({
            data: {
                barbershop_id: 1,
                full_name,
                email,
                phone,
                notes,
                birthday: birthday ? new Date(birthday) : null,
                loyalty: {
                    create: { points: 0 }
                },
                reputation: {
                    create: { trust_score: 100 }
                }
            }
        });

        res.status(201).json({ success: true, data: client });
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ success: false, error: 'Error creating client' });
    }
});

export default router;
