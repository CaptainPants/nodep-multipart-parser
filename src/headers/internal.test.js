(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@jest/globals", "./internal"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var globals_1 = require("@jest/globals");
    var internal_1 = require("./internal");
    (0, globals_1.describe)('isFinished', function () {
        (0, globals_1.test)('false 1', function () {
            (0, globals_1.expect)((0, internal_1.isFinished)({ index: 0, end: 10, string: 'abcdefghijk' })).toEqual(false);
        });
        (0, globals_1.test)('true 1', function () {
            (0, globals_1.expect)((0, internal_1.isFinished)({ index: 10, end: 10, string: 'abcdefghijk' })).toEqual(true);
        });
        (0, globals_1.test)('true 1', function () {
            (0, globals_1.expect)((0, internal_1.isFinished)({ index: 11, end: 10, string: 'abcdefghijk' })).toEqual(true);
        });
    });
    (0, globals_1.describe)('isAtCRLF', function () {
        (0, globals_1.test)('true 1', function () {
            (0, globals_1.expect)((0, internal_1.isAtCRLF)({ index: 0, end: 2, string: '\r\n' })).toEqual(true);
        });
        (0, globals_1.test)('false 1', function () {
            (0, globals_1.expect)((0, internal_1.isAtCRLF)({ index: 1, end: 2, string: '\r\n' })).toEqual(false);
        });
        (0, globals_1.test)('false 2', function () {
            (0, globals_1.expect)((0, internal_1.isAtCRLF)({ index: 0, end: 5, string: 'abcde' })).toEqual(false);
        });
    });
    (0, globals_1.describe)('readToNextLine', function () {
        (0, globals_1.test)('test 1', function () {
            var input = 'test1 2 3 4\r\nbanana';
            var res = (0, internal_1.readToNextLine)({ index: 0, end: input.length, string: input });
            (0, globals_1.expect)(res).toEqual('test1 2 3 4');
        });
    });
    (0, globals_1.describe)('readToken', function () {
        (0, globals_1.test)('encoding=utf-8', function () {
            var input = 'encoding=utf-8 ';
            var res = (0, internal_1.readToken)({ index: 0, end: input.length, string: input });
            (0, globals_1.expect)(res).toEqual('encoding');
        });
    });
    (0, globals_1.describe)('readQuoted', function () {
        (0, globals_1.test)('"hello there \\x1 \\" "', function () {
            var input = '"hello there \\x1 \\" "';
            var res = (0, internal_1.readQuoted)({ index: 0, end: input.length, string: input });
            (0, globals_1.expect)(res).toEqual('hello there x1 " ');
        });
    });
    (0, globals_1.describe)('consumeOptionalWhitespace', function () {
        (0, globals_1.test)('      =', function () {
            var input = '      =';
            var state = { index: 0, end: input.length, string: input };
            (0, internal_1.consumeOptionalWhitespace)(state);
            (0, globals_1.expect)(state).toEqual({ index: 6, end: 7, string: input });
            (0, globals_1.expect)(state.string[state.index]).toEqual('=');
        });
        (0, globals_1.test)('word', function () {
            var input = 'word';
            var state = { index: 0, end: input.length, string: input };
            (0, internal_1.consumeOptionalWhitespace)(state);
            (0, globals_1.expect)(state).toEqual({ index: 0, end: input.length, string: input });
            (0, globals_1.expect)(state.string[state.index]).toEqual('w');
        });
    });
});
