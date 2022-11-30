import type { APIRoute } from "astro";
import { prisma } from "../../utils/db";
import { userData } from "../../atoms/index";
import { User } from "../../types/index";
import { parse } from "lightcookie";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../constants/index";
import { setUser } from "../../atoms/index";

export const post: APIRoute = async ({ params, request }) => {
  let user = {} as authUser;
  const cookie = request.headers.get("cookie");

  interface authUser extends User {
    authed: boolean;
  }

  if (cookie) {
    const parsed = parse(cookie);

    if (parsed.__session_crj) {
      jwt.verify(parsed.__session_crj, JWT_SECRET, (e, decoded) => {
        if (!e && !!decoded) {
          user = {
            authed: true,
            userId: decoded.userId,
            userName: decoded.userName,
            userEmail: decoded.userEmail,
            userPicture: decoded.userPicture,
          };

          setUser({
            userId: user.userId,
            userName: user.userName,
            userEmail: user.userEmail,
            userPicture: user.userPicture,
          });
        }
      });
    }
  }

  const body = await request.json();
  const content = body.content;

  const userName = userData.get().userName;
  const userId = userData.get().userId;
  const userEmail = userData.get().userEmail;
  const userPicture = userData.get().userPicture;

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
