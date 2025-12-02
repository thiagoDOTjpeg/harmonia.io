import app from "@/main/app";
import { describe, expect } from '@jest/globals';
import request from "supertest";


describe("Health Check Integration ", () => {
  it("should return status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  })
})