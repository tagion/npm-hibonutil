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
  HIBON = "hibon",
}

type PrimitiveValue = string | boolean | number;
type ValueType = PrimitiveValue | [string, PrimitiveValue] | HiBONJSON;

function isPrimitiveValue(value: ValueType): value is PrimitiveValue {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  );
}

export interface HiBONJSON {
  [key: string]: ValueType;
}

export class HiBON {
  private data: HiBONJSON = {};

  constructor(buffer?: Buffer) {
    if (buffer) {
      this.data = JSON.parse(buffer.toString("utf8"));
    }
  }

  public set(key: string, type: HiBONType, value: ValueType) {
    if (
      type === HiBONType.BOOLEAN ||
      type === HiBONType.STRING ||
      type === HiBONType.HIBON
    ) {
      this.data[key] = value;
    } else if (isPrimitiveValue(value)) {
      this.data[key] = [type, value];
    } else {
      return false;
    }

    return true;
  }

  public get(key: string, type: string) {
    const value = this.data[key];

    if (
      type === HiBONType.BOOLEAN ||
      type === HiBONType.STRING ||
      type === HiBONType.HIBON
    ) {
      return value;
    } else if (Array.isArray(value)) {
      const [valueType, valuePrimitive] = value;
      if (type !== valueType) {
        console.log(
          `WARNING: for key '${key}' expected type is '${type}' but actual is '${valueType}'`
        ); // Maybe we need something else, not just console output
      }
      return valuePrimitive;
    }

    return undefined;
  }

  public toJSON(): HiBONJSON {
    return this.data;
  }

  public toJSONBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.toJSON()));
  }
}
