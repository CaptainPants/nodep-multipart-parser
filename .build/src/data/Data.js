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
  Data: () => Data
});
var import_internal = __toModule(require("./internal"));
class Data {
  constructor(source, sourceEncoding) {
    this.source = source;
    this.sourceEncoding = sourceEncoding;
    if (!(typeof source === "string" || source instanceof DataView || source instanceof ArrayBuffer || source instanceof Blob)) {
      throw new TypeError(`Unexpected data type ${source}.`);
    }
  }
  string() {
    if (typeof this.source === "string") {
      return Promise.resolve(this.source);
    } else if (this.source instanceof Blob) {
      return (0, import_internal.blobToString)(this.source, this.sourceEncoding);
    } else {
      if (TextDecoder) {
        return Promise.resolve(new TextDecoder(this.sourceEncoding).decode(this.source));
      } else {
        return (0, import_internal.expensiveCompativalBlobSourceToString)(this.source, this.sourceEncoding);
      }
    }
  }
  async arrayBuffer() {
    if (this.source instanceof ArrayBuffer) {
      return { value: this.source, encoding: this.sourceEncoding };
    } else if (this.source instanceof DataView) {
      const res = new ArrayBuffer(this.source.byteLength);
      new Uint8Array(res).set(new Uint8Array(this.source.buffer, this.source.byteOffset, this.source.byteLength));
      return { value: res, encoding: this.sourceEncoding };
    } else if (this.source instanceof Blob) {
      return { value: await (0, import_internal.blobToArrayBuffer)(this.source), encoding: this.sourceEncoding };
    } else {
      return { value: await (0, import_internal.stringToArrayBuffer)(this.source), encoding: "utf-8" };
    }
  }
  blob() {
    if (this.source instanceof Blob) {
      return Promise.resolve({ value: this.source, encoding: this.sourceEncoding });
    } else if (typeof this.source === "string") {
      Promise.resolve({ value: new Blob([this.source]), encoding: "utf-8" });
    }
    return Promise.resolve({ value: new Blob([this.source]), encoding: this.sourceEncoding });
  }
  async dataView() {
    if (this.source instanceof ArrayBuffer) {
      return { value: new DataView(this.source), encoding: this.sourceEncoding };
    } else if (this.source instanceof DataView) {
      return { value: this.source, encoding: this.sourceEncoding };
    } else if (this.source instanceof Blob) {
      return { value: new DataView(await (0, import_internal.blobToArrayBuffer)(this.source)), encoding: this.sourceEncoding };
    } else {
      return { value: new DataView(await (0, import_internal.stringToArrayBuffer)(this.source)), encoding: "utf-8" };
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Data
});
//# sourceMappingURL=Data.js.map
