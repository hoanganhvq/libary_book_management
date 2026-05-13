const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim();

  if (!title) {
    return Response.json([]);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/books/search?title=${encodeURIComponent(title)}`,
      { cache: "no-store" },
    );
    const body = await response.text();

    return new Response(body, {
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
      },
      status: response.status,
      statusText: response.statusText,
    });
  } catch {
    return Response.json(
      {
        message: "Placeholder: backend search API is unavailable at http://localhost:8080.",
      },
      { status: 503 },
    );
  }
}
