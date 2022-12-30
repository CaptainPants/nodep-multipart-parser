import { ParseError } from "../../errors/index.js";

export const chars = {
    cr: 13,
    lf: 10,
    hyphen: "-".charCodeAt(0),
} as const;

export function isDoubleCRLF(data: DataView, offset: number) {
    if (offset + 3 >= data.byteLength) {
        return false;
    }

    return (
        data.getUint8(offset) == chars.cr &&
        data.getUint8(offset + 1) == chars.lf &&
        data.getUint8(offset + 2) == chars.cr &&
        data.getUint8(offset + 3) == chars.lf
    );
}

export function isCRLF(data: DataView, offset: number) {
    if (offset + 1 >= data.byteLength) {
        return false;
    }

    const first = data.getUint8(offset);
    const second = data.getUint8(offset + 1);
    return first == chars.cr && second == chars.lf;
}

export function isDoubleHyphen(data: DataView, offset: number) {
    if (offset + 1 >= data.byteLength) {
        return false;
    }

    const first = data.getUint8(offset);
    const second = data.getUint8(offset + 1);
    return first == chars.hyphen && second == chars.hyphen;
}

/**
 * ASCII/ISO-8859-1 (should be a subset)
 */
export function getCharCodesForString(str: string) {
    const res: number[] = [];
    for (let i = 0; i < str.length; ++i) {
        const code = str.charCodeAt(i);
        if (code > 255) {
            throw new ParseError(
                "Boundary characters must be ISO-8859-1 values from 0-255."
            );
        }
        res.push(code);
    }
    return res;
}

export function getAsciiStringFromDataView(dataview: DataView) {
    const numbers: number[] = [];

    for (let i = 0; i < dataview.byteLength; ++i) {
        const current = dataview.getUint8(i);
        numbers.push(current);
    }

    return String.fromCharCode.apply(null, numbers);
}

export function asciiToDataViewForTesting(content: string) {
    const temp: number[] = [];
    for (let i = 0; i < content.length; ++i) {
        temp[i] = content.charCodeAt(i);
    }

    return new DataView(new Uint8Array(temp).buffer);
}
