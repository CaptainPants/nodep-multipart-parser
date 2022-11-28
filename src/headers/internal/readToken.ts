import { ParseError } from "../../index.js";
import { HeaderParserState } from "./HeaderParserState.js";
import { isTCHAR } from "./is.js";

export function readToken(state: HeaderParserState) {
    const token = readOptionalToken(state);
    if (!token) {
        if (state.isFinished()) {
            throw new ParseError("Unexpected EOF, expected token.");
        }
        throw new ParseError(
            `Unexpected '${state.current()}', expected token.`
        );
    }
    return token;
}

/**
 * Read a token, returning undefined if the current character is not a valid TCHAR or the state is finished.
 */
export function readOptionalToken(state: HeaderParserState) {
    if (state.isFinished()) {
        return undefined;
    }

    const parts: string[] = [];

    for (; !state.isFinished(); state.moveNext()) {
        const char = state.current();

        if (!isTCHAR(char)) {
            break;
        }

        parts.push(char);
    }

    return parts.length == 0 ? undefined : parts.join("");
}

