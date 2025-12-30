import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding...');

    // 1. Crear Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@barber.com' },
        update: {
            password_hash: adminPassword,
        },
        create: {
            full_name: 'Royal Admin',
            email: 'admin@barber.com',
            password_hash: adminPassword,
            phone: '1234567890',
            role: 'admin'
        }
    });
    console.log(`👤 Created user: ${admin.email}`);

    // 2. Crear Servicios Default
    const services = [
        { name: 'Corte Clásico', price: 5000, duration_minutes: 30, description: 'Tijera y máquina' },
        { name: 'Barba Royal', price: 3000, duration_minutes: 20, description: 'Perfilado y toalla caliente' },
        { name: 'Servicio Completo', price: 7000, duration_minutes: 45, description: 'Corte + Barba + Bebida' }
    ];

    for (const s of services) {
        await prisma.service.create({
            data: s
        });
    }
    console.log(`✂️ Created ${services.length} services`);

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
