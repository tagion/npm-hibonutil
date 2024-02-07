import { Server } from "../../src/server/server";
import * as res from "../res/dartindexTestData";
import axios from "axios";

const server: Server = new Server();
const DARTINDEX_URL = `http://localhost:${server.port}/hibonutil/dartindex`;

describe("Test /dartindex endpoint", () => {
  it("should return correct DARTIndex for valid JSON", async () => {
    const response = await axios.post(DARTINDEX_URL, res.sampleJSON);
    expect(response.status).toBe(200);
    expect(response.data.dartindex).toBe(res.sampleDARTIndex);
  });

  it("should return correct DARTIndex for empty payload", async () => {
    const response = await axios.post(DARTINDEX_URL, {});
    expect(response.status).toBe(200);
    expect(response.data.dartindex).toBe(res.emptyDARTIndex);
  });

  it("should return 400 for invalid JSON format", async () => {
    const response = await axios.post(DARTINDEX_URL, "This is not JSON");
    expect(response.status).toBe(200);
    expect(response.data.dartindex).toBe(res.emptyDARTIndex);
  });
});
