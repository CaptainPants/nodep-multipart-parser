
import { ParseError } from '..';
import { HeaderParserState } from './internal';

import { isFinished, readToken, consumeOptionalWhitespace, readOptionalToken, readQuoted } from './internal';

export type Parameters = { name: string; value: string }[];

export interface ContentType {
    mimeType: string,
    type: string,
    subtype: string,
    parameters: Parameters
}

export function parseContentType(header: string): ContentType {
    const state: HeaderParserState = {
        index: 0,
        end: header.length,
        string: header
    };

    const type: string = readToken(state);
    if (isFinished(state)) {
        throw new ParseError("Unexpected EOF when expecting '/'.");
    }
    if (state.string[state.index] != '/') {
        throw new ParseError(`Unexpected '${state.string[state.index]}' when expecting '/'.`);
    }
    ++state.index;
    const subtype: string = readToken(state);

    const parameters = processParameters(state);

    return {
        mimeType: type + '/' + subtype,
        type: type,
        subtype: subtype,
        parameters: parameters
    };
}

function processParameters(state: HeaderParserState): Parameters {
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

/**
  * Refer to 'parameter' in https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.1
  */
function readOneParameter(state: HeaderParserState): { name: string, value: string } | undefined {
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

export const __testing = process.env.NODE_ENV == 'test' ? {
    consumeOptionalWhitespace,
    readToken,
    readOptionalToken,
    readQuoted,
    readOneParameter
} : void 0;