import { Server } from "./server.js";
import yargs from "yargs";

const argv = yargs(process.argv.slice(2))
  .options({
    port: {
      type: "number",
      alias: "p",
      describe: "Specify port for starting server",
    },
  })
  .option({
    trusted: {
      type: "boolean",
      alias: "t",
      default: false,
      describe: "Start server in trusted mode",
    },
  })
  .parseSync();

const server: Server = new Server(argv.port, argv.trusted);

server.defaultSettings();
server.start();
