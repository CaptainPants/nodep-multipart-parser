(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "..", "../headers", "./internal"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.__testing = exports.MultipartParser = void 0;
    var __1 = require("..");
    var headers_1 = require("../headers");
    var internal_1 = require("./internal");
    var MultipartParser = /** @class */ (function () {
        function MultipartParser() {
        }
        MultipartParser.prototype.parse = function (boundary, data) {
            var parts = [];
            // Get the equivelent ASCII values for the boundary string
            var boundaryCodes = (0, internal_1.getCharCodesForString)(boundary);
            // Using the boundary string, break the data DataView into segments
            var partViews = findParts(boundaryCodes, data);
            for (var i = 0; i < partViews.length; ++i) {
                var current = partViews[i];
                // Each part has a header and a body, this splits them into a string for headers 
                // and a DataView for the body
                var _a = splitPartHeaderAndBody(current), headerString = _a.headers, content = _a.content;
                var headersResult = (0, headers_1.parseHeaders)({ headerString: headerString });
                parts.push({
                    headers: headersResult.headers,
                    content: content
                });
            }
            return {
                parts: parts
            };
        };
        return MultipartParser;
    }());
    exports.MultipartParser = MultipartParser;
    function splitPartHeaderAndBody(dataview) {
        for (var i = 0; i < dataview.byteLength; ++i) {
            if ((0, internal_1.isDoubleCRLF)(dataview, i)) {
                var headerPart = new DataView(dataview.buffer, dataview.byteOffset, i);
                var headerString = (0, internal_1.getAsciiStringFromDataView)(headerPart);
                var startOfBodyPart = i + 4;
                var lengthOfBodyPart = dataview.byteLength - startOfBodyPart;
                var bodyPart = new DataView(dataview.buffer, dataview.byteOffset + startOfBodyPart, lengthOfBodyPart);
                return { headers: headerString, content: bodyPart };
            }
        }
        throw new __1.ParseError('No CR LF CR LF sequence found');
    }
    function findParts(boundaryCodes, data) {
        var boundaryOffsets = (0, internal_1.findBoundaryOffsets)(boundaryCodes, data);
        if (boundaryOffsets.length == 0) {
            return [];
        }
        var partViews = [];
        for (var i = 1; i < boundaryOffsets.length; ++i) {
            var startOffset = boundaryOffsets[i - 1];
            var endOffset = boundaryOffsets[i];
            var start = startOffset.end;
            var end = endOffset.start;
            var len = end - start;
            var partView = new DataView(data.buffer, data.byteOffset + start, len);
            partViews.push(partView);
        }
        return partViews;
    }
    exports.__testing = process.env.NODE_ENV == 'test' ? {
        splitPartHeaderAndBody: splitPartHeaderAndBody,
        findParts: findParts
    } : void 0;
});
