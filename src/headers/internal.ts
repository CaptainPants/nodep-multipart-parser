

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

import { ParseError } from "../ParseError";

export interface HeaderParserState {
    index: number;
    end: number;
    string: string;
}

export function isFinished(state: HeaderParserState) {
    return state.index >= state.end;
}

export function isAtCRLF(state: HeaderParserState) {
    if (state.index + 1 > state.end) {
        return false;
    }

    return state.string[state.index] == '\r' && state.string[state.index + 1] == '\n';
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
    if (char.length != 1) throw new TypeError(`Expected a single character or undefined, found instead ${char}`);
    const codepoint = char.codePointAt(0);
    return codepoint !== undefined
        && codepoint >= 33 && codepoint < 127;
}

export function isSpace(char: string | undefined) {
    if (char && char.length != 1) throw new TypeError(`Expected a single character or undefined, found instead ${char}`);
    return char == ' ' || char == '\t';
}

/**
  * Consume any whitespace at the current index. Does nothing if the end has been reached.
  */
export function consumeOptionalWhitespace(state: HeaderParserState) {
    for (; ;) {
        if (state.index >= state.end) {
            return;
        }

        const current = state.string[state.index];
        if (current !== '\t' && current !== ' ') {
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
        }
        else if (isFinished(state)) {
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
            throw new ParseError('Unexpected EOF, expected token.');
        }
        throw new ParseError(`Unexpected '${state.string[state.index]}', expected token.`);
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

    return parts.length == 0 ? undefined : parts.join('');
}

/*
 * Read a quoted string. Assumes that the current state is pointing to a double quote.
 * See 'quoted' in https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
 */
export function readQuoted(state: HeaderParserState) {
    // We are looking at the opening quote

    if (state.string[state.index] != '"') {
        throw new ParseError(`Unexpected ${state.string[state.index]}, expected ".`);
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
        if (current == '"' && state.string[state.index - 1] != '\\') {
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

    const merged = res.join('');
    // quoted pairs have a preceeding \, e.g. \"
    // Specifically replace \\ with \ and \" with ", but also anything else preceeded by a \
    return merged.replace(/\\(.)/g, '$1');
}


/**
  * Refer to 'parameter' in https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.1
  */
export function readOneParameter(state: HeaderParserState): { name: string, value: string } | undefined {
    consumeOptionalWhitespace(state);

    const parameterName = readOptionalToken(state);

    if (!parameterName) {
        if (isFinished(state)) {
            return undefined;
        }
        else {
            throw new ParseError(`Unexpected ${state.string[state.index]}, expecting a token.`);
        }
    }

    // technically not allowed, but for tolerance sake
    consumeOptionalWhitespace(state);

    if (isFinished(state) || state.string[state.index] !== '=') {
        throw new ParseError(`Unexpected ${state.string[state.index]}, expecting an equals sign.`);
    }

    // move past the =
    ++state.index;

    // technically not allowed, but for tolerance sake
    consumeOptionalWhitespace(state);

    if (isFinished(state)) {
        throw new ParseError(`Unexpected EOF, expecting a token or quoted-string.`);
    }

    let value: string;
    if (state.string[state.index] === '"') {
        value = readQuoted(state);
    }
    else {
        value = readToken(state);
    }

    return { name: parameterName, value: value };
}

export type Parameters = { name: string; value: string }[];

export function processParametersIfPresent(state: HeaderParserState): Parameters {
    const res: Parameters = [];

    for (; ;) {
        // sitting just after the previous parameter
        consumeOptionalWhitespace(state);

        if (isFinished(state)) {
            break;
        }

        // there should be a ; between parameters
        const semicolon = state.string[state.index];
        if (semicolon !== ';') {
            throw new ParseError(`Unexpected '${semicolon}' when expecting a semi-colon ';'.`);
        }

        // move past semicolon
        ++state.index;

        // then a parameter
        const parameter = readOneParameter(state);

        if (!parameter) {
            if (!isFinished(state)) {
                throw new ParseError(`Unexpected '${state.string[state.index]}' when expecting parameter or EOF.`);
            }
            break; // technically a violation of the standard but we'll allow it
        }

        res.push(parameter);
    }

    return res;
}
