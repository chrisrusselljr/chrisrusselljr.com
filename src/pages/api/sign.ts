import type { APIRoute } from "astro";
import { prisma } from "../../utils/db";
import { userData } from "../../atoms/index";

export const post: APIRoute = async ({ request }) => {
  const body = await request.json();
  const content = body.content;

  const userName = userData.get().userName;
  const userId = userData.get().userId;
  const userEmail = userData.get().userEmail;
  const userPicture = userData.get().userPicture;

  const newPost = await prisma.post.create({
    data: {
      content: content,
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      userPicture: userPicture,
    },
  });

  console.log(newPost);

  return new Response(null, {
    status: 200,
  });
};
