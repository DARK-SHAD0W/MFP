import request from "supertest";
import app from "./app";

describe("GET /health", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("404 handler", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/nonexistent");
    expect(res.status).toBe(404);
  });
});
