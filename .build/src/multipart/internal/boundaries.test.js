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
var import__ = __toModule(require("."));
(0, import_globals.describe)("findBoundarySeparatedParts", () => {
  (0, import_globals.test)("test1", () => {
    const boundary = "9051914041544843365972754266";
    const dataview = (0, import__.asciiToDataViewForTesting)(`
--9051914041544843365972754266
Content-Disposition: form-data; name="file1"; filename="a.html"

test1
--9051914041544843365972754266
Content-Disposition: form-data; name="file2"; filename="b.html"

test2
--9051914041544843365972754266--`);
    const result = (0, import__.findBoundarySeparatedParts)((0, import__.getCharCodesForString)(boundary), dataview);
    (0, import_globals.expect)(result).toHaveLength(2);
    const first = result[0];
    (0, import_globals.expect)((0, import__.getAsciiStringFromDataView)(first)).toEqual('Content-Disposition: form-data; name="file1"; filename="a.html"\r\n\r\ntest1');
    const second = result[1];
    (0, import_globals.expect)((0, import__.getAsciiStringFromDataView)(second)).toEqual('Content-Disposition: form-data; name="file2"; filename="b.html"\r\n\r\ntest2');
  });
});
(0, import_globals.describe)("findBoundaryOffsets", () => {
  (0, import_globals.test)("test1", () => {
    const boundary = "9051914041544843365972754266";
    const dataview = (0, import__.asciiToDataViewForTesting)(`
--9051914041544843365972754266
Content-Disposition: form-data; name="file1"; filename="a.html"

test1
--9051914041544843365972754266
Content-Disposition: form-data; name="file2"; filename="b.html"

test2
--9051914041544843365972754266--`);
    const result = (0, import__.findBoundaryOffsets)((0, import__.getCharCodesForString)(boundary), dataview);
    (0, import_globals.expect)(result).toEqual([
      { start: 0, end: 34, length: 34, isLast: false },
      { start: 106, end: 140, length: 34, isLast: false },
      { start: 212, end: 246, length: 34, isLast: true }
    ]);
  });
});
(0, import_globals.describe)("getCharCodes", () => {
  (0, import_globals.test)("abcdefg", () => {
    const codes = (0, import__.getCharCodesForString)("abcdefg");
    (0, import_globals.expect)(codes).toEqual([97, 98, 99, 100, 101, 102, 103]);
  });
});
(0, import_globals.describe)("matchBoundary", () => {
  (0, import_globals.test)("\\r\\n--a\\r\\n--aabcdefg", () => {
    const bytes = [
      import__.chars.cr,
      import__.chars.lf,
      import__.chars.hyphen,
      import__.chars.hyphen,
      97,
      import__.chars.cr,
      import__.chars.lf,
      import__.chars.hyphen,
      import__.chars.hyphen,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      import__.chars.cr,
      import__.chars.lf
    ];
    const buffer = new ArrayBuffer(bytes.length);
    const uint8 = new Uint8Array(buffer);
    uint8.set(bytes, 0);
    const boundary = (0, import__.getCharCodesForString)("abcdefg");
    const data = new DataView(buffer);
    const res1 = (0, import__.matchBoundary)(boundary, data, 0);
    (0, import_globals.expect)(res1).toEqual(void 0);
    const res2 = (0, import__.matchBoundary)(boundary, data, 5);
    (0, import_globals.expect)(res2).toEqual({ start: 5, end: 18, length: 13, isLast: false });
  });
});
//# sourceMappingURL=boundaries.test.js.map
