(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", ".", "../.."], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.matchBoundary = exports.findBoundaryOffsets = void 0;
    var _1 = require(".");
    var __1 = require("../..");
    /**
      * https://www.rfc-editor.org/rfc/rfc2046#section-5.1.1
      * > The Content-Type field for multipart entities requires one parameter,
      * > "boundary". The boundary delimiter line is then defined as a line
      * > consisting entirely of two hyphen characters ("-", decimal value 45)
      * > followed by the boundary parameter value from the Content-Type header
      * > field, optional linear whitespace, and a terminating CRLF.
      */
    function findBoundaryOffsets(boundary, data) {
        if (boundary.length <= 0) {
            throw new __1.ParseError("Boundary length of 0 is not supported.");
        }
        var res = [];
        // TODO: if we hit the end and we're not on a last boundary,
        // or if we hit a last boundary and its not the end..
        for (var i = 0; i < data.byteLength;) {
            var matched = matchBoundary(boundary, data, i);
            if (matched) {
                res.push(matched);
                i += matched.length;
            }
            else {
                ++i;
            }
        }
        return res;
    }
    exports.findBoundaryOffsets = findBoundaryOffsets;
    function matchBoundary(boundary, data, dataOffset) {
        if (dataOffset >= data.byteLength) {
            throw new __1.ParseError('dataOffset past end of DataView.');
        }
        var start = dataOffset;
        // expected CR LF
        if (!(0, _1.isCRLF)(data, dataOffset)) {
            return undefined;
        }
        // expecting '-' '-'
        if (!(0, _1.isDoubleHyphen)(data, dataOffset + 2)) {
            return undefined;
        }
        // CR LF '-' '-'
        dataOffset += 4;
        for (var i = 0; i < boundary.length; ++i) {
            if (i >= data.byteLength) {
                return undefined; // we've hit the end of the data
            }
            if (boundary[i] !== data.getUint8(dataOffset + i)) {
                return undefined; // does not match boundary
            }
        }
        dataOffset += boundary.length;
        var isLast;
        if ((0, _1.isDoubleHyphen)(data, dataOffset)) {
            isLast = true;
            dataOffset += 2;
            if (dataOffset + 2 !== data.byteLength) {
                // This means we've hit the last boundary
                // TODO: not sure what we're supposed to do
            }
        }
        else {
            isLast = false;
            if ((0, _1.isCRLF)(data, dataOffset)) {
                dataOffset += 2;
            }
            else {
                // According to https://www.rfc-editor.org/rfc/rfc2046#section-5.1.1
                // Any content after the boundary on a line should be ignored.
                throw new Error('TODO: we should consume to the next CRLF here');
            }
        }
        return {
            start: start,
            end: dataOffset,
            length: dataOffset - start,
            isLast: isLast
        };
    }
    exports.matchBoundary = matchBoundary;
});
