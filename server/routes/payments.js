import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/payments
// Registra un pago y genera la comisión automáticamente
router.post('/', authenticateToken, async (req, res) => {
    const { appointment_id, amount, payment_method, notes } = req.body;

    if (!appointment_id || !amount || !payment_method) {
        return res.status(400).json({ error: 'Faltan datos obligatorios para el pago' });
    }

    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(appointment_id) },
            include: { barber: true, service: true }
        });

        if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });

        const barber = appointment.barber;
        const commissionPercent = barber.commission_percent || 60; // Default 60%

        const barberAmount = (parseFloat(amount) * parseFloat(commissionPercent)) / 100;
        const houseAmount = parseFloat(amount) - barberAmount;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear el pago
            const payment = await tx.payment.create({
                data: {
                    barbershop_id: appointment.barbershop_id,
                    appointment_id: parseInt(appointment_id),
                    amount: parseFloat(amount),
                    payment_method,
                    payment_status: 'verified',
                    notes,
                    paid_at: new Date()
                }
            });

            // 2. Crear la comisión
            const commission = await tx.commission.create({
                data: {
                    appointment_id: parseInt(appointment_id),
                    payment_id: payment.id,
                    barber_id: barber.id,
                    service_amount: parseFloat(amount),
                    commission_percent: commissionPercent,
                    barber_amount: barberAmount,
                    house_amount: houseAmount
                }
            });

            // 3. Actualizar estado de la cita a 'completed' (si no lo está)
            await tx.appointment.update({
                where: { id: parseInt(appointment_id) },
                data: { status: 'completed', payment_id: payment.id }
            });

            return { payment, commission };
        });

        // Notificar por WebSocket
        const io = req.app.get('io');
        if (io) io.emit('payment-recorded', result);

        res.status(201).json({ success: true, data: result });

    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).json({ error: 'Error al procesar el pago' });
    }
});

// GET /api/payments/report
// Estadísticas básicas de ingresos
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalToday = await prisma.payment.aggregate({
            where: {
                paid_at: { gte: today },
                payment_status: 'verified'
            },
            _sum: { amount: true }
        });

        const breakdown = await prisma.payment.groupBy({
            by: ['payment_method'],
            where: {
                paid_at: { gte: today },
                payment_status: 'verified'
            },
            _sum: { amount: true }
        });

        res.json({
            success: true,
            today: totalToday._sum.amount || 0,
            breakdown
        });
    } catch (error) {
        res.status(500).json({ error: 'Error generating stats' });
    }
});

// GET /api/payments/preview-corte
// Obtiene los datos esperados para el corte de una fecha
router.get('/preview-corte', authenticateToken, async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    try {
        const targetDate = date ? new Date(date) : new Date();
        const start = new Date(targetDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(targetDate);
        end.setHours(23, 59, 59, 999);

        const payments = await prisma.payment.findMany({
            where: {
                paid_at: { gte: start, lte: end },
                payment_status: 'verified'
            }
        });

        const stats = {
            total_appointments: payments.length,
            expected_cash: 0,
            total_card: 0,
            total_transfer: 0,
            total_qr: 0
        };

        payments.forEach(p => {
            const amount = parseFloat(p.amount);
            if (p.payment_method === 'cash') stats.expected_cash += amount;
            else if (p.payment_method === 'card') stats.total_card += amount;
            else if (p.payment_method === 'transfer') stats.total_transfer += amount;
            else if (p.payment_method === 'qr' || p.payment_method === 'digital_wallet') stats.total_qr += amount;
        });

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ error: 'Error previewing cash out' });
    }
});

// POST /api/payments/corte
// Guarda un corte de caja oficial
router.post('/corte', authenticateToken, async (req, res) => {
    const {
        expected_cash,
        actual_cash,
        total_card,
        total_transfer,
        total_qr,
        notes
    } = req.body;

    try {
        const difference = parseFloat(actual_cash) - parseFloat(expected_cash);

        const cashOut = await prisma.cashOut.create({
            data: {
                barbershop_id: req.user.barbershop_id || 1,
                user_id: req.user.id,
                expected_cash: parseFloat(expected_cash),
                actual_cash: parseFloat(actual_cash),
                difference: difference,
                total_card: parseFloat(total_card),
                total_transfer: parseFloat(total_transfer),
                total_qr: parseFloat(total_qr),
                notes
            }
        });

        res.status(201).json({ success: true, data: cashOut });
    } catch (error) {
        console.error('Error saving cash out:', error);
        res.status(500).json({ error: 'Error saving cash out' });
    }
});

// GET /api/payments/full-report
// Reporte avanzado para dashboards
router.get('/full-report', authenticateToken, async (req, res) => {
    try {
        const now = new Date();

        // 1. Ingresos por Periodo (Día, Semana, Mes)
        const startDay = new Date(now); startDay.setHours(0, 0, 0, 0);
        const startWeek = new Date(now); startWeek.setDate(now.getDate() - now.getDay());
        const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [dayIncome, weekIncome, monthIncome] = await Promise.all([
            prisma.payment.aggregate({ where: { paid_at: { gte: startDay }, payment_status: 'verified' }, _sum: { amount: true } }),
            prisma.payment.aggregate({ where: { paid_at: { gte: startWeek }, payment_status: 'verified' }, _sum: { amount: true } }),
            prisma.payment.aggregate({ where: { paid_at: { gte: startMonth }, payment_status: 'verified' }, _sum: { amount: true } })
        ]);

        // 2. Comparativa (Mes actual vs Mes anterior)
        const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const lastMonthIncome = await prisma.payment.aggregate({
            where: { paid_at: { gte: startLastMonth, lte: endLastMonth }, payment_status: 'verified' },
            _sum: { amount: true }
        });

        // 3. Servicios más vendidos
        const popularServices = await prisma.appointment.groupBy({
            by: ['service_id'],
            where: { status: 'completed' },
            _count: { service_id: true },
            orderBy: { _count: { service_id: 'desc' } },
            take: 5
        });

        // Obtener nombres de servicios
        const services = await prisma.service.findMany({
            where: { id: { in: popularServices.map(s => s.service_id) } },
            select: { id: true, name: true }
        });

        const servicesData = popularServices.map(ps => ({
            name: services.find(s => s.id === ps.service_id)?.name || 'Unknown',
            count: ps._count.service_id
        }));

        // 4. Horarios Pico (Detección de demanda por hora)
        const appointments = await prisma.appointment.findMany({
            where: { status: 'completed' },
            select: { start_time: true }
        });

        const hoursMap = {};
        appointments.forEach(a => {
            const hour = new Date(a.start_time).getHours();
            hoursMap[hour] = (hoursMap[hour] || 0) + 1;
        });

        const peakHours = Object.keys(hoursMap).map(hour => ({
            hour: `${hour}:00`,
            count: hoursMap[hour]
        })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

        // 5. Rendimiento por Barbero
        const barberPerformance = await prisma.commission.groupBy({
            by: ['barber_id'],
            _sum: { service_amount: true, barber_amount: true, house_amount: true },
            _count: { appointment_id: true }
        });

        const barbers = await prisma.barber.findMany({
            where: { id: { in: barberPerformance.map(b => b.barber_id) } },
            include: { user: { select: { full_name: true } } }
        });

        const performanceData = barberPerformance.map(bp => ({
            name: barbers.find(b => b.id === bp.barber_id)?.user.full_name || 'Desconocido',
            total_generated: bp._sum.service_amount,
            commission: bp._sum.barber_amount,
            appointments: bp._count.appointment_id
        }));

        res.json({
            success: true,
            stats: {
                income: {
                    today: dayIncome._sum.amount || 0,
                    week: weekIncome._sum.amount || 0,
                    month: monthIncome._sum.amount || 0,
                    lastMonth: lastMonthIncome._sum.amount || 0
                },
                services: servicesData,
                peakHours,
                performance: performanceData
            }
        });
    } catch (error) {
        console.error('Error in full-report:', error);
        res.status(500).json({ error: 'Error generating business intelligence report' });
    }
});

export default router;
