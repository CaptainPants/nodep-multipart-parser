(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../.."], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.asciiToDataViewForTesting = exports.getAsciiStringFromDataView = exports.getCharCodesForString = exports.isDoubleHyphen = exports.isCRLF = exports.isDoubleCRLF = exports.chars = void 0;
    var __1 = require("../..");
    exports.chars = {
        cr: 13,
        lf: 10,
        hyphen: '-'.charCodeAt(0)
    };
    function isDoubleCRLF(data, offset) {
        if (offset + 3 >= data.byteLength) {
            return false;
        }
        return data.getUint8(offset) == exports.chars.cr &&
            data.getUint8(offset + 1) == exports.chars.lf &&
            data.getUint8(offset + 2) == exports.chars.cr &&
            data.getUint8(offset + 3) == exports.chars.lf;
    }
    exports.isDoubleCRLF = isDoubleCRLF;
    function isCRLF(data, offset) {
        if (offset + 1 >= data.byteLength) {
            return false;
        }
        var first = data.getUint8(offset);
        var second = data.getUint8(offset + 1);
        return first == exports.chars.cr && second == exports.chars.lf;
    }
    exports.isCRLF = isCRLF;
    function isDoubleHyphen(data, offset) {
        if (offset + 1 >= data.byteLength) {
            return false;
        }
        var first = data.getUint8(offset);
        var second = data.getUint8(offset + 1);
        return first == exports.chars.hyphen && second == exports.chars.hyphen;
    }
    exports.isDoubleHyphen = isDoubleHyphen;
    /**
      * ASCII/ISO-8859-1 (should be a subset)
      */
    function getCharCodesForString(str) {
        var res = [];
        for (var i = 0; i < str.length; ++i) {
            var code = str.charCodeAt(i);
            if (code > 255) {
                throw new __1.ParseError('Boundary characters must be ISO-8859-1 values from 0-255.');
            }
            res.push(code);
        }
        return res;
    }
    exports.getCharCodesForString = getCharCodesForString;
    function getAsciiStringFromDataView(dataview) {
        var numbers = [];
        for (var i = 0; i < dataview.byteLength; ++i) {
            var current = dataview.getUint8(i);
            numbers.push(current);
        }
        return String.fromCharCode.apply(null, numbers);
    }
    exports.getAsciiStringFromDataView = getAsciiStringFromDataView;
    function asciiToDataViewForTesting(content) {
        content = content.replace(/\n/g, '\r\n'); // javascript `` literal newlines are \n by itself
        var temp = [];
        for (var i = 0; i < content.length; ++i) {
            temp[i] = content.charCodeAt(i);
        }
        return new DataView(new Uint8Array(temp).buffer);
    }
    exports.asciiToDataViewForTesting = asciiToDataViewForTesting;
    ;
});
