import {
  ExecutionResult,
  runBinary,
  runBinaryWithBuffer,
  generateTempFilename,
} from "./utils.js";
import os from "os";
import path from "path";
import fs from "fs";
import { HiBON } from "../hibon/HiBON.js";

export class hibonutil {
  readonly name: string = "hibonutil";

  static isInstalled(): boolean {
    const result = runBinary("which", [this.name]);
    return result.output.length > 0 && result.code === 0;
  }

  static help() {
    return runBinary(this.name, ["-h"]);
  }

  static sample(): ExecutionResult {
    return runBinary(this.name, ["--sample"]);
  }

  static fromJSON(buffer: Buffer, pretty: boolean = true): Buffer | null {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, generateTempFilename("json"));

    try {
      fs.writeFileSync(tempFilePath, buffer);

      return runBinaryWithBuffer(this.name, [
        pretty ? "-pc" : "-c",
        tempFilePath,
      ]);
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (cleanupError) {
        console.error(`Error cleaning up temporary file: ${cleanupError}`);
      }
    }
  }

  static getDARTIndex(json: HiBON): string | null {
    const tempDir = os.tmpdir();
    const tempFilePrefix = path.join(tempDir, generateTempFilename(""));

    const tempJson = tempFilePrefix + "json";
    const tempHibon = tempFilePrefix + "hibon";

    try {
      fs.writeFileSync(tempJson, json.toJSONBuffer());

      // Convert JSON to HiBON
      let result = runBinary(this.name, [tempJson]);
      if (result.code != 0) {
        console.error(
          `Error converting ${tempJson} file to HiBON: ${result.output}`
        );

        return null;
      }

      // Get DART index from HiBON
      result = runBinary(this.name, [tempHibon, "-ctH"]);
      if (result.code != 0) {
        console.error(
          `Error calculating DART index of ${tempHibon}: ${result.output}`
        );

        return null;
      }

      return result.output;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      try {
        if (fs.existsSync(tempJson)) {
          fs.unlinkSync(tempJson);
        }

        if (fs.existsSync(tempHibon)) {
          fs.unlinkSync(tempHibon);
        }
      } catch (cleanupError) {
        console.error(`Error cleaning up temporary file: ${cleanupError}`);
      }
    }
  }
}
