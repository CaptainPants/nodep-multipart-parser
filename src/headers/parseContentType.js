(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "..", "./internal"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.__testing = exports.parseContentType = void 0;
    var __1 = require("..");
    var internal_1 = require("./internal");
    function parseContentType(header) {
        var state = {
            index: 0,
            end: header.length,
            string: header
        };
        var type = (0, internal_1.readToken)(state);
        if ((0, internal_1.isFinished)(state)) {
            throw new __1.ParseError("Unexpected EOF when expecting '/'.");
        }
        if (state.string[state.index] != '/') {
            throw new __1.ParseError("Unexpected '" + state.string[state.index] + "' when expecting '/'.");
        }
        ++state.index;
        var subtype = (0, internal_1.readToken)(state);
        var parameters = processParameters(state);
        return {
            mediaType: type + '/' + subtype,
            type: type,
            subtype: subtype,
            parameters: parameters
        };
    }
    exports.parseContentType = parseContentType;
    function processParameters(state) {
        var res = [];
        for (;;) {
            // sitting just after the previous parameter
            (0, internal_1.consumeOptionalWhitespace)(state);
            if ((0, internal_1.isFinished)(state)) {
                break;
            }
            // there should be a ; between parameters
            var semicolon = state.string[state.index];
            if (semicolon !== ';') {
                throw new __1.ParseError("Unexpected '" + semicolon + "' when expecting a semi-colon ';'.");
            }
            // move past semicolon
            ++state.index;
            // then a parameter
            var parameter = readOneParameter(state);
            if (!parameter) {
                if (!(0, internal_1.isFinished)(state)) {
                    throw new __1.ParseError("Unexpected '" + state.string[state.index] + "' when expecting parameter or EOF.");
                }
                break; // technically a violation of the standard but we'll allow it
            }
            res.push(parameter);
        }
        return res;
    }
    /**
      * Refer to 'parameter' in https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.1
      */
    function readOneParameter(state) {
        (0, internal_1.consumeOptionalWhitespace)(state);
        var parameterName = (0, internal_1.readOptionalToken)(state);
        if (!parameterName) {
            if ((0, internal_1.isFinished)(state)) {
                return undefined;
            }
            else {
                throw new __1.ParseError("Unexpected " + state.string[state.index] + ", expecting a token.");
            }
        }
        // technically not allowed, but for tolerance sake
        (0, internal_1.consumeOptionalWhitespace)(state);
        if ((0, internal_1.isFinished)(state) || state.string[state.index] !== '=') {
            throw new __1.ParseError("Unexpected " + state.string[state.index] + ", expecting an equals sign.");
        }
        // move past the =
        ++state.index;
        // technically not allowed, but for tolerance sake
        (0, internal_1.consumeOptionalWhitespace)(state);
        if ((0, internal_1.isFinished)(state)) {
            throw new __1.ParseError("Unexpected EOF, expecting a token or quoted-string.");
        }
        var value;
        if (state.string[state.index] === '"') {
            value = (0, internal_1.readQuoted)(state);
        }
        else {
            value = (0, internal_1.readToken)(state);
        }
        return { name: parameterName, value: value };
    }
    exports.__testing = process.env.NODE_ENV == 'test' ? {
        consumeOptionalWhitespace: internal_1.consumeOptionalWhitespace,
        readToken: internal_1.readToken,
        readOptionalToken: internal_1.readOptionalToken,
        readQuoted: internal_1.readQuoted,
        readOneParameter: readOneParameter
    } : void 0;
});
