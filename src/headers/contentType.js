(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", ".", ".."], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.getEncoding = exports.getBoundary = exports.isTextContentType = exports.isTextMediaType = void 0;
    var _1 = require(".");
    var __1 = require("..");
    function resolve(contentType) {
        try {
            return typeof contentType == 'object' ? contentType : (0, _1.parseContentType)(contentType);
        }
        catch (ex) {
            throw new __1.ParseError("Error parsing header. " + (ex instanceof Error ? ex.message : ex));
        }
    }
    function isTextMediaType(mediaType) {
        if (mediaType.startsWith('text/')) {
            return true;
        }
        else if (mediaType.match(/^application\/(?:[^+]+\+)?(json|xml)/)) {
            return true;
        }
        return false;
    }
    exports.isTextMediaType = isTextMediaType;
    function isTextContentType(contentType) {
        var contentTypeObj = resolve(contentType);
        return isTextMediaType(contentTypeObj.mediaType);
    }
    exports.isTextContentType = isTextContentType;
    function getBoundary(contentType) {
        var contentTypeObject = resolve(contentType);
        var boundaryIndex = contentTypeObject.parameters.findIndex(function (item) { return item.name == 'boundary'; });
        if (boundaryIndex < 0) {
            throw new __1.ParseError('Could not find boundary parameter.');
        }
        var boundary = contentTypeObject.parameters[boundaryIndex];
        return boundary.value;
    }
    exports.getBoundary = getBoundary;
    function getEncoding(contentType) {
        var contentTypeObject = resolve(contentType);
        var boundaryIndex = contentTypeObject.parameters.findIndex(function (item) { return item.name == 'boundary'; });
        if (boundaryIndex < 0) {
            throw new __1.ParseError('Could not find boundary parameter.');
        }
        var boundary = contentTypeObject.parameters[boundaryIndex];
        return boundary.value;
    }
    exports.getEncoding = getEncoding;
});
