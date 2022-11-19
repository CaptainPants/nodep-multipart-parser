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
    exports.binaryToString = void 0;
    function binaryToString(binary, encoding) {
        if (binary instanceof Blob) {
            return blobToString(binary, encoding);
        }
        else {
            if (TextDecoder) {
                var decoder = new TextDecoder(encoding);
                return Promise.resolve(decoder.decode(binary));
            }
            else {
                // Basically IE11 here
                return blobToString(new Blob([binary]), encoding);
            }
        }
    }
    exports.binaryToString = binaryToString;
    function blobToString(blob, encoding) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.addEventListener('error', function (_) { return reject(new Error('Failed to decode text.')); });
            reader.addEventListener('error', function (_) { return resolve(reader.result); });
            reader.readAsText(blob, encoding);
        });
    }
});
