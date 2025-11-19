import prismaClient from "../db/client";

const validateSession = async (sessionId: number) => {
  const session = await prismaClient.session.findUnique({
    where: { id: sessionId },
  });
  if (!session) return false;

  const expired = session.expiresAt.getTime() - Date.now() <= 0;

  if (expired) {
    await prismaClient.session.delete({
      where: { id: sessionId },
    });
    return false;
  }

  return true;
};

const deleteSession = async (sessinId: number) => {};
