import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/services - List all active services
router.get('/', authenticateToken, async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            where: {
                is_active: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.json({ success: true, count: services.length, data: services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ success: false, error: 'Error fetching services' });
    }
});

// POST /api/services - Create new service (Admin only)
router.post('/', authenticateToken, async (req, res) => {
    try {
        // TODO: Check if user is admin/owner
        const { name, description, duration_minutes, price, category } = req.body;
        const barbershopId = req.user.barbershop_id || 1; // Fallback for now

        const service = await prisma.service.create({
            data: {
                barbershop_id: barbershopId,
                name,
                description,
                duration_minutes: parseInt(duration_minutes),
                price: parseFloat(price),
                category: category || 'general',
                is_active: true
            }
        });

        res.status(201).json({ success: true, data: service });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ success: false, error: 'Error creating service' });
    }
});

// PUT /api/services/:id - Update service
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, duration_minutes, price, category, is_active } = req.body;

        const service = await prisma.service.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                duration_minutes: duration_minutes ? parseInt(duration_minutes) : undefined,
                price: price ? parseFloat(price) : undefined,
                category,
                is_active
            }
        });

        res.json({ success: true, data: service });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ success: false, error: 'Error updating service' });
    }
});

// DELETE /api/services/:id - Soft delete service
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete (set is_active = false)
        await prisma.service.update({
            where: { id: parseInt(id) },
            data: { is_active: false }
        });

        res.json({ success: true, message: 'Service deactivated successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ success: false, error: 'Error deleting service' });
    }
});

export default router;
