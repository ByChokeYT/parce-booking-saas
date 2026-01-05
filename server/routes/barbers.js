import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/barbers - List all barbers with user info
router.get('/', authenticateToken, async (req, res) => {
    try {
        // In a real multi-tenant app, filter by barbershop_id from req.user
        // req.user.barbershop_id

        const barbers = await prisma.barber.findMany({
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        phone: true,
                        role: true,
                        avatar_url: true
                    }
                },
                schedules: true
            }
        });

        res.json({ success: true, count: barbers.length, data: barbers });
    } catch (error) {
        console.error('Error fetching barbers:', error);
        res.status(500).json({ success: false, error: 'Error fetching barbers' });
    }
});

// POST /api/barbers - Create a new barber (requires creating user first usually)
// For now, we'll assume user creation + barber profile creation is complex and handled separately or we can implement a basic version.
router.post('/', authenticateToken, async (req, res) => {
    try {
        // TODO: Implement full barber creation flow (User + Barber tables)
        res.status(501).json({ success: false, message: 'Not implemented yet' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error creating barber' });
    }
});

// PUT /api/barbers/:id - Update barber profile
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { specialties, bio, commission_percent } = req.body;

        const barber = await prisma.barber.update({
            where: { id: parseInt(id) },
            data: {
                specialties,
                bio,
                commission_percent: commission_percent ? parseFloat(commission_percent) : undefined
            }
        });

        res.json({ success: true, data: barber });
    } catch (error) {
        console.error('Error updating barber:', error);
        res.status(500).json({ success: false, error: 'Error updating barber' });
    }
});

export default router;
