import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    // 1. Create Barbershop
    console.log('📍 Creating barbershop...');
    const barbershop = await prisma.barbershop.create({
        data: {
            name: 'Flow Premium',
            address: 'Av. Corrientes 1234, CABA',
            phone: '+54 11 1234-5678',
            email: 'info@flowbarber.com',
            country: 'AR',
            currency: 'ARS',
            timezone: 'America/Argentina/Buenos_Aires',
        },
    });
    console.log(`✅ Barbershop created: ${barbershop.name} (ID: ${barbershop.id})\n`);

    // 2. Create Admin User
    console.log('👤 Creating admin user...');
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
        data: {
            barbershop_id: barbershop.id,
            full_name: 'Admin Principal',
            email: 'admin@barber.com',
            password_hash: adminPasswordHash,
            phone: '+54 11 9999-0000',
            role: 'owner',
        },
    });
    console.log(`✅ Admin created: ${adminUser.email}\n`);

    // 3. Create Barbers
    console.log('✂️ Creating barbers...');

    const barber1Password = await bcrypt.hash('barber123', 10);
    const barber1User = await prisma.user.create({
        data: {
            barbershop_id: barbershop.id,
            full_name: 'Carlos Mendez',
            email: 'carlos@barber.com',
            password_hash: barber1Password,
            phone: '+54 11 8888-1111',
            role: 'barber',
        },
    });

    const barber1 = await prisma.barber.create({
        data: {
            barbershop_id: barbershop.id,
            user_id: barber1User.id,
            specialties: 'Cortes clásicos, Fade, Barba',
            bio: 'Barbero profesional con 10 años de experiencia',
            commission_percent: 60,
            bank_account: '0000003100012345678901',
            digital_wallet_type: 'mercadopago',
            digital_wallet_number: '+5491188881111',
        },
    });
    console.log(`✅ Barber created: ${barber1User.full_name}`);

    const barber2Password = await bcrypt.hash('barber123', 10);
    const barber2User = await prisma.user.create({
        data: {
            barbershop_id: barbershop.id,
            full_name: 'Miguel Torres',
            email: 'miguel@barber.com',
            password_hash: barber2Password,
            phone: '+54 11 7777-2222',
            role: 'barber',
        },
    });

    const barber2 = await prisma.barber.create({
        data: {
            barbershop_id: barbershop.id,
            user_id: barber2User.id,
            specialties: 'Cortes modernos, Diseño, Color',
            bio: 'Especialista en estilos modernos y tendencias',
            commission_percent: 65,
            bank_account: '0000003100098765432109',
            digital_wallet_type: 'uala',
            digital_wallet_number: '+5491177772222',
        },
    });
    console.log(`✅ Barber created: ${barber2User.full_name}\n`);

    // 4. Create Services
    console.log('💼 Creating services...');
    const services = await prisma.service.createMany({
        data: [
            {
                barbershop_id: barbershop.id,
                name: 'Corte Clásico',
                description: 'Corte tradicional con tijera y máquina',
                category: 'corte',
                price: 5000,
                duration_minutes: 30,
            },
            {
                barbershop_id: barbershop.id,
                name: 'Fade Profesional',
                description: 'Degradado profesional con diseño',
                category: 'corte',
                price: 6500,
                duration_minutes: 40,
            },
            {
                barbershop_id: barbershop.id,
                name: 'Barba Completa',
                description: 'Perfilado y arreglo de barba',
                category: 'barba',
                price: 3500,
                duration_minutes: 20,
            },
            {
                barbershop_id: barbershop.id,
                name: 'Combo Premium Flow',
                description: 'Corte + Barba + Bebida signature',
                category: 'combo',
                price: 8500,
                duration_minutes: 60,
            },
            {
                barbershop_id: barbershop.id,
                name: 'Corte Niño',
                description: 'Corte para menores de 12 años',
                category: 'corte',
                price: 4000,
                duration_minutes: 25,
            },
            {
                barbershop_id: barbershop.id,
                name: 'Tratamiento Capilar',
                description: 'Hidratación y tratamiento del cuero cabelludo',
                category: 'tratamiento',
                price: 4500,
                duration_minutes: 30,
            },
        ],
    });
    console.log(`✅ ${services.count} services created\n`);

    // 5. Create Schedules for Barbers
    console.log('📅 Creating schedules...');

    // Carlos - Lunes a Viernes 9:00-18:00, Sábado 10:00-14:00
    const carlosSchedules = [];
    for (let day = 1; day <= 5; day++) {
        carlosSchedules.push({
            barbershop_id: barbershop.id,
            barber_id: barber1.id,
            day_of_week: day,
            start_time: '09:00',
            end_time: '18:00',
        });
    }
    carlosSchedules.push({
        barbershop_id: barbershop.id,
        barber_id: barber1.id,
        day_of_week: 6,
        start_time: '10:00',
        end_time: '14:00',
    });

    // Miguel - Martes a Sábado 10:00-19:00
    const miguelSchedules = [];
    for (let day = 2; day <= 6; day++) {
        miguelSchedules.push({
            barbershop_id: barbershop.id,
            barber_id: barber2.id,
            day_of_week: day,
            start_time: '10:00',
            end_time: '19:00',
        });
    }

    await prisma.schedule.createMany({
        data: [...carlosSchedules, ...miguelSchedules],
    });
    console.log(`✅ Schedules created for both barbers\n`);

    // 6. Create Sample Clients
    console.log('👥 Creating sample clients...');
    const clients = await prisma.client.createMany({
        data: [
            {
                barbershop_id: barbershop.id,
                full_name: 'Juan Pérez',
                email: 'juan.perez@email.com',
                phone: '+54 11 6666-1111',
                notes: 'Prefiere cortes cortos',
            },
            {
                barbershop_id: barbershop.id,
                full_name: 'Roberto García',
                email: 'roberto.garcia@email.com',
                phone: '+54 11 5555-2222',
                notes: 'Cliente frecuente, le gusta el fade',
            },
            {
                barbershop_id: barbershop.id,
                full_name: 'Diego Martínez',
                phone: '+54 11 4444-3333',
                notes: 'Viene cada 15 días',
            },
        ],
    });
    console.log(`✅ ${clients.count} clients created\n`);

    // 7. Create Payment Methods
    console.log('💳 Creating payment methods...');
    await prisma.paymentMethod.createMany({
        data: [
            {
                barbershop_id: barbershop.id,
                method_type: 'cash',
                display_name: 'Efectivo',
                is_active: true,
            },
            {
                barbershop_id: barbershop.id,
                method_type: 'transfer',
                display_name: 'Transferencia Bancaria',
                account_info: JSON.stringify({
                    bank: 'Banco Galicia',
                    account: '0000003100012345678901',
                    cbu: '0070003130000012345678',
                    alias: 'FLOW.BARBER',
                }),
                is_active: true,
            },
            {
                barbershop_id: barbershop.id,
                method_type: 'mercadopago',
                display_name: 'Mercado Pago',
                account_info: JSON.stringify({
                    phone: '+5491199990000',
                    alias: 'flowbarber.mp',
                }),
                is_active: true,
            },
            {
                barbershop_id: barbershop.id,
                method_type: 'card',
                display_name: 'Tarjeta (POS)',
                is_active: true,
            },
        ],
    });
    console.log(`✅ Payment methods created\n`);

    console.log('✨ Seed completed successfully!\n');
    console.log('📝 Login credentials:');
    console.log('   Email: admin@barber.com');
    console.log('   Password: admin123\n');
    console.log('   Barber 1: carlos@barber.com / barber123');
    console.log('   Barber 2: miguel@barber.com / barber123\n');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
