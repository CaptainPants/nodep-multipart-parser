

export function writeStringToDataView(str: string, view: DataView, offset: number): number {
    for (let i = 0; i < str.length; ++i) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
    return str.length;
}