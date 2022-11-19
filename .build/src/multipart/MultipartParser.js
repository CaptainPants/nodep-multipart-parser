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
  MultipartParser: () => MultipartParser,
  __testing: () => __testing
});
var import__ = __toModule(require(".."));
var import_headers = __toModule(require("../headers"));
var import_internal = __toModule(require("./internal"));
class MultipartParser {
  parse(boundary, data) {
    const parts = [];
    const boundaryCodes = (0, import_internal.getCharCodesForString)(boundary);
    const partViews = findParts(boundaryCodes, data);
    for (let i = 0; i < partViews.length; ++i) {
      const current = partViews[i];
      const { headers: headerString, content } = splitPartHeaderAndBody(current);
      const headersResult = (0, import_headers.parseHeaders)({ headerString });
      parts.push({
        headers: headersResult.headers,
        content
      });
    }
    return {
      parts
    };
  }
}
function splitPartHeaderAndBody(dataview) {
  for (let i = 0; i < dataview.byteLength; ++i) {
    if ((0, import_internal.isDoubleCRLF)(dataview, i)) {
      const headerPart = new DataView(dataview.buffer, dataview.byteOffset, i);
      const headerString = (0, import_internal.getAsciiStringFromDataView)(headerPart);
      const startOfBodyPart = i + 4;
      const lengthOfBodyPart = dataview.byteLength - startOfBodyPart;
      const bodyPart = new DataView(dataview.buffer, dataview.byteOffset + startOfBodyPart, lengthOfBodyPart);
      return { headers: headerString, content: bodyPart };
    }
  }
  throw new import__.ParseError("No CR LF CR LF sequence found");
}
function findParts(boundaryCodes, data) {
  const boundaryOffsets = (0, import_internal.findBoundaryOffsets)(boundaryCodes, data);
  if (boundaryOffsets.length == 0) {
    return [];
  }
  const partViews = [];
  for (let i = 1; i < boundaryOffsets.length; ++i) {
    const startOffset = boundaryOffsets[i - 1];
    const endOffset = boundaryOffsets[i];
    const start = startOffset.end;
    const end = endOffset.start;
    const len = end - start;
    const partView = new DataView(data.buffer, data.byteOffset + start, len);
    partViews.push(partView);
  }
  return partViews;
}
const __testing = process.env.NODE_ENV == "test" ? {
  splitPartHeaderAndBody,
  findParts
} : void 0;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MultipartParser,
  __testing
});
//# sourceMappingURL=MultipartParser.js.map
