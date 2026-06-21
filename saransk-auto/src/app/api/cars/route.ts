import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const cars = await prisma.car.findMany({
            where: { isAvailable: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(cars);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Ошибка загрузки автомобилей' }, { status: 500 });
    }
}