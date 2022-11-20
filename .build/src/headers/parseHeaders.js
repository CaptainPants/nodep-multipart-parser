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
  parseHeaders: () => parseHeaders
});
var import__ = __toModule(require(".."));
var import_internal = __toModule(require("./internal"));
function parseHeaders(params) {
  const headerString = params.headerString ?? "";
  const state = {
    index: 0,
    end: headerString.length,
    string: headerString
  };
  const headers = [];
  for (; ; ) {
    const headerName = (0, import_internal.readOptionalToken)(state);
    if (!headerName) {
      break;
    }
    if ((0, import_internal.isFinished)(state)) {
      throw new import__.ParseError(`Expected :, found instead EOF.`);
    }
    const colon = state.string[state.index];
    if (colon != ":") {
      throw new import__.ParseError(`Expected :, found instead '${colon}'.`);
    }
    state.index += 1;
    (0, import_internal.consumeOptionalWhitespace)(state);
    let value = "";
    if (!(0, import_internal.isFinished)(state)) {
      value += (0, import_internal.readToNextLine)(state);
      while (!(0, import_internal.isFinished)(state) && (0, import_internal.isSpace)(state.string[state.index])) {
        value += " ";
        value += (0, import_internal.readToNextLine)(state);
      }
    }
    headers.push({ name: headerName.toLowerCase(), value });
  }
  return {
    headers
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseHeaders
});
//# sourceMappingURL=parseHeaders.js.map
