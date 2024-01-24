import { Server } from "../src/server/server";
import axios from "axios";

const server: Server = new Server();
const URL = `http://localhost:${server.port}`;

beforeAll(async () => {
  server.defaultSettings();
  server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("Test server healthcheck", () => {
  it("should check Swagger API docs is available", async () => {
    const response = await axios.get(`${URL}/docs`);
    expect(response.status).toBe(200);
    expect(response.data).toContain("Swagger UI");
  });
});
