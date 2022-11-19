(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@jest/globals", "./internal", "./MultipartParser"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var globals_1 = require("@jest/globals");
    var internal_1 = require("./internal");
    var MultipartParser_1 = require("./MultipartParser");
    var cr = 13;
    var lf = 10;
    var hyphen = '-'.charCodeAt(0);
    (0, globals_1.describe)('parse', function () {
        (0, globals_1.test)('example1', function () {
            var boundary = '9051914041544843365972754266';
            var dataview = (0, internal_1.asciiToDataViewForTesting)("\n--9051914041544843365972754266\nContent-Disposition: form-data; name=\"text\"\n\ntext default\n--9051914041544843365972754266\nContent-Disposition: form-data; name=\"file1\"; filename=\"a.txt\"\nContent-Type: text/plain\n\nContent of a.txt.\n\n--9051914041544843365972754266\nContent-Disposition: form-data; name=\"file2\"; filename=\"a.html\"\nContent-Type: text/html\n\n<!DOCTYPE html><title>Content of a.html.</title>\n\n--9051914041544843365972754266--");
            var parser = new MultipartParser_1.MultipartParser();
            var result = parser.parse(boundary, dataview).parts;
            (0, globals_1.expect)(result).toHaveLength(3);
            (0, globals_1.expect)(result[0].headers).toHaveLength(1);
            (0, globals_1.expect)(result[0].headers[0].name).toEqual('content-disposition');
            (0, globals_1.expect)(result[0].headers[0].value).toEqual('form-data; name="text"');
            (0, globals_1.expect)(result[1].headers).toHaveLength(2);
            (0, globals_1.expect)(result[1].headers[0].name).toEqual('content-disposition');
            (0, globals_1.expect)(result[1].headers[0].value).toEqual('form-data; name="file1"; filename="a.txt"');
            (0, globals_1.expect)(result[1].headers[1].name).toEqual('content-type');
            (0, globals_1.expect)(result[1].headers[1].value).toEqual('text/plain');
            (0, globals_1.expect)(result[2].headers).toHaveLength(2);
            (0, globals_1.expect)(result[2].headers[0].name).toEqual('content-disposition');
            (0, globals_1.expect)(result[2].headers[0].value).toEqual('form-data; name="file2"; filename="a.html"');
            (0, globals_1.expect)(result[2].headers[1].name).toEqual('content-type');
            (0, globals_1.expect)(result[2].headers[1].value).toEqual('text/html');
        });
    });
    (0, globals_1.describe)('splitPartHeaderAndBody', function () {
        (0, globals_1.test)('test1', function () {
            var part = (0, internal_1.asciiToDataViewForTesting)("Content-Disposition: form-data; name=\"file2\"; filename=\"b.html\"\n\ntest2-1234\n");
            var _a = MultipartParser_1.__testing.splitPartHeaderAndBody(part), headers = _a.headers, content = _a.content;
            (0, globals_1.expect)(headers).toEqual('Content-Disposition: form-data; name="file2"; filename="b.html"');
            var decoder = new TextDecoder();
            var decoded = decoder.decode(content);
            var expectedString = 'test2-1234\r\n';
            (0, globals_1.expect)(decoded).toHaveLength(expectedString.length);
            (0, globals_1.expect)(decoded).toEqual(expectedString);
        });
    });
    (0, globals_1.describe)('findParts', function () {
        (0, globals_1.test)('test1', function () {
            var boundary = '9051914041544843365972754266';
            var dataview = (0, internal_1.asciiToDataViewForTesting)("\n--9051914041544843365972754266\nContent-Disposition: form-data; name=\"file1\"; filename=\"a.html\"\n\ntest1\n--9051914041544843365972754266\nContent-Disposition: form-data; name=\"file2\"; filename=\"b.html\"\n\ntest2\n--9051914041544843365972754266--"); // string literals use \n
            var result = MultipartParser_1.__testing.findParts((0, internal_1.getCharCodesForString)(boundary), dataview);
            (0, globals_1.expect)(result).toHaveLength(2);
            var first = result[0];
            (0, globals_1.expect)((0, internal_1.getAsciiStringFromDataView)(first)).toEqual('Content-Disposition: form-data; name="file1"; filename="a.html"\r\n\r\ntest1');
            var second = result[1];
            (0, globals_1.expect)((0, internal_1.getAsciiStringFromDataView)(second)).toEqual('Content-Disposition: form-data; name="file2"; filename="b.html"\r\n\r\ntest2');
        });
    });
});
