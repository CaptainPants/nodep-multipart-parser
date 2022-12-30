import { blobToArrayBufferUsingFileReader } from "./blobToArrayBufferUsingFileReader.js";
import { createBlob } from "./createBlob.js";

/**
 * Use the Blob constructor to convert from string to binary (
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob). This always uses
 * UTF-8 encoding. This primarily exists for IE11.
 * @param value
 * @returns
 */
export function expensiveCompatibleStringToArrayBuffer(
    value: string
): Promise<ArrayBuffer> {
    // MDN says the blob constructor uses utf-8
    return blobToArrayBufferUsingFileReader(createBlob(value));
}
