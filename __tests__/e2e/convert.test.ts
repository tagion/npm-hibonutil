import { Server } from "../../src/server/server";
import * as res from "../res/convertTestData";
import axios from "axios";

const server: Server = new Server();
const CONVERT_URL = `http://localhost:${server.port}/hibonutil/convert`;

describe("Test /convert/tohibon endpoint", () => {
  const CONVERT_TOHIBON_URL = CONVERT_URL + "/tohibon";

  it("should return correct data in default format", async () => {
    const response = await axios.post(CONVERT_TOHIBON_URL, res.sampleJSON, {
      responseType: "arraybuffer",
    });
    expect(response.status).toBe(200);
    expect(Buffer.from(response.data)).toEqual(res.sampleHiBONBuffer);
  });

  it("should return correct data in octet-stream format", async () => {
    const response = await axios.post(
      CONVERT_TOHIBON_URL + "?format=octet-stream",
      res.sampleJSON,
      { responseType: "arraybuffer" }
    );
    expect(response.status).toBe(200);
    expect(Buffer.from(response.data)).toEqual(res.sampleHiBONBuffer);
  });

  it("should return correct data in base64 format", async () => {
    const response = await axios.post(
      `${CONVERT_TOHIBON_URL}?format=base64`,
      res.sampleJSON
    );
    expect(response.status).toBe(200);
    expect(response.data).toBe(res.sampleHiBONBase64);
  });

  it("should return empty body for invalid JSON", async () => {
    const response = await axios.post(
      `${CONVERT_TOHIBON_URL}`,
      res.inputInvalidTime
    );
    expect(response.status).toBe(200);
    expect(response.data).toBe("");
  });

  it("should return correct response for empty JSON", async () => {
    const response = await axios.post(
      `${CONVERT_TOHIBON_URL}?format=base64`,
      {}
    );
    expect(response.status).toBe(200);
    expect(response.data).toBe(res.emptyHiBONBase64);
  });
});

describe("Test /convert/tojson endpoint", () => {
  const CONVERT_TOJSON_URL = CONVERT_URL + "/tojson";

  it("should return correct JSON", async () => {
    const response = await axios.post(
      CONVERT_TOJSON_URL,
      res.sampleHiBONBuffer,
      {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data).toEqual(res.sampleJSON);
  });
});
