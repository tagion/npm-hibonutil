export const inputValidJSON = {
  FLOAT64: ["f64", "0x1.9b5d96fe285c6p+664"],
  sub_hibon: {
    BINARY: ["*", "@AQIDBA=="],
    STRING: "Text",
    TIME: ["time", "2023-09-20T13:01:25.5186591"],
  },
};

export const outputValidJSON = {
  code: 0,
  output: "",
};

export const inputInvalidTime = {
  FLOAT64: ["f64", "0x1.9b5d96fe285c6p+664"],
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
