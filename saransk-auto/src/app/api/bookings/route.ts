import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

        let decoded: { userId: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        } catch {
            return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });

        const body = await request.json();
        const { carId, startDate, endDate, totalAmount } = body;

        if (!carId || !startDate || !endDate || totalAmount == null) {
            return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) return NextResponse.json({ error: 'Дата начала должна быть раньше окончания' }, { status: 400 });

        const car = await prisma.car.findUnique({ where: { id: carId } });
        if (!car || !car.isAvailable) return NextResponse.json({ error: 'Автомобиль недоступен' }, { status: 400 });

        const conflict = await prisma.booking.findFirst({
            where: {
                carId,
                status: { in: ['PENDING', 'CONFIRMED'] },
                OR: [
                    { startDate: { lte: start }, endDate: { gt: start } },
                    { startDate: { lt: end }, endDate: { gte: end } }
                ]
            }
        });

        if (conflict) return NextResponse.json({ error: 'Автомобиль уже забронирован на эти даты' }, { status: 409 });

        const booking = await prisma.booking.create({
            data: {
                userId: user.id,
                carId,
                startDate: start,
                endDate: end,
                totalAmount: Number(totalAmount),
                status: 'PENDING'
            },
            include: {
                user: { select: { name: true, email: true } },
                car: { select: { brand: true, model: true } }
            }
        });

        return NextResponse.json({ message: 'Бронирование создано', booking }, { status: 201 });
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}