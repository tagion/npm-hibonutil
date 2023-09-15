import { HiBON, HiBONType } from "./hibon/HiBON";
import { hibonutil } from "./tagion/hibonutil";

let result: boolean = true;

// Example for set function
const hibon = new HiBON();
result = hibon.set("bigint", HiBONType.INTBIG, "111111111");
if (!result) console.log("FAIL");
result = hibon.set("boolean", HiBONType.BOOLEAN, true);
if (!result) console.log("FAIL");
result = hibon.set("sub_hibon", HiBONType.HIBON, { subkey: ["type", -42] });
if (!result) console.log("FAIL");

console.log("----------------------------------------");
// Example for get function
console.log(hibon.get("bigint", HiBONType.INTBIG));
console.log(hibon.get("boolean", HiBONType.BOOLEAN));
console.log(hibon.get("sub_hibon", HiBONType.HIBON));

console.log("----------------------------------------");
const hibon_binary = hibonutil.fromBuffer(hibon.toJSONBuffer());
console.log(hibon_binary?.toString());
console.log("----------------------------------------");

if (hibon_binary) {
  const json_string = hibonutil.fromBuffer(hibon_binary);
  console.log(json_string?.toString());
}
