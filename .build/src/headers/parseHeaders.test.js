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
var import_parseHeaders = __toModule(require("./parseHeaders"));
(0, import_globals.describe)("parseHeaders", () => {
  (0, import_globals.test)("test1", () => {
    const headers = `Content-Disposition: form-data; name="file2"; filename="a.html"
Content-Type: text/html`.replace(/\n/g, "\r\n");
    const res = (0, import_parseHeaders.parseHeaders)({ headerString: headers }).headers;
    (0, import_globals.expect)(res).toHaveLength(2);
    (0, import_globals.expect)(res[0].name).toEqual("content-disposition");
    (0, import_globals.expect)(res[0].value).toEqual('form-data; name="file2"; filename="a.html"');
    (0, import_globals.expect)(res[1].name).toEqual("content-type");
    (0, import_globals.expect)(res[1].value).toEqual("text/html");
  });
  (0, import_globals.test)("obs-fold", () => {
    const headers = `Content-Disposition: form-data; name="file2";
 filename="a.html"
Content-Type: text/html`.replace(/\n/g, "\r\n");
    const res = (0, import_parseHeaders.parseHeaders)({ headerString: headers }).headers;
    (0, import_globals.expect)(res).toHaveLength(2);
    (0, import_globals.expect)(res[0].name).toEqual("content-disposition");
    (0, import_globals.expect)(res[0].value).toEqual('form-data; name="file2";  filename="a.html"');
    (0, import_globals.expect)(res[1].name).toEqual("content-type");
    (0, import_globals.expect)(res[1].value).toEqual("text/html");
  });
});
//# sourceMappingURL=parseHeaders.test.js.map
