const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const url = `${API_BASE_URL}/api/books/pagination${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
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
        message: "Placeholder: backend pagination API is unavailable at http://localhost:8080.",
      },
      { status: 503 },
    );
  }
}
