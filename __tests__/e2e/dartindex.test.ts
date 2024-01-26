import { Server } from "../../src/server/server";
import * as res from "../res/dartindexTestData";
import axios from "axios";

const server: Server = new Server();
const DARTINDEX_URL = `http://localhost:${server.port}/hibonutil/dartindex`;
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

describe("Test /dartindex endpoint", () => {
  it("should return correct DARTIndex for valid JSON", async () => {
    const response = await axios.post(DARTINDEX_URL, res.inputJSON);
    expect(response.status).toBe(200);
    expect(response.data.dartindex).toBe(res.outputForJSON);
  });

  it("should return correct DARTIndex for empty payload", async () => {
    const response = await axios.post(DARTINDEX_URL, {});
    expect(response.status).toBe(200);
    expect(response.data.dartindex).toBe(res.outputForEmptyJSON);
  });

  it("should return 400 for invalid JSON format", async () => {
    const response = await axios.post(DARTINDEX_URL, "This is not JSON");
    expect(response.status).toBe(200);
    expect(response.data.dartindex).toBe(res.outputForEmptyJSON);
  });
});
