
/**
 * Wraps using FileReader to convert from Blob to an ArrayBuffer.
 * @param blob
 * @returns
 */
export function blobToArrayBufferUsingFileReader(blob: Blob) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("error", (_) =>
            reject(new Error("Failed to decode text."))
        );
        reader.addEventListener("load", (_) =>
            resolve(reader.result as ArrayBuffer)
        );

        reader.readAsArrayBuffer(blob);
    });
}