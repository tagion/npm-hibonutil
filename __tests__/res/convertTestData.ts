export const sampleJSON = {
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

export const sampleHiBONRaw =
  "\x95\x01\x1A\x06BIGINT\x99è\x82ú\x88\x87¯¤àøó\x90µ\x87Y\b\x07BOOLEAN\x01\x17\x07FLOAT32¤p\x9D?\x18\x07FLOAT64Æ\x85âoÙµyi\x11\x05INT32V\x12\x05INT64ÚÚáò£²ç}\x14\x06UINT32*\x15\x06UINT64¦¥\x9E\x8DÜÍ\x98\x02\x02\tsub_hibon\x1A\x03\x06BINARY\x04\x01\x02\x03\x04\x01\x06STRING\x04Text";

export const sampleHiBONBuffer = Buffer.from(sampleHiBONRaw, "binary");

export const sampleHiBONHex =
  "95011a06424947494e5499e882fa8887afa4e0f8f390b587590807424f4f4c45414e011707464c4f41543332a4709d3f1807464c4f41543634c685e26fd9b579691105494e543332561205494e543634dadae1f2a3b2e77d140655494e5433322a150655494e543634a6a59e8ddccd980202097375625f6869626f6e1a030642494e41525904010203040106535452494e470454657874";

export const sampleHiBONBase64 =
  "@lQEaBkJJR0lOVJnogvqIh6-k4PjzkLWHWQgHQk9PTEVBTgEXB0ZMT0FUMzKkcJ0_GAdGTE9BVDY0xoXib9m1eWkRBUlOVDMyVhIFSU5UNjTa2uHyo7LnfRQGVUlOVDMyKhUGVUlOVDY0pqWejdzNmAICCXN1Yl9oaWJvbhoDBkJJTkFSWQQBAgMEAQZTVFJJTkcEVGV4dA==";

export const inputInvalidTime = {
  FLOAT64: ["f64", "0x1.9b5d96fe285c6p+664"],
  sub_hibon: {
    BINARY: ["*", "@AQIDBA=="],
    STRING: "Text",
    TIME: ["time", "Not-a-time-format-at-all"],
  },
};

export const emptyHiBONBase64 = "@AA==";
