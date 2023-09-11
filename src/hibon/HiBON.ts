export enum HiBONType {
  FLOAT32 = "f32",
  FLOAT64 = "f64",
  INT32 = "i32",
  INT64 = "i64",
  UINT32 = "u32",
  UINT64 = "u64",
  UTC = "utc",
  INTBIG = "ibig",
  BINARY = "*",
  BOOLEAN = "bool",
  STRING = "str",
}

type PrimitiveValue = string | boolean | number;
type ValueType = PrimitiveValue | [string, PrimitiveValue] | HiBONJSON;

export interface HiBONJSON {
  [key: string]: ValueType;
}

export class HiBON {
  public set(key: string, type: string, value: ValueType) {
    console.log(key, type, value);
  }

  public get(key: string, type: string) {
    console.log(key, type);
    const value: PrimitiveValue = -42;
    return value;
  }
}
