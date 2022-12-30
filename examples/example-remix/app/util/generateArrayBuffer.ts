
export function generateArrayBuffer(length = 1024) {
    const content = new ArrayBuffer(length);
    const array = new Uint8Array(content);

    for (let i = 0; i < array.byteLength; ++i) {
        array.set(i, Math.floor(Math.random() * 255));
    }

    return content;
}