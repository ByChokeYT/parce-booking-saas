import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reputation/:clientId
router.get('/:clientId', authenticateToken, async (req, res) => {
    try {
        const reputation = await prisma.clientReputation.findUnique({
            where: { client_id: parseInt(req.params.clientId) },
            include: { client: { select: { full_name: true } } }
        });

        if (!reputation) {
            return res.status(404).json({ error: 'Reputación no encontrada para este cliente' });
        }

        res.json({ success: true, data: reputation });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reputación' });
    }
});

// PATCH /api/reputation/:clientId/block
router.patch('/:clientId/block', authenticateToken, async (req, res) => {
    const { is_blocked, reason } = req.body;
    try {
        const reputation = await prisma.clientReputation.update({
            where: { client_id: parseInt(req.params.clientId) },
            data: {
                is_blocked,
                blocked_reason: reason,
                blocked_until: is_blocked ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null // 7 días default si se bloquea
            }
        });
        res.json({ success: true, data: reputation });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado de bloqueo' });
    }
});

export default router;
