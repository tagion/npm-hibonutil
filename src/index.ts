// import { JSONCollector } from "./JSONCollector";
// import { Server } from "./server";
// import yargs from "yargs";
import { HiBONJSON } from "./hibon/HiBON";
// import { hibonutil } from "./tagion/hibonutil";

// const collector = new JSONCollector();
// console.log(`Temp JSON: ${collector.filename}`);

// const argv = yargs(process.argv.slice(2))
//   .options({ p: { type: "number", alias: "port" } })
//   .parseSync();

// const server = new Server(collector, argv.p);
// server.start();

// hibonutil.sample();

const test: HiBONJSON = {};
test["bigint"] = ["big", "111111111"];
test["boolean"] = true;
test["sub_hibon"] = { subkey: ["type", -42] };
// let jsonData: Record<string, string | number | [string, string | number]> = {};

console.log(test);
