import { HeaderParserState } from "./HeaderParserState.js";

export function isFinished(state: HeaderParserState) {
    return state.index >= state.end;
}

export function isAtCRLF(state: HeaderParserState) {
    if (state.index + 1 > state.end) {
        return false;
    }

    return (
        state.string[state.index] == "\r" &&
        state.string[state.index + 1] == "\n"
    );
}

const delimRegex = /^["(),/:;<=>?@[\]{}]$/;
export function isDelimiter(char: string | undefined) {
    if (!char) return false;
    return Boolean(char.match(delimRegex));
}

/**
 *
 * > tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 * >                / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 * >                / DIGIT / ALPHA
 * >                ; any VCHAR, except delimiters
 */
export function isTCHAR(char: string | undefined) {
    if (!char) return false;
    return isVCHAR(char) && !isDelimiter(char);
}

/**
 * Is a single character part of the visible subset of ASCII (33 -> 127)?
 */
export function isVCHAR(char: string | undefined) {
    if (!char) return false;
    if (char.length != 1)
        throw new TypeError(
            `Expected a single character or undefined, found instead ${char}`
        );
    const codepoint = char.codePointAt(0);
    return codepoint !== undefined && codepoint >= 33 && codepoint < 127;
}

export function isSpace(char: string | undefined) {
    if (char && char.length != 1)
        throw new TypeError(
            `Expected a single character or undefined, found instead ${char}`
        );
    return char == " " || char == "\t";
}
