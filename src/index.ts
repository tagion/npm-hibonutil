import { HiBON, HiBONType } from "./hibon/HiBON";

let result: boolean = true;

const hibon = new HiBON();
result = hibon.set("bigint", HiBONType.INTBIG, "111111111");
if (!result) console.log("FAIL");
result = hibon.set("boolean", HiBONType.BOOLEAN, true);
if (!result) console.log("FAIL");
result = hibon.set("sub_hibon", HiBONType.HIBON, { subkey: ["type", -42] });
if (!result) console.log("FAIL");

console.log(hibon.get("bigint", HiBONType.INTBIG));
console.log(hibon.get("boolean", HiBONType.BOOLEAN));
console.log(hibon.get("sub_hibon", HiBONType.HIBON));

console.log(hibon.toJSON());
