(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@jest/globals", "./parseHeaders"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var globals_1 = require("@jest/globals");
    var parseHeaders_1 = require("./parseHeaders");
    (0, globals_1.describe)('parseHeaders', function () {
        (0, globals_1.test)('test1', function () {
            var headers = "Content-Disposition: form-data; name=\"file2\"; filename=\"a.html\"\nContent-Type: text/html".replace(/\n/g, '\r\n');
            var res = (0, parseHeaders_1.parseHeaders)({ headerString: headers }).headers;
            (0, globals_1.expect)(res).toHaveLength(2);
            (0, globals_1.expect)(res[0].name).toEqual('content-disposition');
            (0, globals_1.expect)(res[0].value).toEqual('form-data; name="file2"; filename="a.html"');
            (0, globals_1.expect)(res[1].name).toEqual('content-type');
            (0, globals_1.expect)(res[1].value).toEqual('text/html');
        });
        (0, globals_1.test)('obs-fold', function () {
            // note the content-disposition header is over two lines
            var headers = "Content-Disposition: form-data; name=\"file2\";\n filename=\"a.html\"\nContent-Type: text/html".replace(/\n/g, '\r\n');
            var res = (0, parseHeaders_1.parseHeaders)({ headerString: headers }).headers;
            (0, globals_1.expect)(res).toHaveLength(2);
            (0, globals_1.expect)(res[0].name).toEqual('content-disposition');
            (0, globals_1.expect)(res[0].value).toEqual('form-data; name="file2";  filename="a.html"');
            (0, globals_1.expect)(res[1].name).toEqual('content-type');
            (0, globals_1.expect)(res[1].value).toEqual('text/html');
        });
    });
});
