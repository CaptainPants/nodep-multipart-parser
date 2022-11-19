(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@jest/globals", "..", "./parseContentType"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var globals_1 = require("@jest/globals");
    var __1 = require("..");
    var parseContentType_1 = require("./parseContentType");
    (0, globals_1.describe)('getContentTypeParts', function () {
        (0, globals_1.test)('image/png', function () {
            var res = (0, parseContentType_1.parseContentType)('image/png');
            (0, globals_1.expect)(res.mediaType).toEqual('image/png');
            (0, globals_1.expect)(res.type).toEqual('image');
            (0, globals_1.expect)(res.subtype).toEqual('png');
            (0, globals_1.expect)(Object.keys(res.parameters).length === 0);
        });
        (0, globals_1.test)('image', function () {
            (0, globals_1.expect)(function () { return (0, parseContentType_1.parseContentType)('image'); }).toThrow(__1.ParseError);
        });
        (0, globals_1.test)('text/json; encoding=utf-8', function () {
            var res = (0, parseContentType_1.parseContentType)('text/json; encoding=utf-8');
            (0, globals_1.expect)(res.mediaType).toEqual('text/json');
            (0, globals_1.expect)(res.parameters).toEqual([{ name: "encoding", value: "utf-8" }]);
        });
        (0, globals_1.test)('text/json; encoding=utf-8 ; boundary="ham sandwich \\"1\\" 1234 "', function () {
            var res = (0, parseContentType_1.parseContentType)('text/json; encoding=utf-8 ; boundary="ham sandwich \\"1\\" 1234 "');
            (0, globals_1.expect)(res.mediaType).toEqual('text/json');
            (0, globals_1.expect)(res.parameters).toEqual([
                { name: "encoding", value: "utf-8" },
                { name: "boundary", value: "ham sandwich \"1\" 1234 " }
            ]);
        });
        (0, globals_1.test)('text/json; encoding="utf-8"', function () {
            var res = (0, parseContentType_1.parseContentType)('text/json; encoding="utf-8"');
            (0, globals_1.expect)(res.mediaType).toEqual('text/json');
            (0, globals_1.expect)(res.parameters).toEqual([{ name: "encoding", value: "utf-8" }]);
        });
    });
    (0, globals_1.describe)('readOneParameter', function () {
        (0, globals_1.test)('encoding=utf-8', function () {
            var input = 'encoding=utf-8 ';
            var parameters = {};
            var res = parseContentType_1.__testing.readOneParameter({ index: 0, end: input.length, string: input });
            var keys = Object.keys(parameters);
            (0, globals_1.expect)(res).toEqual({ name: "encoding", value: 'utf-8' });
        });
    });
});
