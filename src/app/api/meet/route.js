import { NextResponse } from 'next/server';
import data from '@/app/database';

export async function GET() {
  try {
    const meets = await data.getMeets();
    return NextResponse.json(meets);
  } catch (error) {
    console.error('Error getting meet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const addedMeet = await data.addMeet(body);
    return NextResponse.json(addedMeet, { status: 201 });
  } catch (error) {
    console.error('Error adding meet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
