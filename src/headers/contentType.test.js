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
    (0, globals_1.describe)('getBoundary', function () {
        (0, globals_1.test)('multipart/form-data; boundary="example1-2-3"', function () {
            var boundary = (0, _1.getBoundary)('multipart/form-data; boundary="example1-2-3"');
            (0, globals_1.expect)(boundary).toEqual('example1-2-3');
        });
    });
});
