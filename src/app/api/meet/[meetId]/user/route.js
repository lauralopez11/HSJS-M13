import { NextResponse } from 'next/server';
import data from '@/app/database';

export async function GET(request, { params }) {
  const { meetId } = params;
  try {
    const meetUsers = await data.getMeetsUsers(parseInt(meetId));
    return NextResponse.json(meetUsers);
  } catch (error) {
    console.error('Error getting meet user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { meetId } = params;
  try {
    const body = await request.json();
    const { userIds } = body;
    await data.setMeetUsers(parseInt(meetId), userIds);
    return NextResponse.json({ message: 'Users for meet set successfully' });
  } catch (error) {
    console.error('Error setting meet user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
