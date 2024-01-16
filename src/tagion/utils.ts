import { execSync, spawnSync } from "child_process";
import crypto from "crypto";

// Remove ANSI escape codes that could be persent as formatting
function stripAnsiRed(str: string): string {
  // Matches ANSI escape codes for red and bright red color
  const redAnsiRegex = /\x1B\[31;?1?m/g; // eslint-disable-line no-control-regex

  // Matches ANSI reset code back to default
  const resetAnsiRegex = /\x1B\[0m/g; // eslint-disable-line no-control-regex

  return str.replace(redAnsiRegex, "").replace(resetAnsiRegex, "");
}

export interface ExecutionResult {
  code: number;
  output: string;
}

export function runBinary(binary: string, args: string[]): ExecutionResult {
  let result: ExecutionResult;

  try {
    const console_output = execSync(`${binary} ${args.join(" ")}`, {
      encoding: "utf-8",
    }).trim();
    result = { code: 0, output: console_output };
  } catch (error: unknown) {
    const err = error as {
      code?: number;
      message?: string;
      stderr?: string;
    };

    const errorCode = err.code ?? 1;
    const errorMessage = stripAnsiRed(
      err.stderr?.trim() ?? err.message ?? "Unknown error"
    );

    result = { code: errorCode, output: errorMessage };
  }

  return result;
}

export function runBinaryWithBuffer(
  command: string,
  args: string[]
): Buffer | null {
  try {
    const result = spawnSync(command, args, {
      encoding: "buffer",
    });

    if (result.error) {
      console.error(`Error: ${result.error.message}`);
      return null;
    }

    if (result.stderr.length > 0) {
      console.log(`Error: ${result.stderr.toString("binary")}`);
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
