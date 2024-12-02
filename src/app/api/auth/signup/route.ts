import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const database = new PrismaClient();

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface ErrorResponse {
  username?: string;
  email?: string;
  password?: string;
  error?: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

export async function POST(
  req: Request
): Promise<NextResponse<RegisterResponse | ErrorResponse>> {
  const { username, email, password }: RegisterRequestBody = await req.json();

  if (!username || !email || !password) {
    const error: ErrorResponse = {
      username: !username ? 'Field is required' : undefined,
      email: !email ? 'Field is required' : undefined,
      password: !password ? 'Field is required' : undefined,
    };
    return NextResponse.json(error, { status: 400 });
  }

  const existingUser = await database.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { email: 'Email is already in use.' } as ErrorResponse,
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await database.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' } as ErrorResponse,
      { status: 500 }
    );
  }
}
