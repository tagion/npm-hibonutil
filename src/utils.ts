import { spawn } from "child_process";

export function run_binary(command: string, args: string[]) {
  // Run the binary application
  const childProcess = spawn(command, args);

  // Listen for output from the binary
  childProcess.stdout.on("data", (data) => {
    console.log(`Output from ${command}:`);
    console.log(data.toString());
  });

  // Listen for errors
  childProcess.stderr.on("data", (data) => {
    console.error(`Error from ${command}:`);
    console.error(data.toString());
  });

  // Listen for the binary process to exit
  childProcess.on("close", (code) => {
    console.log(`${command} exited with code ${code}`);
  });
}
