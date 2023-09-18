import { execSync, spawnSync } from "child_process";
import crypto from "crypto";

export interface ExecutionResult {
  code: number;
  output: string;
}

export function runBinary(binary: string, args: string[]): ExecutionResult {
  let result: ExecutionResult;

  try {
    const console_output = execSync(`${binary} ${args.join(" ")}`, {
      encoding: "utf-8",
    });
    result = { code: 0, output: console_output };
  } catch (error: unknown) {
    if (error instanceof Error) result = { code: 1, output: error.message };
    else result = { code: 1, output: "Unknown error" };
  }

  return result;
}

export function runBinaryWithBuffer(
  command: string,
  args: string[],
  buffer: Buffer
): Buffer | null {
  try {
    const result = spawnSync(command, args, {
      input: buffer,
      encoding: "buffer",
    });

    if (result.error) {
      console.error(`Error: ${result.error.message}`);
      return null;
    }

    const output = result.stdout.toString("binary");
    return Buffer.from(output, "binary");
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function generateTempFilename(extension: string): string {
  const randomBytes = crypto.randomBytes(4).toString("hex").toUpperCase();
  const timestamp = Date.now();

  const filename = `tmp${randomBytes}${timestamp}.${extension}`;

  return filename;
}
