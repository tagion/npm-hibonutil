import { Server } from "../src/server/server"; // Adjust this import

let server: Server;

beforeAll(async () => {
  server = new Server(3000);
  server.defaultSettings();
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("Server Tests", () => {
  it("should handle a request", async () => {
    // Your test code here
  });

  // Additional tests...
});
