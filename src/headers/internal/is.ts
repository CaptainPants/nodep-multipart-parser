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
export function isTCHAR(char: string): char is string {
    if (!char) return false;
    return isVCHAR(char) && !isDelimiter(char);
}

/**
 * Is a single character part of the visible subset of ASCII (33 -> 127)?
 */
export function isVCHAR(char: string): char is string {
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
export function isSPOrVTAB(char: string): char is " " | "\t" {
    if (char.length != 1) {
        throw new TypeError(
            `Expected a single character, found instead ${char}`
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
    return typeof char != "undefined" && char.match(obsTextRegex) !== null;
}

const qdTextRegex = /^[\t \x21\x23-\x5B\x5D-\x7E]$/;
/**
 *         qdtext = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
 */
export function isQDTEXT(char: string | undefined): char is string {
    return (
        typeof char != "undefined" &&
        (char.match(qdTextRegex) !== null || isObsText(char))
    );
}

/**
 *        TEXT           = <any OCTET except CTLs,
 *                         but including LWS>
 */
export function isTEXT(char: string) {
    const code = char.codePointAt(0);
    if (typeof code === "undefined" || char.length != 1) {
        return false;
    }

    return code >= 0 && code <= 127 && !isCTL(char);
}

/**
 * Control characters
 *         CTL            = <any US-ASCII control character
 *                         (octets 0 - 31) and DEL (127)>
 */
export function isCTL(char: string) {
    const code = char.codePointAt(0);
    if (typeof code === "undefined" || char.length != 1) {
        return false;
    }

    return (0 <= code && code <= 31) || code == 127;
}

export function isFieldVCHAR(char: string) {
    return isVCHAR(char) || isObsText(char);
}

// qdtext         = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
// obs-text       = %x80-FF
const quoteSafeRegex = /^[\t \x21\x23-\x5B\x5D-\x7E\x80-\xFF]$/;

export function isQuoteSafe(char: string) {
    if (char.length != 1)
        throw new Error(`Expected a single character, found instead ${char}`);

    // qdtext         = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
    // obs-text       = %x80-FF
    return char.match(quoteSafeRegex) !== null;
}

/**
 * See https://datatracker.ietf.org/doc/html/rfc8187#section-3.2.1
 *
 *      attr-char     = ALPHA / DIGIT
 *                   / "!" / "#" / "$" / "&" / "+" / "-" / "."
 *                   / "^" / "_" / "`" / "|" / "~"
 *                   ; token except ( "*" / "'" / "%" )
 */
export function isAttrChar(char: string) {
    if (char.length != 1) {
        throw new TypeError(
            `Expected a single character, found instead ${char}`
        );
    }

    return isTCHAR(char) && char != "*" && char != "'" && char != "%";
}
