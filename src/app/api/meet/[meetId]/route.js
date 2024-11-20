import { NextResponse } from 'next/server';
import data from '@/app/database';

export async function GET(request, { params }) {
  const { meetId } = params;
  try {
    const meet = await data.getMeetsById(parseInt(meetId));
    if (meet) {
      return NextResponse.json(meet);
    } else {
      return NextResponse.json({ error: 'Meet not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting meet by ID:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { meetId } = params;
  try {
    const body = await request.json();
    const editedMeet = await data.updateMeet(parseInt(meetId), body);
    return NextResponse.json(editedMeet);
  } catch (error) {
    console.error('Error updating meet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { meetId } = params;
  try {
    const deletedMeet = await data.removeMeet(parseInt(meetId));
    return NextResponse.json(deletedMeet);
  } catch (error) {
    console.error('Error deleting meet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
