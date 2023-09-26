import { ExecutionResult, runBinary, runBinaryWithBuffer } from "./utils.js";

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

  static fromBuffer(buffer: Buffer, pretty: boolean = true): Buffer | null {
    return runBinaryWithBuffer(this.name, [pretty ? "-pc" : "-c"], buffer);
  }
}
