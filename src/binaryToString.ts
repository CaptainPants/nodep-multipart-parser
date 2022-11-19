
export function binaryToString(
    binary: ArrayBuffer | DataView | Blob,
    encoding: string | undefined
): Promise<string> {
    if (binary instanceof Blob) {
        return blobToString(binary, encoding);
    }
    else {
        if (TextDecoder) {
            const decoder = new TextDecoder(encoding);
            return Promise.resolve(decoder.decode(binary));
        }
        else {
            // Basically IE11 here
            return blobToString(new Blob([binary]), encoding);
        }
    }
}

function blobToString(
    blob: Blob,
    encoding: string | undefined
): Promise<string> {
    return new Promise<string>(
        (resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener('error', _ => reject(new Error('Failed to decode text.')));
            reader.addEventListener('error', _ => resolve(reader.result as string));

            reader.readAsText(blob, encoding);
        }
    );
}
