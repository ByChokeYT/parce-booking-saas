import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/turnos/today
// Retorna contador de turnos de hoy y los próximos 5
router.get('/today', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // 1. Contar turnos de hoy
        const count = await prisma.appointment.count({
            where: {
                start_time: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    not: 'cancelled'
                }
            }
        });

        // 2. Traer próximos 5 turnos (desde AHORA en adelante)
        const now = new Date();
        const nextAppointments = await prisma.appointment.findMany({
            where: {
                start_time: {
                    gte: now
                },
                status: {
                    not: 'cancelled'
                }
            },
            take: 5,
            orderBy: {
                start_time: 'asc'
            },
            include: {
                user: {
                    select: { full_name: true }
                },
                service: {
                    select: { name: true, duration_minutes: true }
                }
            }
        });

        res.json({
            success: true,
            todayCount: count,
            upcoming: nextAppointments
        });
    } catch (error) {
        console.error('Error fetching today stats:', error);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
});

// POST /api/turnos/public
// Endpoint ABRE-PUERTAS para clientes sin cuenta
router.post('/public', async (req, res) => {
    const { service_id, barber_id, start_time, client_name, client_phone } = req.body;

    try {
        if (!service_id || !barber_id || !start_time || !client_name || !client_phone) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        // 1. Buscar o Crear Cliente automáticamente
        let client = await prisma.client.findFirst({
            where: { phone: client_phone }
        });

        if (!client) {
            client = await prisma.client.create({
                data: {
                    full_name: client_name,
                    phone: client_phone,
                    barbershop_id: 1, // Default para single-tenant
                    reputation: { create: { trust_score: 100 } }
                }
            });
        }

        // 2. Crear Cita (Usando transaccion para evitar conflictos)
        const appointment = await prisma.$transaction(async (tx) => {
            const service = await tx.service.findUnique({ where: { id: parseInt(service_id) } });
            // Ensure service exists and has duration_minutes
            if (!service || typeof service.duration_minutes !== 'number') {
                throw new Error('Servicio no encontrado o duración no definida');
            }
            const endTime = new Date(new Date(start_time).getTime() + service.duration_minutes * 60000);

            // Verificar conflicto
            const conflict = await tx.appointment.findFirst({
                where: {
                    barber_id: parseInt(barber_id),
                    status: { notIn: ['cancelled', 'no_show'] }, // Consider only active appointments for conflict
                    AND: [
                        { start_time: { lt: endTime } },
                        { end_time: { gt: new Date(start_time) } }
                    ]
                }
            });

            if (conflict) throw new Error('Horario ocupado');

            return await tx.appointment.create({
                data: {
                    barbershop_id: client.barbershop_id,
                    client_id: client.id,
                    barber_id: parseInt(barber_id),
                    service_id: parseInt(service_id),
                    start_time: new Date(start_time),
                    end_time: endTime,
                    status: 'confirmed'
                }
            });
        });

        // Emitir Socket para que el admin lo vea en tiempo real
        const io = req.app.get('io');
        if (io) io.emit('appointment-created', appointment);

        res.json({ success: true, data: appointment });
    } catch (error) {
        console.error('Public booking error:', error);
        res.status(500).json({ error: error.message || 'Error al procesar reserva' });
    }
});

// GET /api/turnos/upcoming
// Retorna contador de turnos en las próximas 3 horas
router.get('/upcoming', authenticateToken, async (req, res) => {
    try {
        const now = new Date();
        const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

        const count = await prisma.appointment.count({
            where: {
                start_time: {
                    gte: now,
                    lte: threeHoursLater
                },
                status: {
                    not: 'cancelled'
                }
            }
        });

        res.json({
            success: true,
            upcomingCount: count
        });

    } catch (error) {
        console.error('Error fetching upcoming stats:', error);
        res.status(500).json({ error: 'Error fetching upcoming stats' });
    }
});

// GET /api/turnos
// Listar turnos con filtros (fecha, barber_id, status)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { fecha, barber_id, status } = req.query;
        let where = {};

        if (fecha) {
            const startOfDay = new Date(fecha);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(fecha);
            endOfDay.setHours(23, 59, 59, 999);
            where.start_time = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        if (barber_id) where.barber_id = parseInt(barber_id);
        if (status) where.status = status;

        const appointments = await prisma.appointment.findMany({
            where,
            orderBy: { start_time: 'asc' },
            include: {
                client: {
                    include: {
                        reputation: { select: { trust_score: true, is_blocked: true } }
                    }
                },
                barber: { include: { user: { select: { full_name: true } } } },
                service: { select: { name: true, duration_minutes: true, price: true } }
            }
        });

        res.json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error listing appointments:', error);
        res.status(500).json({ error: 'Error listing appointments' });
    }
});

// POST /api/turnos
// Crear un turno con Transacción Prisma (Serializable) para evitar conflictos
router.post('/', authenticateToken, async (req, res) => {
    const { client_id, barber_id, service_id, start_time: body_start_time, notes } = req.body;

    if (!client_id || !barber_id || !service_id || !body_start_time) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    try {
        const start_time = new Date(body_start_time);

        // Obtener datos del servicio para calcular end_time
        const service = await prisma.service.findUnique({ where: { id: parseInt(service_id) } });
        if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });

        const end_time = new Date(start_time.getTime() + service.duration_minutes * 60000);

        // TRANSACCIÓN SERIALIZABLE (Fase 3: Anti-Race Condition)
        const newAppointment = await prisma.$transaction(async (tx) => {
            // 1. Verificar si hay solapamiento de horario para ese barbero
            // Buscamos cualquier cita 'A' tal que: A.start < new.end AND A.end > new.start

            // Mejor lógica de solapamiento: 
            // Buscamos cualquier cita 'A' tal que: A.start < new.end AND A.end > new.start
            // Como no tenemos 'end_time' en la tabla (según schema.prisma actual? No, espérate...)
            // Reviso schema.prisma... Appointment tiene start_time y end_time.

            const overlap = await tx.appointment.findFirst({
                where: {
                    barber_id: parseInt(barber_id),
                    status: { notIn: ['cancelled', 'no_show'] },
                    AND: [
                        { start_time: { lt: end_time } },
                        { end_time: { gt: start_time } }
                    ]
                }
            });

            if (overlap) {
                throw new Error('El barbero ya tiene una cita en ese horario');
            }

            // 2. Crear la cita
            return await tx.appointment.create({
                data: {
                    barbershop_id: 1, // Default por ahora
                    client_id: parseInt(client_id),
                    barber_id: parseInt(barber_id),
                    service_id: parseInt(service_id),
                    start_time: start_time,
                    end_time: end_time,
                    status: 'confirmed',
                    notes
                }
            });
        }, {
            isolationLevel: 'Serializable'
        });

        // Emitir evento por socket
        const io = req.app.get('io');
        if (io) io.emit('appointment-created', newAppointment);

        res.status(201).json({ success: true, data: newAppointment });

    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(400).json({ error: error.message || 'Error al crear la cita' });
    }
});

// PATCH /api/turnos/:id/reschedule
router.patch('/:id/reschedule', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time } = req.body;

    try {
        const appointment = await prisma.appointment.update({
            where: { id: parseInt(id) },
            data: {
                start_time: new Date(start_time),
                end_time: new Date(end_time)
            }
        });

        // Emitir WebSocket
        const io = req.app.get('io');
        if (io) io.emit('appointment-updated', appointment);

        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ error: 'Error al reprogramar turno' });
    }
});

// PATCH /api/turnos/:id/status
router.patch('/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: parseInt(id) },
            include: { client: true }
        });

        if (!appointment) return res.status(404).json({ error: 'Cita no encontrada' });

        const result = await prisma.$transaction(async (tx) => {
            // 1. Actualizar la cita
            const updatedApt = await tx.appointment.update({
                where: { id: parseInt(id) },
                data: { status }
            });

            // 2. Calcular impacto en reputación
            let scoreChange = 0;
            let noShowIncrement = 0;
            let cancelIncrement = 0;
            let completedIncrement = 0;

            if (status === 'completed') {
                scoreChange = 2;
                completedIncrement = 1;
            } else if (status === 'no_show') {
                scoreChange = -25;
                noShowIncrement = 1;
            } else if (status === 'cancelled') {
                scoreChange = -5;
                cancelIncrement = 1;
            }

            // 3. Actualizar o crear reputación
            await tx.clientReputation.upsert({
                where: { client_id: appointment.client_id },
                create: {
                    client_id: appointment.client_id,
                    trust_score: Math.min(100, Math.max(0, 100 + scoreChange)),
                    total_bookings: 1,
                    no_show_count: noShowIncrement,
                    cancelled_count: cancelIncrement,
                    completed_bookings: completedIncrement
                },
                update: {
                    trust_score: {
                        increment: scoreChange
                    },
                    no_show_count: { increment: noShowIncrement },
                    cancelled_count: { increment: cancelIncrement },
                    completed_bookings: { increment: completedIncrement },
                    total_bookings: { increment: 1 }
                }
            });

            // Asegurar que el score no baje de 0 ni suba de 100 después del increment
            const rep = await tx.clientReputation.findUnique({ where: { client_id: appointment.client_id } });
            if (rep.trust_score < 0 || rep.trust_score > 100) {
                await tx.clientReputation.update({
                    where: { client_id: appointment.client_id },
                    data: { trust_score: Math.min(100, Math.max(0, rep.trust_score)) }
                });
            }

            // 4. Fidelización (Fase 10)
            if (status === 'completed') {
                // Actualizar última visita
                await tx.client.update({
                    where: { id: appointment.client_id },
                    data: { last_visit: new Date() }
                });

                // Sumar puntos (10 por corte)
                await tx.loyaltyCard.upsert({
                    where: { client_id: appointment.client_id },
                    create: {
                        client_id: appointment.client_id,
                        points: 10,
                        total_accrued: 10
                    },
                    update: {
                        points: { increment: 10 },
                        total_accrued: { increment: 10 }
                    }
                });
            }

            return updatedApt;
        });

        // Emitir evento por socket
        const io = req.app.get('io');
        if (io) io.emit('appointment-updated', result);

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error updating status/reputation:', error);
        res.status(500).json({ error: 'Error updating appointment status' });
    }
});

export default router;
