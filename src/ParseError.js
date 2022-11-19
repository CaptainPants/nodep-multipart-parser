(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.ParseError = void 0;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    // https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
    // Borrowed some concepts from https://github.com/busbud/super-error/blob/master/index.js
    // https://github.com/justmoon/extensible-error/blob/master/src/index.ts
    function hasCaptureStackTrace(errorConstructor) {
        return typeof errorConstructor.captureStackTrace === 'function';
    }
    var ParseError = /** @class */ (function () {
        function ParseError(message) {
            Error.call(this, message);
            // Set this.message
            Object.defineProperty(this, 'message', {
                configurable: true,
                enumerable: false,
                value: message !== undefined ? String(message) : ''
            });
            // Set this.name
            Object.defineProperty(this, 'name', {
                configurable: true,
                enumerable: false,
                value: this.constructor.name
            });
            if (hasCaptureStackTrace(Error)) {
                Error.captureStackTrace(this, this.constructor);
            }
        }
        return ParseError;
    }());
    exports.ParseError = ParseError;
    // Extending 'Error' not supported on shittier browsers, so this makes instanceof work properly
    Object.setPrototypeOf(ParseError.prototype, Error.prototype);
});
