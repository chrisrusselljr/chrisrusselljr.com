import { AUTH_COOKIE_NAME, JWT_SECRET, PUBLIC_SIGN_IN_WITH_GOOGLE_CLIENT_ID } from "./../../constants/index";
import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import { prisma } from "../../utils/db";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../types/index";

import { setUser, userData } from "../../atoms/index";

function sevenDaysFromNow() {
  const d = new Date();
  const time = 7 * 24 * 60 * 60 * 1000;
  d.setTime(d.getTime() + time);
  return d.toUTCString();
}

export default function createHeaders({ jwt, location }) {
  const expires = sevenDaysFromNow();
  const headers = new Headers();

  headers.append("Set-Cookie", `${AUTH_COOKIE_NAME}=${jwt}; Expires=${expires}; Path=/; HttpOnly; Secure;`);
  headers.append("Location", location);

  return headers;
}

export const createToken = ({ userId, userName, userEmail, userPicture }: User) =>
  jwt.sign({ userId, userName, userEmail, userPicture }, JWT_SECRET, { expiresIn: "7d" });

export const post: APIRoute = async ({ request }) => {
  const CLIENT_ID = PUBLIC_SIGN_IN_WITH_GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);
  const body = (await request.json()) as { token: string };
  const token = body.token;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();

  //   find user or create one if its a new sign in

  const upsertUser = await prisma.user.upsert({
    where: {
      email: payload.email,
    },
    update: {},
    create: {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    },
  });

  const jwt = createToken({
    userId: upsertUser.userId,
    userName: payload.name,
    userEmail: payload.email,
    userPicture: payload.picture, //!= null ? payload.picture : undefined
  });
  const headers = createHeaders({ jwt, location: "/guestbook" });

  setUser({
    userId: upsertUser.userId,
    userName: payload.name,
    userEmail: payload.email,
    userPicture: payload.picture,
  });

  return new Response(null, {
    status: 200,
    headers,
  });
};
