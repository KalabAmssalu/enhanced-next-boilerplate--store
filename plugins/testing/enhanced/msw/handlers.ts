import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock API endpoints
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ]);
  }),

  http.get("/api/users/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id: Number(id),
      name: "John Doe",
      email: "john@example.com",
    });
  }),

  http.post("/api/users", async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json({ id: Date.now(), ...newUser }, { status: 201 });
  }),

  http.put("/api/users/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedUser = await request.json();
    return HttpResponse.json({
      id: Number(id),
      ...updatedUser,
    });
  }),

  http.delete("/api/users/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      { message: `User ${id} deleted` },
      { status: 200 }
    );
  }),

  // Mock external APIs
  http.get("https://api.example.com/data", () => {
    return HttpResponse.json({
      data: "Mocked external API response",
    });
  }),
];
