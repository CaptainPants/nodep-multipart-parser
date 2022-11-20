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
  HttpContent: () => HttpContent,
  MultipartHttpContent: () => MultipartHttpContent,
  SingularHttpContent: () => SingularHttpContent
});
var import_headers = __toModule(require("./headers"));
var import_multipart = __toModule(require("./multipart"));
var import_data = __toModule(require("./data"));
class HttpContent {
  constructor(headers, contentType, contentDisposition) {
    this.headers = headers;
    this.contentType = contentType;
    this.contentDisposition = contentDisposition;
  }
  static async fromXHRResponse(xhr) {
    const headers = (0, import_headers.parseHeaders)({
      headerString: xhr.getAllResponseHeaders()
    }).headers;
    return HttpContent.from(headers, xhr.response);
  }
  static async from(headers, content) {
    const contentTypeIndex = headers.findIndex((x) => x.name === "content-type");
    const contentDispositionIndex = headers.findIndex((x) => x.name === "content-disposition");
    const contentType = contentTypeIndex >= 0 ? (0, import_headers.parseContentType)(headers[contentTypeIndex].value) : void 0;
    const contentDisposition = contentDispositionIndex >= 0 ? (0, import_headers.parseContentDisposition)(headers[contentDispositionIndex].value) : void 0;
    const data = new import_data.Data(content, contentType == null ? void 0 : contentType.charset);
    if ((0, import_headers.isMultipartMediaType)(contentType == null ? void 0 : contentType.mediaType)) {
      const parser = new import_multipart.MultipartParser();
      const boundary = contentType == null ? void 0 : contentType.boundary;
      if (boundary === void 0) {
        throw new Error("No boundary found.");
      }
      const parsed = parser.parseDataView(boundary, (await data.dataView()).value);
      return new MultipartHttpContent(headers, contentType, contentDisposition, parsed.parts.map((x) => {
        var _a;
        return new SingularHttpContent(x.headers, x.contentType, x.contentDisposition, new import_data.Data(x.content, (_a = x.contentType) == null ? void 0 : _a.mediaType));
      }));
    } else {
      return new SingularHttpContent(headers, contentType, contentDisposition, data);
    }
  }
}
class SingularHttpContent extends HttpContent {
  constructor(headers, contentType, contentDisposition, data) {
    super(headers, contentType, contentDisposition);
    this.data = data;
  }
}
class MultipartHttpContent extends HttpContent {
  constructor(headers, contentType, contentDisposition, parts) {
    super(headers, contentType, contentDisposition);
    this.parts = parts;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpContent,
  MultipartHttpContent,
  SingularHttpContent
});
//# sourceMappingURL=HttpContent.js.map
