

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
export function blobToStringUsingFileReader(
    blob: Blob,
    sourceEncoding: string | undefined
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("error", (_) =>
            reject(new Error("Failed to decode text."))
        );
        reader.addEventListener("load", (_) =>
            resolve(reader.result as string)
        );

        reader.readAsText(blob, sourceEncoding);
    });
}