var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
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
var import_globals = __toModule(require("@jest/globals"));
var import_ParseError = __toModule(require("../ParseError"));
var import_parseContentType = __toModule(require("./parseContentType"));
(0, import_globals.describe)("parseContentType", () => {
  (0, import_globals.test)("image/png", () => {
    const res = (0, import_parseContentType.parseContentType)("image/png");
    (0, import_globals.expect)(res.mediaType).toEqual("image/png");
    (0, import_globals.expect)(res.type).toEqual("image");
    (0, import_globals.expect)(res.subtype).toEqual("png");
    (0, import_globals.expect)(Object.keys(res.parameters).length === 0);
  });
  (0, import_globals.test)("image", () => {
    (0, import_globals.expect)(() => (0, import_parseContentType.parseContentType)("image")).toThrow(import_ParseError.ParseError);
  });
  (0, import_globals.test)("text/json; encoding=utf-8", () => {
    const res = (0, import_parseContentType.parseContentType)("text/json; encoding=utf-8");
    (0, import_globals.expect)(res.mediaType).toEqual("text/json");
    (0, import_globals.expect)(res.parameters).toEqual([{ name: "encoding", value: "utf-8" }]);
  });
  (0, import_globals.test)('text/json; charset=utf-8 ; boundary="ham sandwich \\"1\\" 1234 "', () => {
    const res = (0, import_parseContentType.parseContentType)('text/json; charset=utf-8 ; boundary="ham sandwich \\"1\\" 1234 "');
    (0, import_globals.expect)(res.mediaType).toEqual("text/json");
    (0, import_globals.expect)(res.parameters).toEqual([
      { name: "charset", value: "utf-8" },
      { name: "boundary", value: 'ham sandwich "1" 1234 ' }
    ]);
    (0, import_globals.expect)(res.charset).toEqual("utf-8");
    (0, import_globals.expect)(res.boundary).toEqual('ham sandwich "1" 1234 ');
  });
  (0, import_globals.test)('text/json; charset="utf-8"', () => {
    const res = (0, import_parseContentType.parseContentType)('text/json; charset="utf-8"');
    (0, import_globals.expect)(res.mediaType).toEqual("text/json");
    (0, import_globals.expect)(res.parameters).toEqual([{ name: "charset", value: "utf-8" }]);
    (0, import_globals.expect)(res.charset).toEqual("utf-8");
  });
  (0, import_globals.test)('text/json; charset="UTF-8"', () => {
    const res = (0, import_parseContentType.parseContentType)('text/json; charset="UTF-8"');
    (0, import_globals.expect)(res.mediaType).toEqual("text/json");
    (0, import_globals.expect)(res.parameters).toEqual([{ name: "charset", value: "UTF-8" }]);
    (0, import_globals.expect)(res.charset).toEqual("utf-8");
  });
});
//# sourceMappingURL=parseContentType.test.js.map
