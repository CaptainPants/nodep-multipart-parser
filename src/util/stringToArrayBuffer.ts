import { expensiveCompatibleStringToArrayBuffer } from "./expensiveCompatibleStringToArrayBuffer.js";

/**
 * Convert from a string to an ArrayBuffer using UTF-8 encoding. Use TextEncoder
 * for preference, and fall back to blob constructor if necessary.
 * @param value Input as a string
 * @returns The string encoded as binary according to UTF-8
 */
export function stringToArrayBuffer(value: string): Promise<ArrayBuffer> {
    if (typeof TextEncoder !== "undefined") {
        // The standard only requires utf-8
        // so lets make it easy on ourselves and not offer options
        return Promise.resolve(new TextEncoder().encode(value).buffer);
    } else {
        return expensiveCompatibleStringToArrayBuffer(value);
    }
}
