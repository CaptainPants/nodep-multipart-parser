var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  blobToArrayBuffer: () => blobToArrayBuffer,
  blobToString: () => blobToString,
  expensiveCompatibleStringToArrayBuffer: () => expensiveCompatibleStringToArrayBuffer,
  expensiveCompativalBlobSourceToString: () => expensiveCompativalBlobSourceToString,
  stringToArrayBuffer: () => stringToArrayBuffer
});
function stringToArrayBuffer(value) {
  if (TextEncoder) {
    return Promise.resolve(new TextEncoder().encode(value).buffer);
  } else {
    return expensiveCompatibleStringToArrayBuffer(value);
  }
}
function expensiveCompatibleStringToArrayBuffer(value) {
  return blobToArrayBuffer(new Blob([value]));
}
function expensiveCompativalBlobSourceToString(value, encoding) {
  return blobToString(new Blob([value]), encoding);
}
function blobToString(blob, sourceEncoding) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", (_) => reject(new Error("Failed to decode text.")));
    reader.addEventListener("error", (_) => resolve(reader.result));
    reader.readAsText(blob, sourceEncoding);
  });
}
function blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", (_) => reject(new Error("Failed to decode text.")));
    reader.addEventListener("error", (_) => resolve(reader.result));
    reader.readAsArrayBuffer(blob);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blobToArrayBuffer,
  blobToString,
  expensiveCompatibleStringToArrayBuffer,
  expensiveCompativalBlobSourceToString,
  stringToArrayBuffer
});
//# sourceMappingURL=internal.js.map
