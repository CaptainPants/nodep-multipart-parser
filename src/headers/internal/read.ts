
import { ParseError } from "../../errors/ParseError.js";
import { HeaderParserState } from "./HeaderParserState.js";
import { isAtCRLF, isFinished, isTCHAR } from "./is.js";

// refer https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.5
// > media-type = type "/" subtype *( OWS ";" OWS parameter )
// > parameter  = token "=" ( token / quoted-string )
// https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.3
// zero or more linear whitespace octets
// > OWS            = ( SP / HTAB )
// https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
// > token          = 1*tchar
// > tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
// >                / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
// >                / DIGIT / ALPHA
// >                ; any VCHAR, except delimiters
// > quoted-string  = DQUOTE *( qdtext / quoted-pair ) DQUOTE
// > qdtext         = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
// > obs-text       = %x80-FF
// > delimiter      => any of "(),/:;<=>?@[\]{}

/**
 * Consume any whitespace at the current index. Does nothing if the end has been reached.
 */
export function consumeOptionalWhitespace(state: HeaderParserState) {
    for (; ;) {
        if (state.index >= state.end) {
            return;
        }

        const current = state.string[state.index];
        if (current !== "\t" && current !== " ") {
            return;
        }

        // must have been whitespace, continue
        ++state.index;
    }
}

export function readToNextLine(state: HeaderParserState) {
    const startIndex = state.index;
    let end: number | undefined;

    for (; ;) {
        if (isAtCRLF(state)) {
            end = state.index;
            state.index += 2;
            break;
        } else if (isFinished(state)) {
            end = state.index;
            break;
        }

        ++state.index;
    }

    if (end === undefined) {
        throw new ParseError("Unexpected.");
    }

    return state.string.substring(startIndex, end);
}

export function readToken(state: HeaderParserState) {
    const token = readOptionalToken(state);
    if (!token) {
        if (isFinished(state)) {
            throw new ParseError("Unexpected EOF, expected token.");
        }
        throw new ParseError(
            `Unexpected '${state.string[state.index]}', expected token.`
        );
    }
    return token;
}

/**
 * Read a token, returning undefined if the current character is not a valid TCHAR or the state is finished.
 */
export function readOptionalToken(state: HeaderParserState) {
    if (state.index >= state.string.length) {
        return undefined;
    }

    const parts: string[] = [];

    for (; !isFinished(state); ++state.index) {
        const char = state.string[state.index];

        if (!isTCHAR(char)) {
            break;
        }

        parts.push(char);
    }

    return parts.length == 0 ? undefined : parts.join("");
}

/*
 * Read a quoted string. Assumes that the current state is pointing to a double quote.
 * See 'quoted' in https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
 */
export function readQuoted(state: HeaderParserState) {
    // We are looking at the opening quote

    if (state.string[state.index] != '"') {
        throw new ParseError(
            `Unexpected ${state.string[state.index]}, expected ".`
        );
    }

    // move past the quotation mark
    ++state.index;

    const res: string[] = [];

    for (; ;) {
        if (state.index >= state.end) {
            break;
        }

        const current = state.string[state.index];

        // See 'quoted-pair' in https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
        // A double quote is allowed if preceeded by a \
        if (current == '"' && state.string[state.index - 1] != "\\") {
            break;
        }

        res.push(current);

        ++state.index;
    }

    if (state.index >= state.end) {
        throw new ParseError(`Unexpected EOF, expecting '"'.`);
    }

    const closeQuote = state.string[state.index];
    if (closeQuote != '"') {
        throw new ParseError(`Unexpected '${closeQuote}', expecting '"'.`);
    }

    // move past the end quotation mark
    ++state.index;

    const merged = res.join("");
    // quoted pairs have a preceeding \, e.g. \"
    // Specifically replace \\ with \ and \" with ", but also anything else preceeded by a \
    return merged.replace(/\\(.)/g, "$1");
}
