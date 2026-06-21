import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, password } = body;

        console.log('Registration attempt:', { name, email, phone });

        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { error: 'Заполните все поля' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Пользователь уже существует' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role: 'CLIENT',
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
            },
        });

        console.log('User created:', user);

        return NextResponse.json(
            {
                message: 'Регистрация успешна',
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Ошибка сервера', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}