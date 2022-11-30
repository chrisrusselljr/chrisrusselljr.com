export async function revalidateMessages(id: string) {
  const url = new URL(window.location.toString());

  const html = await fetch(url.toString(), {
    method: "GET",
  }).then((res) => res.text());

  const p = new DOMParser();
  const doc = p.parseFromString(html, "text/html");
  document.querySelector(id)!.replaceWith(doc.querySelector(id)!);
}
