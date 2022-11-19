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
var import_MultipartParser = __toModule(require("./MultipartParser"));
(0, import_globals.describe)("parse", () => {
  (0, import_globals.test)("example1", () => {
    const boundary = "9051914041544843365972754266";
    const dataview = (0, import_internal.asciiToDataViewForTesting)(`
--9051914041544843365972754266
Content-Disposition: form-data; name="text"

text default
--9051914041544843365972754266
Content-Disposition: form-data; name="file1"; filename="a.txt"
Content-Type: text/plain

Content of a.txt.

--9051914041544843365972754266
Content-Disposition: form-data; name="file2"; filename="a.html"
Content-Type: text/html

<!DOCTYPE html><title>Content of a.html.</title>

--9051914041544843365972754266--`);
    const parser = new import_MultipartParser.MultipartParser();
    const result = parser.parse(boundary, dataview).parts;
    (0, import_globals.expect)(result).toHaveLength(3);
    (0, import_globals.expect)(result[0].headers).toHaveLength(1);
    (0, import_globals.expect)(result[0].headers[0].name).toEqual("content-disposition");
    (0, import_globals.expect)(result[0].headers[0].value).toEqual('form-data; name="text"');
    (0, import_globals.expect)(result[1].headers).toHaveLength(2);
    (0, import_globals.expect)(result[1].headers[0].name).toEqual("content-disposition");
    (0, import_globals.expect)(result[1].headers[0].value).toEqual('form-data; name="file1"; filename="a.txt"');
    (0, import_globals.expect)(result[1].headers[1].name).toEqual("content-type");
    (0, import_globals.expect)(result[1].headers[1].value).toEqual("text/plain");
    (0, import_globals.expect)(result[2].headers).toHaveLength(2);
    (0, import_globals.expect)(result[2].headers[0].name).toEqual("content-disposition");
    (0, import_globals.expect)(result[2].headers[0].value).toEqual('form-data; name="file2"; filename="a.html"');
    (0, import_globals.expect)(result[2].headers[1].name).toEqual("content-type");
    (0, import_globals.expect)(result[2].headers[1].value).toEqual("text/html");
  });
});
(0, import_globals.describe)("splitPartHeaderAndBody", () => {
  (0, import_globals.test)("test1", () => {
    const part = (0, import_internal.asciiToDataViewForTesting)(`Content-Disposition: form-data; name="file2"; filename="b.html"

test2-1234
`);
    const { headers, content } = import_MultipartParser.__testing.splitPartHeaderAndBody(part);
    (0, import_globals.expect)(headers).toEqual('Content-Disposition: form-data; name="file2"; filename="b.html"');
    const decoder = new TextDecoder();
    const decoded = decoder.decode(content);
    const expectedString = "test2-1234\r\n";
    (0, import_globals.expect)(decoded).toHaveLength(expectedString.length);
    (0, import_globals.expect)(decoded).toEqual(expectedString);
  });
});
(0, import_globals.describe)("findParts", () => {
  (0, import_globals.test)("test1", () => {
    const boundary = "9051914041544843365972754266";
    const dataview = (0, import_internal.asciiToDataViewForTesting)(`
--9051914041544843365972754266
Content-Disposition: form-data; name="file1"; filename="a.html"

test1
--9051914041544843365972754266
Content-Disposition: form-data; name="file2"; filename="b.html"

test2
--9051914041544843365972754266--`);
    const result = import_MultipartParser.__testing.findParts((0, import_internal.getCharCodesForString)(boundary), dataview);
    (0, import_globals.expect)(result).toHaveLength(2);
    const first = result[0];
    (0, import_globals.expect)((0, import_internal.getAsciiStringFromDataView)(first)).toEqual('Content-Disposition: form-data; name="file1"; filename="a.html"\r\n\r\ntest1');
    const second = result[1];
    (0, import_globals.expect)((0, import_internal.getAsciiStringFromDataView)(second)).toEqual('Content-Disposition: form-data; name="file2"; filename="b.html"\r\n\r\ntest2');
  });
});
//# sourceMappingURL=MultipartParser.test.js.map
