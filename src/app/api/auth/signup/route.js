// pages/api/auth/register.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const database = new PrismaClient();

export async function POST(req) {
  const { username, email, password } = await req.json();

  // Basic validation
  const error = {};
  if (!username) {
    error.username = 'Field is required';
  }
  if (!email) {
    error.email = 'Field is required';
  }
  if (!password) {
    error.password = 'Field is required';
  }

  const existingUser = await database.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    error.email = 'Email is already in use.';
  }

  if (Object.keys(error).length !== 0) {
    return NextResponse.json(error, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await database.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'User registered successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
