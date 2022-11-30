import type { APIContext } from "astro";
import { prisma } from "../../utils/db";

export async function post({ request }: APIContext) {
  const body = (await request.json()) as { postId: number };

  try {
    await prisma.post.update({
      where: {
        postId: body.postId,
      },
      data: {
        published: false,
      },
    });

    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
