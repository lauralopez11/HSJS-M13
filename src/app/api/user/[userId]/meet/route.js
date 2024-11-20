import { NextResponse } from 'next/server';
import data from '@/app/database';

export async function GET(request, { params }) {
  const { userId } = params;
  try {
    const userMeet = await data.getUserMeet(parseInt(userId));
    return NextResponse.json(userMeet);
  } catch (error) {
    console.error('Error getting user meet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { userId } = params;
  try {
    const body = await request.json();
    const { meetIds } = body;
    await data.setUserMeet(parseInt(userId), meetIds);
    return NextResponse.json({ message: 'Meet for user set successfully' });
  } catch (error) {
    console.error('Error setting user meet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
