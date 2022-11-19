var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  binaryToString: () => binaryToString
});
function binaryToString(binary, encoding) {
  if (binary instanceof Blob) {
    return blobToString(binary, encoding);
  } else {
    if (TextDecoder) {
      const decoder = new TextDecoder(encoding);
      return Promise.resolve(decoder.decode(binary));
    } else {
      return blobToString(new Blob([binary]), encoding);
    }
  }
}
function blobToString(blob, encoding) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", (_) => reject(new Error("Failed to decode text.")));
    reader.addEventListener("error", (_) => resolve(reader.result));
    reader.readAsText(blob, encoding);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  binaryToString
});
//# sourceMappingURL=binaryToString.js.map
