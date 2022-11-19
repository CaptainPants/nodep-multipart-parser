var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  ParseError: () => ParseError
});
function hasCaptureStackTrace(errorConstructor) {
  return typeof errorConstructor.captureStackTrace === "function";
}
class ParseError {
  constructor(message) {
    Error.call(this, message);
    Object.defineProperty(this, "message", {
      configurable: true,
      enumerable: false,
      value: message !== void 0 ? String(message) : ""
    });
    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: this.constructor.name
    });
    if (hasCaptureStackTrace(Error)) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
Object.setPrototypeOf(ParseError.prototype, Error.prototype);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ParseError
});
//# sourceMappingURL=ParseError.js.map
