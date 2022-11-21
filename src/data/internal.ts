
/**
 * Convert from a string to an ArrayBuffer using UTF-8 encoding. Use TextEncoder 
 * for preference, and fall back to blob constructor if necessary.
 * @param value Input as a string
 * @returns The string encoded as binary according to UTF-8
 */
export function stringToArrayBuffer(
    value: string
): Promise<ArrayBuffer> {
    if (typeof TextEncoder !== 'undefined') {
        // The standard only requires utf-8
        // so lets make it easy on ourselves and not offer options
        return Promise.resolve(new TextEncoder().encode(value).buffer);
    }
    else {
        return expensiveCompatibleStringToArrayBuffer(value);
    }
}

/**
 * Use the Blob constructor to convert from string to binary (
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob). This always uses 
 * UTF-8 encoding. This primarily exists for IE11.
 * @param value 
 * @returns 
 */
export function expensiveCompatibleStringToArrayBuffer(value: string): Promise<ArrayBuffer> {
    // MDN says the blob constructor uses utf-8
    return blobToArrayBuffer(new Blob([value]));
}

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
export function expensiveCompativalBlobSourceToString(
    value: ArrayBuffer | DataView, 
    encoding: string | undefined
) {
    return blobToString(new Blob([value]), encoding);
}

/**
 * Wraps using FileReader to convert from Blob to a string in a promise. Supported
 * encodings are not 100% clear.
 * 
 * This page has some good information on what browsers are supposed to support 
 * https://stackoverflow.com/questions/40790042/filereader-which-encodings-are-supported
 * @param blob 
 * @param sourceEncoding 
 * @returns 
 */
export function blobToString(
    blob: Blob,
    sourceEncoding: string | undefined
): Promise<string> {
    return new Promise<string>(
        (resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener('error', _ => reject(new Error('Failed to decode text.')));
            reader.addEventListener('load', _ => resolve(reader.result as string));

            reader.readAsText(blob, sourceEncoding);
        }
    );
}

/**
 * Wraps using FileReader to convert from Blob to an ArrayBuffer.
 * @param blob 
 * @returns 
 */
export function blobToArrayBuffer(
    blob: Blob
) {
    return new Promise<ArrayBuffer>(
        (resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener('error', _ => reject(new Error('Failed to decode text.')));
            reader.addEventListener('load', _ => resolve(reader.result as ArrayBuffer));

            reader.readAsArrayBuffer(blob);
        }
    );
}