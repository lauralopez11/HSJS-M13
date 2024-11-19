import { PrismaClient } from '@prisma/client';
const database = new PrismaClient();

export async function getUsers() {
  return database.user.findMany();
}
export async function getUserById(userId) {
  return database.user.findUnique({ where: { id: userId } });
}
export async function getUserByEmail(email) {
  return database.user.findUnique({ where: { email } });
}
export async function addUser(user) {
  return database.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role
    }
  });
}
export async function removeUser(userId) {
  return database.user.delete({
    where: { id: userId }
  });
}
export async function updateUser(userId, updatedUser) {
  return database.user.update({
    where: { id: userId },
    data: updatedUser
  });
}
export async function getUserMeets(userId) {
  return database.meet.findMany({
    where: {
      meeting: {
        some: {
          user_id: userId
        }
      }
    }
  });
}
export async function getMeets() {
  return database.meet.findMany();
}
export async function getMeetById(meetId) {
  return database.meet.findUnique({ where: { id: meetId } });
}
export async function addMeet(meet) {
  return database.meet.create({
    data: {
      title: meet.title,
      date: meet.date,
      description: meet.description
    }
  });
}
export async function removeMeet(meetId) {
  return database.meet.delete({
    where: { id: meetId }
  });
}
export async function updateMeet(meetId, updatedMeet) {
  return database.meet.update({
    where: { id: meetId },
    data: updatedMeet
  });
}
export async function getMeetUsers(meetId) {
  return database.user.findMany({
    where: {
      meeting: {
        some: {
          meet_id: meetId
        }
      }
    }
  });
}
export async function setMeetUsers(meetId, userIds) {
  await database.$transaction(async (tx) => {
    await tx.meeting.deleteMany({
      where: { meet_id: meetId }
    });

    for (const userId of userIds) {
      await tx.meeting.create({
        data: {
          user_id: userId,
          meet_id: meetId
        }
      });
    }
  });
}
