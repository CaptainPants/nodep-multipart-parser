
export function binaryToString(
    value: ArrayBuffer | DataView | Blob,
    encoding: string | undefined
): Promise<string> {
    if (typeof value == 'string') {
        return Promise.resolve(value);
    }
    else if (value instanceof Blob) {
        return blobToString(value, encoding);
    }
    else {
        if (TextDecoder) {
            const decoder = new TextDecoder(encoding);
            return Promise.resolve(decoder.decode(value));
        }
        else {
            // Basically IE11 here
            return blobToString(new Blob([value]), encoding);
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
