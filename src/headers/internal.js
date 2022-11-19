// refer https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.5
// > media-type = type "/" subtype *( OWS ";" OWS parameter )
// > parameter  = token "=" ( token / quoted-string )
// https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.3
// zero or more linear whitespace octets
// > OWS            = ( SP / HTAB )
// https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
// > token          = 1*tchar
// > tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
// >                / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
// >                / DIGIT / ALPHA
// >                ; any VCHAR, except delimiters
// > quoted-string  = DQUOTE *( qdtext / quoted-pair ) DQUOTE
// > qdtext         = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
// > obs-text       = %x80-FF
// > delimiter      => any of "(),/:;<=>?@[\]{}
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", ".."], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.readQuoted = exports.readOptionalToken = exports.readToken = exports.readToNextLine = exports.consumeOptionalWhitespace = exports.isSpace = exports.isVCHAR = exports.isTCHAR = exports.isDelimiter = exports.isAtCRLF = exports.isFinished = void 0;
    var __1 = require("..");
    function isFinished(state) {
        return state.index >= state.end;
    }
    exports.isFinished = isFinished;
    function isAtCRLF(state) {
        if (state.index + 1 > state.end) {
            return false;
        }
        return state.string[state.index] == '\r' && state.string[state.index + 1] == '\n';
    }
    exports.isAtCRLF = isAtCRLF;
    var delimRegex = /^["(),/:;<=>?@[\]{}]$/;
    function isDelimiter(char) {
        if (!char)
            return false;
        return Boolean(char.match(delimRegex));
    }
    exports.isDelimiter = isDelimiter;
    /**
      *
      * > tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
      * >                / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
      * >                / DIGIT / ALPHA
      * >                ; any VCHAR, except delimiters
      */
    function isTCHAR(char) {
        if (!char)
            return false;
        return isVCHAR(char) && !isDelimiter(char);
    }
    exports.isTCHAR = isTCHAR;
    /**
      * Is a single character part of the visible subset of ASCII (33 -> 127)?
      */
    function isVCHAR(char) {
        if (!char)
            return false;
        if (char.length != 1)
            throw new TypeError("Expected a single character or undefined, found instead " + char);
        var codepoint = char.codePointAt(0);
        return codepoint !== undefined
            && codepoint >= 33 && codepoint < 127;
    }
    exports.isVCHAR = isVCHAR;
    function isSpace(char) {
        if (char && char.length != 1)
            throw new TypeError("Expected a single character or undefined, found instead " + char);
        return char == ' ' || char == '\t';
    }
    exports.isSpace = isSpace;
    /**
      * Consume any whitespace at the current index. Does nothing if the end has been reached.
      */
    function consumeOptionalWhitespace(state) {
        for (;;) {
            if (state.index >= state.end) {
                return;
            }
            var current = state.string[state.index];
            if (current !== '\t' && current !== ' ') {
                return;
            }
            // must have been whitespace, continue
            ++state.index;
        }
    }
    exports.consumeOptionalWhitespace = consumeOptionalWhitespace;
    function readToNextLine(state) {
        var startIndex = state.index;
        var end;
        for (;;) {
            if (isAtCRLF(state)) {
                end = state.index;
                state.index += 2;
                break;
            }
            else if (isFinished(state)) {
                end = state.index;
                break;
            }
            ++state.index;
        }
        if (end === undefined) {
            throw new __1.ParseError("Unexpected.");
        }
        return state.string.substring(startIndex, end);
    }
    exports.readToNextLine = readToNextLine;
    function readToken(state) {
        var token = readOptionalToken(state);
        if (!token) {
            if (isFinished(state)) {
                throw new __1.ParseError('Unexpected EOF, expected token.');
            }
            throw new __1.ParseError("Unexpected '" + state.string[state.index] + "', expected token.");
        }
        return token;
    }
    exports.readToken = readToken;
    /**
      * Read a token, returning undefined if the current character is not a valid TCHAR or the state is finished.
      */
    function readOptionalToken(state) {
        if (state.index >= state.string.length) {
            return undefined;
        }
        var parts = [];
        for (; !isFinished(state); ++state.index) {
            var char = state.string[state.index];
            if (!isTCHAR(char)) {
                break;
            }
            parts.push(char);
        }
        return parts.length == 0 ? undefined : parts.join('');
    }
    exports.readOptionalToken = readOptionalToken;
    /*
     * Read a quoted string. Assumes that the current state is pointing to a double quote.
     * See 'quoted' in https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
     */
    function readQuoted(state) {
        // We are looking at the opening quote
        if (state.string[state.index] != '"') {
            throw new __1.ParseError("Unexpected " + state.string[state.index] + ", expected \".");
        }
        // move past the quotation mark
        ++state.index;
        var res = [];
        for (;;) {
            if (state.index >= state.end) {
                break;
            }
            var current = state.string[state.index];
            // See 'quoted-pair' in https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
            // A double quote is allowed if preceeded by a \
            if (current == '"' && state.string[state.index - 1] != '\\') {
                break;
            }
            res.push(current);
            ++state.index;
        }
        if (state.index >= state.end) {
            throw new __1.ParseError("Unexpected EOF, expecting '\"'.");
        }
        var closeQuote = state.string[state.index];
        if (closeQuote != '"') {
            throw new __1.ParseError("Unexpected '" + closeQuote + "', expecting '\"'.");
        }
        // move past the end quotation mark
        ++state.index;
        var merged = res.join('');
        // quoted pairs have a preceeding \, e.g. \"
        // Specifically replace \\ with \ and \" with ", but also anything else preceeded by a \
        return merged.replace(/\\(.)/g, '$1');
    }
    exports.readQuoted = readQuoted;
});
