import { blobToStringUsingFileReader } from "./blobToStringUsingFileReader.js";
import { createBlob } from "./createBlob.js";

/**
 * Convert from an ArrayBuffer or DataView to string via the Blob constructor (
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob) and FileReader.
 * This _may_ support other encodings than UTF-8 but I wouldn't count on it.
 *
 * This page has some good information on what browsers are supposed to support
 * https://stackoverflow.com/questions/40790042/filereader-which-encodings-are-supported
 * @param value
 * @param encoding
 * @returns
 */
export function expensiveCompatibleBlobSourceToString(
    value: ArrayBuffer | DataView,
    encoding: string | undefined
) {
    return blobToStringUsingFileReader(createBlob(value), encoding);
}
