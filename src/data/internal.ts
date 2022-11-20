

//TODO doc comment that this is always to utf-8
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

export function expensiveCompatibleStringToArrayBuffer(value: string): Promise<ArrayBuffer> {
    // MDN says the blob constructor uses utf-8 TODO: cite url
    return blobToArrayBuffer(new Blob([value]));
}

export function expensiveCompativalBlobSourceToString(value: ArrayBuffer | DataView, encoding: string | undefined) {
    return blobToString(new Blob([value]), encoding);
}

// TODO doc comment that this is always utf-8
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