import { AUTH_COOKIE_NAME } from "../../constants/index";

export async function get() {
  const headers = new Headers();

  headers.append("Set-Cookie", `${AUTH_COOKIE_NAME}=""; Max-Age=1; Path=/; HttpOnly; Secure;`);
  headers.append("Location", "/guestbook");

  return new Response(null, {
    status: 302,
    headers,
  });
}
