export const validJSON = {
  BIGINT: ["big", "@meiC-oiHr6Tg-POQtYdZ"],
  BOOLEAN: true,
  FLOAT32: ["f32", "0x1.3ae148p+0"],
  FLOAT64: ["f64", "0x1.9b5d96fe285c6p+664"],
  INT32: ["i32", -42],
  INT64: ["i64", "0xfffb9d923e586d5a"],
  UINT32: ["u32", 42],
  UINT64: ["u64", "0x4626dc1a792a6"],
  sub_hibon: {
    BINARY: ["*", "@AQIDBA=="],
    STRING: "Text",
  },
};

export const outputValid = {
  code: 0,
  output: "",
};

export const invalidTimeJSON = {
  BIGINT: ["big", "@meiC-oiHr6Tg-POQtYdZ"],
  BOOLEAN: true,
  FLOAT32: ["f32", "0x1.3ae148p+0"],
  FLOAT64: ["f64", "0x1.9b5d96fe285c6p+664"],
  INT32: ["i32", -42],
  INT64: ["i64", "0xfffb9d923e586d5a"],
  UINT32: ["u32", 42],
  UINT64: ["u64", "0x4626dc1a792a6"],
  sub_hibon: {
    BINARY: ["*", "@AQIDBA=="],
    STRING: "Text",
    TIME: ["time", "Not-a-time-format-at-all"],
  },
};

export const outputInvalidTime = {
  code: 1,
  output: "Error: Invalid ISO Extended String: Not-a-time-format-at-all",
};
