import { Server } from "../../src/server/server";
import * as res from "../res/validateTestData";
import axios from "axios";

const server: Server = new Server();
const VALIDATE_URL = `http://localhost:${server.port}/hibonutil/validate`;

describe("Test /validate endpoint", () => {
  it("should return no error for valid JSON", async () => {
    const response = await axios.post(VALIDATE_URL, res.inputValidJSON);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(res.outputValidJSON);
  });

  it("should return error for invalid JSON", async () => {
    const response = await axios.post(VALIDATE_URL, res.inputInvalidTime);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(res.outputInvalidTime);
  });
});
