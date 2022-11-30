import { prisma } from "../utils/db";

export const guestbookLoader = async () => {
  return await prisma.post.findMany({
    select: {
      postId: true,
      content: true,
      userId: true,
      userName: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      published: true,
    },
  });
};
