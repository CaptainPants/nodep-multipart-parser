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
    exports.parseHeaders = void 0;
    var __1 = require("..");
    var internal_1 = require("./internal");
    /**
      * Refer https://datatracker.ietf.org/doc/html/rfc7230#section-3.2
      */
    function parseHeaders(params) {
        var _a;
        var headerString = (_a = params.headerString) !== null && _a !== void 0 ? _a : '';
        var state = {
            index: 0,
            end: headerString.length,
            string: headerString
        };
        var headers = [];
        for (;;) {
            var headerName = (0, internal_1.readOptionalToken)(state);
            if (!headerName) {
                break;
            }
            if ((0, internal_1.isFinished)(state)) {
                throw new __1.ParseError("Expected :, found instead EOF.");
            }
            var colon = state.string[state.index];
            if (colon != ':') {
                throw new __1.ParseError("Expected :, found instead '" + colon + "'.");
            }
            // move past the :
            state.index += 1;
            (0, internal_1.consumeOptionalWhitespace)(state);
            var value = '';
            if (!(0, internal_1.isFinished)(state)) {
                value += (0, internal_1.readToNextLine)(state);
                // handle obs-fold
                while (!(0, internal_1.isFinished)(state) && (0, internal_1.isSpace)(state.string[state.index])) {
                    // replace obs-fold newline with a single space per 
                    // https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.4
                    value += ' ';
                    value += (0, internal_1.readToNextLine)(state);
                }
            }
            headers.push({ name: headerName.toLowerCase(), value: value });
        }
        return {
            headers: headers
        };
    }
    exports.parseHeaders = parseHeaders;
});
