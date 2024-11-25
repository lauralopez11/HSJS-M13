import { NextResponse } from 'next/server';
import data from '@/app/database';

export async function GET(request, { params }) {
  const { userId } = params;
  try {
    const user = await data.getUserById(parseInt(userId));
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { userId } = params;
  try {
    const body = await request.json();
    const editedUser = await data.updateUser(parseInt(userId), body);
    return NextResponse.json(editedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { userId } = params;
  try {
    const deletedUser = await data.removeUser(parseInt(userId));
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
