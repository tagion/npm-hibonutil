import { Server } from "../src/server/server";
import axios from "axios";

const server: Server = new Server();
const URL = `http://localhost:${server.port}`;
let consoleSpy: jest.SpyInstance;

beforeAll(async () => {
  // Disable console.log for this test
  consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  server.defaultSettings();
  server.start();
});

afterAll(async () => {
  await server.stop();

  // Enable console.log after tests
  consoleSpy.mockRestore();
});

describe("Test server healthcheck", () => {
  it("should check Swagger API docs is available", async () => {
    const response = await axios.get(`${URL}/docs`);
    expect(response.status).toBe(200);
    expect(response.data).toContain("Swagger UI");
  });
});
