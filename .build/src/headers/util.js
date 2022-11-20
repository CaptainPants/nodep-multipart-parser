var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  isMultipartMediaType: () => isMultipartMediaType,
  isTextMediaType: () => isTextMediaType
});
function isTextMediaType(mediaType) {
  if (mediaType === void 0) {
    return false;
  } else if (mediaType.startsWith("text/")) {
    return true;
  } else if (mediaType.match(/^application\/(?:[^+]+\+)?(json|xml)/)) {
    return true;
  }
  return false;
}
function isMultipartMediaType(mediaType) {
  if (mediaType === void 0) {
    return false;
  }
  return mediaType.startsWith("multipart/");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isMultipartMediaType,
  isTextMediaType
});
//# sourceMappingURL=util.js.map
