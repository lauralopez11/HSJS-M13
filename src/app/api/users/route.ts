import { auth } from '@/app/auth';
import database from '@/app/database';
import { NextAuthRequest } from 'next-auth/lib';
import { NextResponse } from 'next/server';

export const GET = auth(async function (request: NextAuthRequest) {
  if (!request.auth || !request.auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await database.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
