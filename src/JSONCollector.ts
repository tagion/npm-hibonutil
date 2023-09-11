import fs from "fs";
import path from "path";
import crypto from "crypto";
import { HiBONType } from "./hibon/HiBON";

export class JSONCollector {
  public readonly filename: string;

  constructor() {
    this.filename = JSONCollector.generateFilename();

    const directory = path.dirname(this.filename);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  static generateFilename(): string {
    const randomBytes = crypto.randomBytes(4).toString("hex").toUpperCase();
    const timestamp = Date.now();

    const filename = `tmp/tmp${randomBytes}${timestamp}.json`;

    return filename;
  }

  public updateJSON(key: string, type: string, value: string | number): void {
    let jsonData: Record<string, string | number | [string, string | number]> =
      {};

    if (fs.existsSync(this.filename)) {
      const fileContent = fs.readFileSync(this.filename, "utf8");

      try {
        jsonData = JSON.parse(fileContent);
      } catch (error) {
        console.error(`Error parsing JSON file '${this.filename}': ${error}`);
        return;
      }
    }

    if (type === HiBONType.BOOLEAN || type === HiBONType.STRING) {
      jsonData[key] = value;
    } else {
      jsonData[key] = [type, value];
    }

    console.log(`JSON: ${JSON.stringify(jsonData, null, 2)}`);

    fs.writeFileSync(this.filename, JSON.stringify(jsonData, null, 2), "utf8");
  }

  public cleanup() {
    fs.existsSync(this.filename) && fs.unlinkSync(this.filename);
  }
}
