(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@jest/globals", "."], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var globals_1 = require("@jest/globals");
    var _1 = require(".");
    (0, globals_1.describe)('findBoundaryOffsets', function () {
        (0, globals_1.test)('test1', function () {
            var boundary = '9051914041544843365972754266';
            var dataview = (0, _1.asciiToDataViewForTesting)("\n--9051914041544843365972754266\nContent-Disposition: form-data; name=\"file1\"; filename=\"a.html\"\n\ntest1\n--9051914041544843365972754266\nContent-Disposition: form-data; name=\"file2\"; filename=\"b.html\"\n\ntest2\n--9051914041544843365972754266--"); // string literals use \n
            var result = (0, _1.findBoundaryOffsets)((0, _1.getCharCodesForString)(boundary), dataview);
            (0, globals_1.expect)(result).toEqual([
                { start: 0, end: 34, length: 34, isLast: false },
                { start: 106, end: 140, length: 34, isLast: false },
                { start: 212, end: 246, length: 34, isLast: true }
            ]);
        });
    });
    (0, globals_1.describe)('getCharCodes', function () {
        (0, globals_1.test)('abcdefg', function () {
            var codes = (0, _1.getCharCodesForString)('abcdefg');
            (0, globals_1.expect)(codes).toEqual([97, 98, 99, 100, 101, 102, 103]);
        });
    });
    (0, globals_1.describe)('matchBoundary', function () {
        (0, globals_1.test)('\\r\\n--a\\r\\n--aabcdefg', function () {
            // aabcdefg
            var bytes = [
                _1.chars.cr,
                _1.chars.lf,
                _1.chars.hyphen,
                _1.chars.hyphen,
                97,
                _1.chars.cr,
                _1.chars.lf,
                _1.chars.hyphen,
                _1.chars.hyphen,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                _1.chars.cr,
                _1.chars.lf
            ];
            var buffer = new ArrayBuffer(bytes.length);
            var uint8 = new Uint8Array(buffer);
            uint8.set(bytes, 0);
            var boundary = (0, _1.getCharCodesForString)('abcdefg');
            var data = new DataView(buffer);
            var res1 = (0, _1.matchBoundary)(boundary, data, 0);
            (0, globals_1.expect)(res1).toEqual(undefined);
            var res2 = (0, _1.matchBoundary)(boundary, data, 5);
            (0, globals_1.expect)(res2).toEqual({ start: 5, end: 18, length: 13, isLast: false });
        });
    });
});
