import { Server } from "../../src/server/server";
import * as res from "../res/validateTestData";
import axios from "axios";

const server: Server = new Server();
const VALIDATE_URL = `http://localhost:${server.port}/hibonutil/validate`;

beforeAll(async () => {
  server.defaultSettings();
  server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("Test /validate endpoint", () => {
  it("should return no error for valid JSON", async () => {
    const response = await axios.post(VALIDATE_URL, res.inputValidJSON);
    expect(response.status).toBe(200);

    console.log("Expect ", response.data, " to be ", res.outputValidJSON);
    expect(response.data).toBe(res.outputValidJSON);
  });

  it.skip("should return error for invalid JSON", async () => {});
});
