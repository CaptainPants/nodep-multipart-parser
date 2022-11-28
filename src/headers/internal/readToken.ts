import { ParseError } from "../../index.js";
import { HeaderParserState } from "./HeaderParserState.js";
import { isTCHAR } from "./is.js";

/**
  * Refer to https://datatracker.ietf.org/doc/html/rfc2616#section-2.2
  */
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
  * Refer to https://datatracker.ietf.org/doc/html/rfc2616#section-2.2
  */
export function readOptionalToken(state: HeaderParserState) {
    if (state.isFinished()) {
        return undefined;
    }

    const parts: string[] = [];

    for (; ; state.moveNext()) {
        const char = state.current();

        if (typeof char === 'undefined' || !isTCHAR(char)) {
            break;
        }

        parts.push(char);
    }

    return parts.length == 0 ? undefined : parts.join("");
}

