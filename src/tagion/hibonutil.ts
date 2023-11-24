import {
  ExecutionResult,
  runBinary,
  runBinaryWithBuffer,
  generateTempFilename,
} from "./utils.js";
import os from "os";
import path from "path";
import fs from "fs";

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
}
