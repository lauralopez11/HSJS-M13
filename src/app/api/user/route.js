import { NextResponse } from 'next/server';
import data from '@/app/database';

export async function GET() {
  try {
    const users = await data.getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const addedUser = await data.addUser(body);
    return NextResponse.json(addedUser, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
