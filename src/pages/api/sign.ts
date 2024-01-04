import type { APIRoute } from "astro";
import { prisma } from "../../utils/db";
import { type User } from "../../types/index";
import jwt from "jsonwebtoken";
import pkg from 'lightcookie';
const {parse} = pkg;

import { JWT_SECRET } from "../../constants/index";

export const post: APIRoute = async ({ request }) => {
  let user = {} as User;
  const cookie = request.headers.get("cookie");

  if (cookie) {
    const parsed = parse(cookie);

    if (parsed.__session_crj) {
      jwt.verify(parsed.__session_crj, JWT_SECRET, (e, decoded) => {
        if (!e && !!decoded) {
          user = {
            userId: decoded.userId,
            userName: decoded.userName,
            userEmail: decoded.userEmail,
            userPicture: decoded.userPicture,
          };
        }
      });
    }
  }

  const body = await request.json();
  const content = body.content;

  const userName = user.userName;
  const userId = user.userId;
  const userEmail = user.userEmail;
  const userPicture = user.userPicture;

  await prisma.post.create({
    data: {
      content: content,
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      userPicture: userPicture,
    },
  });

  // console.log(newPost);

  return new Response(null, {
    status: 200,
  });
};
