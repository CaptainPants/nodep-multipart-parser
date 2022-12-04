import { HeaderParserState } from "../HeaderParserState.js";

const percentEncoded = /^%([0-9A-F]{2})$/i;

export function readPercentEncoded(state: HeaderParserState): string | undefined {
    const res: string[] = [];

    for (; ;) {
        if (state.hasRemaining(3)) {
            const index = state.index();
            const next3 = state.string.substring(index, index + 3);

            if (next3.match(percentEncoded)) {
                res.push(next3);
                state.move(3);
                continue;
            }
        }

        break;
    }

    if (res.length == 0) {
        return undefined;
    }

    const encoded = res.join('');

    // Relying on this to do our % decoding
    const value = decodeURIComponent(encoded);
    return value;
}