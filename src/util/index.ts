/**
 * Unit testing with instanceof ArrayBuffer was failing due to oddities in the jest jsdom environment, so use this to duck tye instead. setBigUint64 is to differentiate from typed arrays.
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
    return String(value) === "[object ArrayBuffer]";
}