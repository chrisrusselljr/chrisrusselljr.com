import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/index";
import { type User } from "../types/index";
import pkg from 'lightcookie';
const {parse} = pkg;


export async function isLoggedIn(req) {
  let user = {} as authUser;
  const cookie = req.headers.get("cookie");

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
        }
      });
    }
  }

  return {
    ...user,
  };
}
