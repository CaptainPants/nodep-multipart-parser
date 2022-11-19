var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  findBoundaryOffsets: () => findBoundaryOffsets,
  matchBoundary: () => matchBoundary
});
var import__ = __toModule(require("."));
var import__2 = __toModule(require("../.."));
function findBoundaryOffsets(boundary, data) {
  if (boundary.length <= 0) {
    throw new import__2.ParseError(`Boundary length of 0 is not supported.`);
  }
  const res = [];
  for (let i = 0; i < data.byteLength; ) {
    const matched = matchBoundary(boundary, data, i);
    if (matched) {
      res.push(matched);
      i += matched.length;
    } else {
      ++i;
    }
  }
  return res;
}
function matchBoundary(boundary, data, dataOffset) {
  if (dataOffset >= data.byteLength) {
    throw new import__2.ParseError("dataOffset past end of DataView.");
  }
  const start = dataOffset;
  if (!(0, import__.isCRLF)(data, dataOffset)) {
    return void 0;
  }
  if (!(0, import__.isDoubleHyphen)(data, dataOffset + 2)) {
    return void 0;
  }
  dataOffset += 4;
  for (let i = 0; i < boundary.length; ++i) {
    if (i >= data.byteLength) {
      return void 0;
    }
    if (boundary[i] !== data.getUint8(dataOffset + i)) {
      return void 0;
    }
  }
  dataOffset += boundary.length;
  let isLast;
  if ((0, import__.isDoubleHyphen)(data, dataOffset)) {
    isLast = true;
    dataOffset += 2;
    if (dataOffset + 2 !== data.byteLength) {
    }
  } else {
    isLast = false;
    if ((0, import__.isCRLF)(data, dataOffset)) {
      dataOffset += 2;
    } else {
      throw new Error("TODO: we should consume to the next CRLF here");
    }
  }
  return {
    start,
    end: dataOffset,
    length: dataOffset - start,
    isLast
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findBoundaryOffsets,
  matchBoundary
});
//# sourceMappingURL=boundaries.js.map
