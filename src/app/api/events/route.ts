import { auth } from '@/app/auth';
import database from '@/app/database';
import { Event, EventData } from '@/types/schedule';
import { NextAuthRequest } from 'next-auth/lib';
import { NextResponse } from 'next/server';

export const GET = auth(async function (request: NextAuthRequest) {
  if (
    !request.auth ||
    !request.auth.user ||
    request.auth.user.id === undefined
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = request.auth.user.id;

  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  const roleParam = searchParams.get('role');

  try {
    const whereClause: any = {};

    if (roleParam === 'author') {
      whereClause.authorId = userId;
    } else if (roleParam === 'participant') {
      whereClause.participants = { some: { id: userId } };
    } else if (roleParam === null) {
      whereClause.OR = [
        { participants: { some: { id: userId } } },
        { authorId: userId },
      ];
    } else {
      return NextResponse.json(
        { error: 'Invalid role parameter' },
        { status: 400 }
      );
    }

    if (startDateParam) {
      whereClause.startDate = { gte: new Date(startDateParam) };
    }

    if (endDateParam) {
      whereClause.endDate = { lte: new Date(endDateParam) };
    }

    const userEvents = await database.event.findMany({
      where: whereClause,
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return NextResponse.json(userEvents, { status: 200 });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = auth(async function (request: NextAuthRequest) {
  if (
    !request.auth ||
    !request.auth.user ||
    request.auth.user.id === undefined
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, startDate, endDate, participants }: EventData =
      await request.json();

    if (!title || !startDate || !endDate || !participants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the new event in the database
    const event = await database.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        authorId: request.auth.user.id,
        participants: {
          connect: participants.map((participantId) => ({ id: participantId })), // Adjust relation
        },
      },
    });

    // Return the newly created event
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
