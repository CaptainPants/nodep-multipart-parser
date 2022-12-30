declare global {
    interface MSBlobBuilder {
        append(data: unknown, endings?: string): void;
        getBlob(type?: string): Blob;
    }

    interface Window {
        MSBlobBuilder: new () => MSBlobBuilder;
    }
}

export function createBlob(
    source: string | DataView | ArrayBuffer,
    type?: string | undefined
) {
    // IE11 chokes on passing a typed array or dataview to the blob constructor,
    // so using its special 'MSBlobBuilder'
    if (
        source instanceof DataView &&
        typeof window.MSBlobBuilder !== 'undefined'
    ) {
        const builder = new window.MSBlobBuilder();
        // Make a Uint8Array around the dataview bytes, as otherwise you end up with [Object object]
        // in the blob
        builder.append(new Uint8Array(source.buffer, source.byteOffset, source.byteLength));
        return builder.getBlob(type);
    }

    return new Blob([source], { type: type });
}
