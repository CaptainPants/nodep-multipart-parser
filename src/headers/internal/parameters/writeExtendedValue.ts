import { blobToArrayBufferUsingFileReader } from "../../../internal/util/blobToArrayBufferUsingFileReader.js";
import { createBlob } from "../../../internal/util/createBlob.js";
import { isAttrChar } from "../is.js";

export async function writeExtendedValue(value: string): Promise<string> {
    const res: string[] = [];

    for (let currentIndex = 0; currentIndex < value.length; ) {
        const startOfRunIndex = currentIndex;

        const charAtStartOfRun = value[currentIndex];

        if (isAttrChar(charAtStartOfRun)) {
            res.push(charAtStartOfRun);
            ++currentIndex;
        } else {
            // Try to handle runs of characters requiring encoding together as the IE11 fallback of string -> blob -> FileReader -> ArrayBuffer has a lot of overhead
            do {
                ++currentIndex;
            } while (!isAttrChar(value[currentIndex]));

            res.push(
                await percentEncodeCharacters(
                    value.substring(startOfRunIndex, currentIndex)
                )
            );
        }
    }

    return res.join("");
}

function percentEncodeCharacters(str: string): Promise<string> {
    if (typeof TextEncoder === "undefined") {
        return slowCompatiblePercentEncodeCharactersBlobConstructor(str);
    } else {
        return Promise.resolve(percentEncodeCharactersUsingTextEncoder(str));
    }
}

function hex(byte: number) {
    let hexEncoded = byte.toString(16).toUpperCase();
    while (hexEncoded.length < 2) {
        hexEncoded = "0" + hexEncoded;
    }
    return "%" + hexEncoded;
}

const bufferForPercentEncodeCharactersUsingTextEncoder = new Uint8Array(
    new ArrayBuffer(30)
);

export function percentEncodeCharactersUsingTextEncoder(str: string): string {
    const encoder = new TextEncoder();

    const res: string[] = [];

    let offset = 0;

    for (;;) {
        const substr = offset === 0 ? str : str.substring(offset);

        const { read, written } = encoder.encodeInto(
            substr,
            bufferForPercentEncodeCharactersUsingTextEncoder
        );

        if (typeof read === "undefined" || typeof written == "undefined") {
            throw new Error(
                "Unexpected read == undefined or written == undefined."
            );
        }

        for (let i = 0; i < written; ++i) {
            const current = bufferForPercentEncodeCharactersUsingTextEncoder[i];

            res.push(hex(current));
        }

        offset += read;

        if (offset >= str.length) {
            break;
        }
    }

    return res.join("");
}

/**
 * This is _probably_ horribly slow, but it will work anywhere that has Blob constructor and FileReader whish is
 * pretty much any browser.
 */
export async function slowCompatiblePercentEncodeCharactersBlobConstructor(
    str: string
): Promise<string> {
    const blob = createBlob(str);

    const arrayBuffer = await blobToArrayBufferUsingFileReader(blob);
    const uint8ArrayIntoArrayBuffer = new Uint8Array(arrayBuffer);

    const res: string[] = [];

    for (let i = 0; i < arrayBuffer.byteLength; ++i) {
        const current = uint8ArrayIntoArrayBuffer[i];

        res.push(hex(current));
    }

    return res.join("");
}
