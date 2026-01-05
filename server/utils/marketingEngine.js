import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * FLOW MARKETING ENGINE
 * Automatiza la retención y fidelización de clientes.
 */
export const initMarketingEngine = (io) => {
    console.log('🚀 Marketing Engine Initialized [FLOW]');

    // Ejecutar todos los días a las 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('⏰ Running automated marketing tasks...');
        await checkBirthdays(io);
        await checkInactiveClients(io);
    });

    // Tarea de prueba (ejecuta cada minuto en desarrollo si se desea, o manual)
    // cron.schedule('* * * * *', () => console.log('Ping Marketing...'));
};

const checkBirthdays = async (io) => {
    try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // SQLite no tiene funciones de fecha potentes, así que filtramos en memoria o con raw
        const allClients = await prisma.client.findMany({
            where: { birthday: { not: null } }
        });

        const birthdayClients = allClients.filter(c => {
            const b = new Date(c.birthday);
            return b.getMonth() + 1 === month && b.getDate() === day;
        });

        for (const client of birthdayClients) {
            console.log(`🎂 Cumpleaños detectado: ${client.full_name}`);

            await prisma.marketingAction.create({
                data: {
                    client_id: client.id,
                    action_type: 'birthday_wish',
                    content: `¡Feliz cumpleaños ${client.full_name}! Flow te regala 20 puntos extra hoy. 🎉`
                }
            });

            // Sumar puntos de regalo
            await prisma.loyaltyCard.update({
                where: { client_id: client.id },
                data: { points: { increment: 20 } }
            });

            if (io) io.emit('marketing-sent', { client: client.full_name, type: 'Cumpleaños' });
        }
    } catch (error) {
        console.error('Error in checkBirthdays:', error);
    }
};

const checkInactiveClients = async (io) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const inactiveClients = await prisma.client.findMany({
            where: {
                last_visit: { lt: thirtyDaysAgo },
                marketing_actions: {
                    none: {
                        action_type: 'inactive_reminder',
                        sent_at: { gte: thirtyDaysAgo } // No enviar más de uno por mes
                    }
                }
            }
        });

        for (const client of inactiveClients) {
            console.log(`📡 Cliente inactivo detectado: ${client.full_name}`);

            await prisma.marketingAction.create({
                data: {
                    client_id: client.id,
                    action_type: 'inactive_reminder',
                    content: `Hola ${client.full_name}, ¡te extrañamos en Flow! Vuelve esta semana y obtén un descuento sorpresa. 🌊`
                }
            });

            if (io) io.emit('marketing-sent', { client: client.full_name, type: 'Reactivación' });
        }
    } catch (error) {
        console.error('Error in checkInactiveClients:', error);
    }
};
