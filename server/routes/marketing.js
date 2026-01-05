import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/marketing/stats - Resumen de fidelización
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const topLoyalty = await prisma.loyaltyCard.findMany({
            take: 10,
            orderBy: { points: 'desc' },
            include: { client: { select: { full_name: true, phone: true } } }
        });

        const recentActions = await prisma.marketingAction.findMany({
            take: 20,
            orderBy: { sent_at: 'desc' },
            include: { client: { select: { full_name: true } } }
        });

        res.json({ success: true, data: { topLoyalty, recentActions } });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas de marketing' });
    }
});

// GET /api/marketing/actions - Lista completa de acciones
router.get('/actions', authenticateToken, async (req, res) => {
    try {
        const actions = await prisma.marketingAction.findMany({
            orderBy: { sent_at: 'desc' },
            include: { client: { select: { full_name: true, phone: true } } }
        });
        res.json({ success: true, data: actions });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener historial de marketing' });
    }
});

// POST /api/marketing/redeem
router.post('/redeem', authenticateToken, async (req, res) => {
    const { client_id } = req.body;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const card = await tx.loyaltyCard.findUnique({ where: { client_id: parseInt(client_id) } });

            if (!card || card.points < 100) {
                throw new Error('Puntos insuficientes (mínimo 100)');
            }

            // Descontar puntos
            const updatedCard = await tx.loyaltyCard.update({
                where: { client_id: parseInt(client_id) },
                data: {
                    points: { decrement: 100 },
                    last_redeemed: new Date()
                }
            });

            // Registrar acción
            await tx.marketingAction.create({
                data: {
                    client_id: parseInt(client_id),
                    action_type: 'loyalty_reward',
                    content: 'Canje de 100 puntos por servicio gratuito/descuento.'
                }
            });

            return updatedCard;
        });

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
