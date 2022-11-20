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
  consumeOptionalWhitespace: () => consumeOptionalWhitespace,
  isAtCRLF: () => isAtCRLF,
  isDelimiter: () => isDelimiter,
  isFinished: () => isFinished,
  isSpace: () => isSpace,
  isTCHAR: () => isTCHAR,
  isVCHAR: () => isVCHAR,
  processParametersIfPresent: () => processParametersIfPresent,
  readOneParameter: () => readOneParameter,
  readOptionalToken: () => readOptionalToken,
  readQuoted: () => readQuoted,
  readToNextLine: () => readToNextLine,
  readToken: () => readToken
});
var import_ParseError = __toModule(require("../ParseError"));
function isFinished(state) {
  return state.index >= state.end;
}
function isAtCRLF(state) {
  if (state.index + 1 > state.end) {
    return false;
  }
  return state.string[state.index] == "\r" && state.string[state.index + 1] == "\n";
}
const delimRegex = /^["(),/:;<=>?@[\]{}]$/;
function isDelimiter(char) {
  if (!char)
    return false;
  return Boolean(char.match(delimRegex));
}
function isTCHAR(char) {
  if (!char)
    return false;
  return isVCHAR(char) && !isDelimiter(char);
}
function isVCHAR(char) {
  if (!char)
    return false;
  if (char.length != 1)
    throw new TypeError(`Expected a single character or undefined, found instead ${char}`);
  const codepoint = char.codePointAt(0);
  return codepoint !== void 0 && codepoint >= 33 && codepoint < 127;
}
function isSpace(char) {
  if (char && char.length != 1)
    throw new TypeError(`Expected a single character or undefined, found instead ${char}`);
  return char == " " || char == "	";
}
function consumeOptionalWhitespace(state) {
  for (; ; ) {
    if (state.index >= state.end) {
      return;
    }
    const current = state.string[state.index];
    if (current !== "	" && current !== " ") {
      return;
    }
    ++state.index;
  }
}
function readToNextLine(state) {
  const startIndex = state.index;
  let end;
  for (; ; ) {
    if (isAtCRLF(state)) {
      end = state.index;
      state.index += 2;
      break;
    } else if (isFinished(state)) {
      end = state.index;
      break;
    }
    ++state.index;
  }
  if (end === void 0) {
    throw new import_ParseError.ParseError("Unexpected.");
  }
  return state.string.substring(startIndex, end);
}
function readToken(state) {
  const token = readOptionalToken(state);
  if (!token) {
    if (isFinished(state)) {
      throw new import_ParseError.ParseError("Unexpected EOF, expected token.");
    }
    throw new import_ParseError.ParseError(`Unexpected '${state.string[state.index]}', expected token.`);
  }
  return token;
}
function readOptionalToken(state) {
  if (state.index >= state.string.length) {
    return void 0;
  }
  const parts = [];
  for (; !isFinished(state); ++state.index) {
    const char = state.string[state.index];
    if (!isTCHAR(char)) {
      break;
    }
    parts.push(char);
  }
  return parts.length == 0 ? void 0 : parts.join("");
}
function readQuoted(state) {
  if (state.string[state.index] != '"') {
    throw new import_ParseError.ParseError(`Unexpected ${state.string[state.index]}, expected ".`);
  }
  ++state.index;
  const res = [];
  for (; ; ) {
    if (state.index >= state.end) {
      break;
    }
    const current = state.string[state.index];
    if (current == '"' && state.string[state.index - 1] != "\\") {
      break;
    }
    res.push(current);
    ++state.index;
  }
  if (state.index >= state.end) {
    throw new import_ParseError.ParseError(`Unexpected EOF, expecting '"'.`);
  }
  const closeQuote = state.string[state.index];
  if (closeQuote != '"') {
    throw new import_ParseError.ParseError(`Unexpected '${closeQuote}', expecting '"'.`);
  }
  ++state.index;
  const merged = res.join("");
  return merged.replace(/\\(.)/g, "$1");
}
function readOneParameter(state) {
  consumeOptionalWhitespace(state);
  const parameterName = readOptionalToken(state);
  if (!parameterName) {
    if (isFinished(state)) {
      return void 0;
    } else {
      throw new import_ParseError.ParseError(`Unexpected ${state.string[state.index]}, expecting a token.`);
    }
  }
  consumeOptionalWhitespace(state);
  if (isFinished(state) || state.string[state.index] !== "=") {
    throw new import_ParseError.ParseError(`Unexpected ${state.string[state.index]}, expecting an equals sign.`);
  }
  ++state.index;
  consumeOptionalWhitespace(state);
  if (isFinished(state)) {
    throw new import_ParseError.ParseError(`Unexpected EOF, expecting a token or quoted-string.`);
  }
  let value;
  if (state.string[state.index] === '"') {
    value = readQuoted(state);
  } else {
    value = readToken(state);
  }
  return { name: parameterName, value };
}
function processParametersIfPresent(state) {
  const res = [];
  for (; ; ) {
    consumeOptionalWhitespace(state);
    if (isFinished(state)) {
      break;
    }
    const semicolon = state.string[state.index];
    if (semicolon !== ";") {
      throw new import_ParseError.ParseError(`Unexpected '${semicolon}' when expecting a semi-colon ';'.`);
    }
    ++state.index;
    const parameter = readOneParameter(state);
    if (!parameter) {
      if (!isFinished(state)) {
        throw new import_ParseError.ParseError(`Unexpected '${state.string[state.index]}' when expecting parameter or EOF.`);
      }
      break;
    }
    res.push(parameter);
  }
  return res;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  consumeOptionalWhitespace,
  isAtCRLF,
  isDelimiter,
  isFinished,
  isSpace,
  isTCHAR,
  isVCHAR,
  processParametersIfPresent,
  readOneParameter,
  readOptionalToken,
  readQuoted,
  readToNextLine,
  readToken
});
//# sourceMappingURL=internal.js.map
