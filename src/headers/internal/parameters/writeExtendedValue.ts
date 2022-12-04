import { blobToArrayBufferUsingFileReader } from "../../../util/blobToArrayBufferUsingFileReader.js";
import { isAttrChar } from "../is.js";

export async function writeExtendedValue(value: string): Promise<string> {
    const res: string[] = [];

    for (let currentIndex = 0; currentIndex < value.length;) {
        let startOfRunIndex = currentIndex;

        const charAtStartOfRun = value[currentIndex];

        if (isAttrChar(charAtStartOfRun)) {
            res.push(charAtStartOfRun);
            ++currentIndex;
        }
        else {
            // Try to handle runs of characters requiring encoding together as the IE11 fallback of string -> blob -> FileReader -> ArrayBuffer has a lot of overhead
            do {
                ++currentIndex
            }
            while (!isAttrChar(value[currentIndex]));

            res.push(await percentEncodeCharacters(value.substring(startOfRunIndex, currentIndex)));
        }
    }

    return res.join('');
}

const buffer = new Uint8Array(new ArrayBuffer(30));

function percentEncodeCharacters(str: string): Promise<string> {
    if (typeof TextEncoder === 'undefined') {
        return slowCompatiblePercentEncodeCharactersBlobConstructor(str)
    }
    else {
        return Promise.resolve(percentEncodeCharactersUsingTextEncoder(str));
    }
}

function hex(byte: number) {
    let hexEncoded = byte.toString(16).toUpperCase();
    while (hexEncoded.length < 2) {
        hexEncoded = '0' + hexEncoded;
    }
    return '%' + hexEncoded;
}

function percentEncodeCharactersUsingTextEncoder(str: string): string {
    const encoder = new TextEncoder();

    const res: string[] = [];

    for (; ;) {
        let offset = 0;

        const { read, written } = encoder.encodeInto(str, buffer);
        if (typeof read === 'undefined' || typeof written == 'undefined') {
            throw new Error('Unexpected read == undefined or written == undefined.');
        }

        for (let i = 0; i < written; ++i) {
            const current = buffer[i];

            res.push(hex(current));
        }

        offset += read;

        if (offset >= str.length) {
            break;
        }
    }

    return res.join('');
}

/**
  * This is _probably_ horribly slow.
  */
async function slowCompatiblePercentEncodeCharactersBlobConstructor(str: string): Promise<string> {
    const blob = new Blob([str]);

    const binary = await blobToArrayBufferUsingFileReader(blob);

    const res: string[] = [];

    for (let i = 0; i < binary.byteLength; ++i) {
        const current = buffer[i];

        res.push(hex(current))
    }

    return res.join('');
}