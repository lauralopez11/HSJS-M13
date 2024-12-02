import { auth } from '@/app/auth';
import database from '@/app/database';
import { EventData } from '@/types/schedule';
import { NextAuthRequest } from 'next-auth/lib';
import { NextResponse } from 'next/server';

// @ts-ignore
export const GET = auth(async function (
  request: NextAuthRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  if (!request.auth || !request.auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const event = await database.event.findUnique({
      where: { id: eventId },
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

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// @ts-ignore
export const PUT = auth(async function (
  request: NextAuthRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  if (!request.auth || !request.auth.user) {
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

    // Find the event to ensure the user is the author
    const event = await database.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.authorId !== request.auth.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log(participants);

    // Update the event
    const updatedEvent = await database.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        participants: {
          set: participants.map((participantId) => ({ id: participantId })), // Adjust relation
        },
      },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// @ts-ignore
export const PATCH = auth(async function (
  request: NextAuthRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;

  if (!request.auth || !request.auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      title,
      description,
      startDate,
      endDate,
      participants,
    }: Partial<{
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      participants: string[];
    }> = await request.json();

    // Find the event to ensure the user is the author
    const event = await database.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.authorId !== request.auth.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Prepare data for update, only update fields that were provided
    const updatedData: any = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (startDate) updatedData.startDate = new Date(startDate);
    if (endDate) updatedData.endDate = new Date(endDate);
    if (participants)
      updatedData.participants = {
        connect: participants.map((userId) => ({ id: userId })),
      };

    // Perform the update
    const updatedEvent = await database.event.update({
      where: { id: eventId },
      data: updatedData,
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// @ts-ignore
export const DELETE = auth(async function (
  request: NextAuthRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;

  if (!request.auth || !request.auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const event = await database.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        {
          status: 404,
        }
      );
    }

    if (event.authorId !== request.auth.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        {
          status: 403,
        }
      );
    }

    const deletedEvent = await database.event.delete({
      where: {
        id: eventId,
      },
    });
    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
