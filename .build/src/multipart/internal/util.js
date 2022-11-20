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
  asciiToDataViewForTesting: () => asciiToDataViewForTesting,
  chars: () => chars,
  getAsciiStringFromDataView: () => getAsciiStringFromDataView,
  getCharCodesForString: () => getCharCodesForString,
  isCRLF: () => isCRLF,
  isDoubleCRLF: () => isDoubleCRLF,
  isDoubleHyphen: () => isDoubleHyphen
});
var import__ = __toModule(require("../.."));
const chars = {
  cr: 13,
  lf: 10,
  hyphen: "-".charCodeAt(0)
};
function isDoubleCRLF(data, offset) {
  if (offset + 3 >= data.byteLength) {
    return false;
  }
  return data.getUint8(offset) == chars.cr && data.getUint8(offset + 1) == chars.lf && data.getUint8(offset + 2) == chars.cr && data.getUint8(offset + 3) == chars.lf;
}
function isCRLF(data, offset) {
  if (offset + 1 >= data.byteLength) {
    return false;
  }
  const first = data.getUint8(offset);
  const second = data.getUint8(offset + 1);
  return first == chars.cr && second == chars.lf;
}
function isDoubleHyphen(data, offset) {
  if (offset + 1 >= data.byteLength) {
    return false;
  }
  const first = data.getUint8(offset);
  const second = data.getUint8(offset + 1);
  return first == chars.hyphen && second == chars.hyphen;
}
function getCharCodesForString(str) {
  const res = [];
  for (let i = 0; i < str.length; ++i) {
    const code = str.charCodeAt(i);
    if (code > 255) {
      throw new import__.ParseError("Boundary characters must be ISO-8859-1 values from 0-255.");
    }
    res.push(code);
  }
  return res;
}
function getAsciiStringFromDataView(dataview) {
  const numbers = [];
  for (let i = 0; i < dataview.byteLength; ++i) {
    const current = dataview.getUint8(i);
    numbers.push(current);
  }
  return String.fromCharCode.apply(null, numbers);
}
function asciiToDataViewForTesting(content) {
  content = content.replace(/\n/g, "\r\n");
  const temp = [];
  for (let i = 0; i < content.length; ++i) {
    temp[i] = content.charCodeAt(i);
  }
  return new DataView(new Uint8Array(temp).buffer);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  asciiToDataViewForTesting,
  chars,
  getAsciiStringFromDataView,
  getCharCodesForString,
  isCRLF,
  isDoubleCRLF,
  isDoubleHyphen
});
//# sourceMappingURL=util.js.map
