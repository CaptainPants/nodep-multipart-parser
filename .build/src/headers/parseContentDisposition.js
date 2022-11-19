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
  __testing: () => __testing,
  parseContentDisposition: () => parseContentDisposition
});
var import_internal = __toModule(require("./internal"));
var import_internal2 = __toModule(require("./internal"));
function parseContentDisposition(header) {
  const state = {
    index: 0,
    end: header.length,
    string: header
  };
  const type = (0, import_internal2.readToken)(state);
  const parameters = (0, import_internal.processParametersIfPresent)(state);
  const filenameIndex = parameters.findIndex((x) => x.name == "filename");
  const filenameStarIndex = parameters.findIndex((x) => x.name == "filename*");
  const nameIndex = parameters.findIndex((x) => x.name == "name");
  return {
    type,
    parameters,
    name: nameIndex >= 0 ? parameters[nameIndex].value.toLowerCase() : void 0,
    filename: filenameIndex >= 0 ? parameters[filenameIndex].value : void 0,
    filenameStar: filenameStarIndex >= 0 ? parameters[filenameStarIndex].value : void 0
  };
}
const __testing = process.env.NODE_ENV == "test" ? {
  consumeOptionalWhitespace: import_internal2.consumeOptionalWhitespace,
  readToken: import_internal2.readToken,
  readOptionalToken: import_internal2.readOptionalToken,
  readQuoted: import_internal2.readQuoted
} : void 0;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __testing,
  parseContentDisposition
});
//# sourceMappingURL=parseContentDisposition.js.map
