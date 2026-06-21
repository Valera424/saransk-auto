import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.booking.deleteMany();
    await prisma.car.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Старые данные удалены');

    const cars = [
        {
            brand: 'LADA',
            model: 'Vesta',
            year: 2024,
            type: 'CARSHARE',
            pricePerDay: 2500,
            leasePrice: 35000,
            imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600',
            isAvailable: true,
        },
        {
            brand: 'KIA',
            model: 'Rio',
            year: 2024,
            type: 'CARSHARE',
            pricePerDay: 2800,
            leasePrice: 38000,
            imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600',
            isAvailable: true,
        },
        {
            brand: 'Hyundai',
            model: 'Solaris',
            year: 2023,
            type: 'BOTH',
            pricePerDay: 2700,
            leasePrice: 37000,
            imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600',
            isAvailable: true,
        },
        {
            brand: 'Volkswagen',
            model: 'Polo',
            year: 2024,
            type: 'LEASING',
            pricePerDay: 3200,
            leasePrice: 42000,
            imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600',
            isAvailable: true,
        },
        {
            brand: 'Skoda',
            model: 'Rapid',
            year: 2024,
            type: 'CARSHARE',
            pricePerDay: 2900,
            leasePrice: 39000,
            imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
            isAvailable: true,
        },
        {
            brand: 'Renault',
            model: 'Logan',
            year: 2023,
            type: 'BOTH',
            pricePerDay: 2400,
            leasePrice: 33000,
            imageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600',
            isAvailable: true,
        },
    ];

    for (const car of cars) {
        await prisma.car.create({ data: car });
    }

    console.log('✅ Добавлено 6 автомобилей в базу данных');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());