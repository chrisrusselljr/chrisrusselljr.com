import { prisma } from "../utils/db";

export const guestbookLoader = async () => {
  return await prisma.guestbook.findMany({
    select: {
      id: true,
      name: true,
      content: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
