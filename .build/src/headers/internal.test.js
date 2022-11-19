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
var import_internal = __toModule(require("./internal"));
(0, import_globals.describe)("isFinished", () => {
  (0, import_globals.test)("false 1", () => {
    (0, import_globals.expect)((0, import_internal.isFinished)({ index: 0, end: 10, string: "abcdefghijk" })).toEqual(false);
  });
  (0, import_globals.test)("true 1", () => {
    (0, import_globals.expect)((0, import_internal.isFinished)({ index: 10, end: 10, string: "abcdefghijk" })).toEqual(true);
  });
  (0, import_globals.test)("true 1", () => {
    (0, import_globals.expect)((0, import_internal.isFinished)({ index: 11, end: 10, string: "abcdefghijk" })).toEqual(true);
  });
});
(0, import_globals.describe)("isAtCRLF", () => {
  (0, import_globals.test)("true 1", () => {
    (0, import_globals.expect)((0, import_internal.isAtCRLF)({ index: 0, end: 2, string: "\r\n" })).toEqual(true);
  });
  (0, import_globals.test)("false 1", () => {
    (0, import_globals.expect)((0, import_internal.isAtCRLF)({ index: 1, end: 2, string: "\r\n" })).toEqual(false);
  });
  (0, import_globals.test)("false 2", () => {
    (0, import_globals.expect)((0, import_internal.isAtCRLF)({ index: 0, end: 5, string: "abcde" })).toEqual(false);
  });
});
(0, import_globals.describe)("readToNextLine", () => {
  (0, import_globals.test)("test 1", () => {
    const input = "test1 2 3 4\r\nbanana";
    const res = (0, import_internal.readToNextLine)({ index: 0, end: input.length, string: input });
    (0, import_globals.expect)(res).toEqual("test1 2 3 4");
  });
});
(0, import_globals.describe)("readToken", () => {
  (0, import_globals.test)("encoding=utf-8", () => {
    const input = "encoding=utf-8 ";
    const res = (0, import_internal.readToken)({ index: 0, end: input.length, string: input });
    (0, import_globals.expect)(res).toEqual("encoding");
  });
});
(0, import_globals.describe)("readQuoted", () => {
  (0, import_globals.test)('"hello there \\x1 \\" "', () => {
    const input = '"hello there \\x1 \\" "';
    const res = (0, import_internal.readQuoted)({ index: 0, end: input.length, string: input });
    (0, import_globals.expect)(res).toEqual('hello there x1 " ');
  });
});
(0, import_globals.describe)("consumeOptionalWhitespace", () => {
  (0, import_globals.test)("      =", () => {
    const input = "      =";
    const state = { index: 0, end: input.length, string: input };
    (0, import_internal.consumeOptionalWhitespace)(state);
    (0, import_globals.expect)(state).toEqual({ index: 6, end: 7, string: input });
    (0, import_globals.expect)(state.string[state.index]).toEqual("=");
  });
  (0, import_globals.test)("word", () => {
    const input = "word";
    const state = { index: 0, end: input.length, string: input };
    (0, import_internal.consumeOptionalWhitespace)(state);
    (0, import_globals.expect)(state).toEqual({ index: 0, end: input.length, string: input });
    (0, import_globals.expect)(state.string[state.index]).toEqual("w");
  });
});
(0, import_globals.describe)("readOneParameter", () => {
  (0, import_globals.test)("encoding=utf-8", () => {
    const input = "encoding=utf-8 ";
    const parameters = {};
    const res = (0, import_internal.readOneParameter)({ index: 0, end: input.length, string: input });
    const keys = Object.keys(parameters);
    (0, import_globals.expect)(res).toEqual({ name: "encoding", value: "utf-8" });
  });
});
//# sourceMappingURL=internal.test.js.map
