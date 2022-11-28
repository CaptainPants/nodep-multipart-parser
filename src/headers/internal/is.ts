
const delimRegex = /^["(),/:;<=>?@[\]{}]$/;
export function isDelimiter(char: string | undefined): char is string {
    if (!char) return false;
    return char.match(delimRegex) !== null;
}

/**
 *
 * > tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 * >                / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 * >                / DIGIT / ALPHA
 * >                ; any VCHAR, except delimiters
 */
export function isTCHAR(char: string | undefined): char is string {
    if (!char) return false;
    return isVCHAR(char) && !isDelimiter(char);
}

/**
 * Is a single character part of the visible subset of ASCII (33 -> 127)?
 */
export function isVCHAR(char: string | undefined): char is string {
    if (!char) return false;
    if (char.length != 1)
        throw new TypeError(
            `Expected a single character or undefined, found instead ${char}`
        );
    const codepoint = char.codePointAt(0);
    return codepoint !== undefined && codepoint >= 33 && codepoint < 127;
}

/**
  * Space or tab (SP / VTAB)
  */
export function isSPOrVTAB(char: string | undefined): char is ' ' | '\t' {
    if (char && char.length != 1) {
        throw new TypeError(
            `Expected a single character or undefined, found instead ${char}`
        );
    }
    return char == " " || char == "\t";
}

// %x80-FF
const obsTextRegex = /^[\x80-\xFF]$/;

/**
  * Matches obs-text https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
  */
export function isObsText(char: string | undefined): char is string {
    return typeof char != 'undefined' && char.match(obsTextRegex) !== null;
}

// qdtext = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
const qdTextRegex = /^[\t \x21\x23-\x5B\x5D-\x7E]$/;

export function isQDTEXT(char: string | undefined): char is string {
    return typeof char != 'undefined'
        && (char.match(qdTextRegex) !== null || isObsText(char));
}