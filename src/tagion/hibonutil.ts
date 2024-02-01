import {
  ExecutionResult,
  runBinary,
  runBinaryWithBuffer,
  generateTempFilename,
} from "./utils.js";
import os from "os";
import path from "path";
import fs from "fs";
import { HiBON, HiBONExtension } from "../hibon/HiBON.js";

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

  static version() {
    return runBinary(this.name, ["--version"]);
  }

  private static writeFileAndRun(
    extension: string,
    buffer: Buffer
  ): Buffer | null {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, generateTempFilename(extension));

    try {
      fs.writeFileSync(tempFilePath, buffer, "binary");

      return runBinaryWithBuffer(this.name, ["-c", tempFilePath]);
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

  static toHiBON(buffer: Buffer): Buffer | null {
    return this.writeFileAndRun(HiBONExtension.json, buffer);
  }

  static toJSON(buffer: Buffer): Buffer | null {
    return this.writeFileAndRun(HiBONExtension.hibon, buffer);
  }

  private static convertAndRun(json: HiBON, args: string): string | null {
    const tempDir = os.tmpdir();
    const tempFilePrefix = path.join(tempDir, generateTempFilename(""));

    const tempJson = tempFilePrefix + HiBONExtension.json;
    const tempHibon = tempFilePrefix + HiBONExtension.hibon;

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

      // Run given args with converted hibon
      result = runBinary(this.name, [tempHibon, args]);
      if (result.code != 0) {
        console.error(
          `Error executing '${this.name} ${tempHibon} ${args}': ${result.output}`
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

  static getDARTIndex(json: HiBON): string | null {
    return this.convertAndRun(json, "-ctD");
  }

  static getHiBONBase64(json: HiBON): string | null {
    return this.convertAndRun(json, "-ct");
  }

  static validateJSON(json: HiBON): ExecutionResult | null {
    const tempDir = os.tmpdir();
    const tempFilePrefix = path.join(tempDir, generateTempFilename(""));

    const tempJson = tempFilePrefix + HiBONExtension.json;
    const tempHibon = tempFilePrefix + HiBONExtension.hibon;

    try {
      fs.writeFileSync(tempJson, json.toJSONBuffer());

      // Convert JSON to HiBON and if doc is malformed error will be returned
      return runBinary(this.name, [tempJson]);
    } catch (error) {
      console.error(error);
      return null; // Unexpected error
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
