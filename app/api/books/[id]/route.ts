const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function PUT(request: Request, context: RouteContext<"/api/books/[id]">) {
  const { id } = await context.params;

  return proxy(`${API_BASE_URL}/api/books/${id}`, {
    body: await request.text(),
    headers: { "content-type": "application/json" },
    method: "PUT",
  });
}

export async function DELETE(_request: Request, context: RouteContext<"/api/books/[id]">) {
  const { id } = await context.params;

  return proxy(`${API_BASE_URL}/api/books/${id}`, {
    method: "DELETE",
  });
}

async function proxy(url: string, init?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
    });
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
        message: "Placeholder: backend API is unavailable at http://localhost:8080.",
      },
      { status: 503 },
    );
  }
}
