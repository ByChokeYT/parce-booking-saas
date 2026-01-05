import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📅 Creating appointments for today...');

    const today = new Date();

    // Get admin user
    const admin = await prisma.user.findUnique({ where: { email: 'admin@barber.com' } });
    if (!admin) throw new Error('Admin not found');

    // Get first service
    const service = await prisma.service.findFirst();
    if (!service) throw new Error('No services found');

    const appointments = [
        { hour: 10, minutes: 0 },
        { hour: 11, minutes: 30 },
        { hour: 14, minutes: 0 },
        { hour: 16, minutes: 45 }
    ];

    for (const time of appointments) {
        const aptDate = new Date(today);
        aptDate.setHours(time.hour, time.minutes, 0, 0);

        await prisma.appointment.create({
            data: {
                user_id: admin.id,
                barber_id: admin.id, // Admin acts as barber too for test
                service_id: service.id,
                appointment_date: aptDate,
                status: 'pending'
            }
        });
    }

    console.log(`✅ Created ${appointments.length} test appointments`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
