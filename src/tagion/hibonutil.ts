import { ExecutionResult, runBinary, runBinaryWithBuffer } from "./../utils";

export class hibonutil {
  readonly name: string = "hibonutil";

  static help() {
    return runBinary(this.name, ["-h"]);
  }

  static sample(): ExecutionResult {
    return runBinary(this.name, ["--sample"]);
  }

  static toJSON(hibon: Buffer, pretty: boolean = true): Buffer | null {
    return runBinaryWithBuffer(this.name, [pretty ? "-pc" : "-c"], hibon);
  }

  static toHiBON(json: Buffer): Buffer | null {
    return runBinaryWithBuffer(this.name, ["-c"], json);
  }
}
