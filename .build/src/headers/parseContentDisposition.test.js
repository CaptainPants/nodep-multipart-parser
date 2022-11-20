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
var import_parseContentDisposition = __toModule(require("./parseContentDisposition"));
(0, import_globals.describe)("parseContentDisposition", () => {
  (0, import_globals.test)("form-data", () => {
    const res = (0, import_parseContentDisposition.parseContentDisposition)("form-data");
    (0, import_globals.expect)(res.type).toEqual("form-data");
    (0, import_globals.expect)(Object.keys(res.parameters).length === 1);
  });
  (0, import_globals.test)('form-data; filename="test.txt"', () => {
    const res = (0, import_parseContentDisposition.parseContentDisposition)('form-data; filename="test.txt"');
    (0, import_globals.expect)(res.type).toEqual("form-data");
    (0, import_globals.expect)(res.filename).toEqual("test.txt");
  });
  (0, import_globals.test)("form-data; name=example-name-1 ; filename=example-filename-1", () => {
    const res = (0, import_parseContentDisposition.parseContentDisposition)("form-data; name=example-name-1 ; filename=example-filename-1");
    (0, import_globals.expect)(res.type).toEqual("form-data");
    (0, import_globals.expect)(res.parameters).toEqual([
      { name: "name", value: "example-name-1" },
      { name: "filename", value: "example-filename-1" }
    ]);
  });
});
//# sourceMappingURL=parseContentDisposition.test.js.map
