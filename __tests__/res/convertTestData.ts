export const inputJSON = {
  FLOAT64: ["f64", "0x1.9b5d96fe285c6p+664"],
  sub_hibon: {
    BINARY: ["*", "@AQIDBA=="],
    STRING: "Text",
    TIME: ["time", "2023-09-20T13:01:25.5186591"],
  },
};

export const outputHexForJSON =
  "461807464c4f41543634c685efbfbd6fd9b5796902097375625f6869626f6e29030642494e41525904010203040106535452494e470454657874090454494d45efbfbdefbfbdefbfbde888b8efbfbdefbfbd08";

export const outputBase64ForJSON =
  "@RhgHRkxPQVQ2NMaF4m_ZtXlpAglzdWJfaGlib24pAwZCSU5BUlkEAQIDBAEGU1RSSU5HBFRleHQJBFRJTUWf2eboiLju7Qg=";

export const inputInvalidTime = {
  FLOAT64: ["f64", "0x1.9b5d96fe285c6p+664"],
  sub_hibon: {
    BINARY: ["*", "@AQIDBA=="],
    STRING: "Text",
    TIME: ["time", "Not-a-time-format-at-all"],
  },
};

export const outputBase64EmptyJSON = "@AA==";
