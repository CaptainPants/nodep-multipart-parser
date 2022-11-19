
export async function binaryToString(
    binary: ArrayBuffer | DataView | Blob,
    encoding: string | undefined
): Promise<string> {
    if (binary instanceof Blob) {
        return blobToString(binary, encoding);
    }
    else {
        if (TextDecoder) {
            const decoder = new TextDecoder(encoding);
            return decoder.decode(binary);
        }
        else {
            // Basically IE11 here
            return await blobToString(new Blob([binary]), encoding);
        }
    }
}

async function blobToString(
    blob: Blob,
    encoding: string | undefined
) {
    return new Promise<string>(
        (resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener('error', _ => reject(new Error('Failed to decode text.')));
            reader.addEventListener('error', _ => resolve(reader.result as string));

            reader.readAsText(blob, encoding);
        }
    );
}
