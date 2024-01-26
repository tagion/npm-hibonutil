import { Server } from "../../src/server/server";
import * as res from "../res/convertTestData";
import axios from "axios";

const server: Server = new Server();
const CONVERT_URL = `http://localhost:${server.port}/hibonutil/convert`;
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

describe("Test /convert endpoint", () => {
  it("should return correct data in default format", async () => {
    const response = await axios.post(CONVERT_URL, res.inputJSON);
    expect(response.status).toBe(200);
    const responseBodyHex = Buffer.from(response.data).toString("hex");
    expect(responseBodyHex).toBe(res.outputHexForJSON);
  });

  it("should return correct data in octet-stream format", async () => {
    const response = await axios.post(
      CONVERT_URL + "?format=octet-stream",
      res.inputJSON
    );
    expect(response.status).toBe(200);
    const responseBodyHex = Buffer.from(response.data).toString("hex");
    expect(responseBodyHex).toBe(res.outputHexForJSON);
  });

  it("should return correct data in base64 format", async () => {
    const response = await axios.post(
      `${CONVERT_URL}?format=base64`,
      res.inputJSON
    );
    expect(response.status).toBe(200);
    expect(response.data).toBe(res.outputBase64ForJSON);
  });

  it("should return empty body for invalid JSON", async () => {
    const response = await axios.post(`${CONVERT_URL}`, res.inputInvalidTime);
    expect(response.status).toBe(200);
    expect(response.data).toBe("");
  });

  it("should return correct response for empty JSON", async () => {
    const response = await axios.post(`${CONVERT_URL}?format=base64`, {});
    expect(response.status).toBe(200);
    expect(response.data).toBe(res.outputBase64EmptyJSON);
  });
});
