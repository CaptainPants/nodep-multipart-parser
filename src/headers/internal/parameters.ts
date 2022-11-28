import { Parameter } from '../types.js';
import { ParseError } from '../../errors/index.js';
import { Parameters } from '../types.js';
import { HeaderParserState } from './HeaderParserState';
import { consumeOptionalWhitespace } from './read';
import { readOptionalToken, readToken } from './readToken.js';
import { readQuotedString } from './readQuotedString.js';


// qdtext         = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
// obs-text       = %x80-FF
const quoteSafeRegex = /^[\t \x21\x23-\x5B\x5D-\x7E\x80-\xFF]$/;

export function isQuoteSafe(char: string) {
    if (char.length != 1) throw new Error(`Expected a single character, found instead ${char}`);

    // qdtext         = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
    // obs-text       = %x80-FF
    return char.match(quoteSafeRegex) !== null;
}

/**
 * Refer to 'parameter' in https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.1
 * TODO: add support for extended parameters https://datatracker.ietf.org/doc/html/rfc5987
 */
export function writeParameters(parameters: Parameters) {
    const res: string[] = [];

    for (const param of parameters) {
        if (param.name.length < 1) {
            throw new Error('Expected header name to have at least once character.');
        }

        const lastLetter = param.name[param.name.length - 1];
        const isExtended = lastLetter == '*';
        if (isExtended) {
            // TODO: support extended parameters
            throw new Error('Extended parameters are not yet supported');
        }

        res.push('; ');
        res.push(param.name);
        res.push('"');
        // Definition of quoted-string here https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
        for (let i = 0; i < param.value.length; ++i) {
            const char = param.value[i];

            if (!isQuoteSafe(char)) {
                res.push('\\');
            }
            res.push(char);
        }
        res.push('"');
    }

    return res.join('');
}

/**
 * Refer to 'parameter' in https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.1
 * TODO: add support for extended parameters https://datatracker.ietf.org/doc/html/rfc5987
 */
export function readOneParameter(
    state: HeaderParserState
): Parameter | undefined {
    consumeOptionalWhitespace(state);

    const parameterName = readOptionalToken(state);

    if (!parameterName) {
        if (state.isFinished()) {
            return undefined;
        } else {
            throw new ParseError(
                `Unexpected ${state.current()}, expecting a token.`
            );
        }
    }

    const lastChar = parameterName[parameterName.length - 1];
    if (lastChar == '*') {
        throw new ParseError("Unexpected extended parameter, this is not currently supported.");
    }

    // technically not allowed, but for tolerance sake
    consumeOptionalWhitespace(state);

    if (state.isFinished() || state.current() !== "=") {
        throw new ParseError(
            `Unexpected ${state.current()}, expecting an equals sign.`
        );
    }

    // move past the =
    state.moveNext();

    // technically not allowed, but for tolerance sake
    consumeOptionalWhitespace(state);

    if (state.isFinished()) {
        throw new ParseError(
            `Unexpected EOF, expecting a token or quoted-string.`
        );
    }

    let value: string;
    if (state.current() === '"') {
        value = readQuotedString(state);
    } else {
        value = readToken(state);
    }

    return { name: parameterName, value: value };
}

/**
 * TODO: currently does not support * parameters https://datatracker.ietf.org/doc/html/rfc5987
 * @param state
 * @returns
 */
export function processParametersIfPresent(
    state: HeaderParserState
): Parameters {
    const res: Parameters = [];

    for (; ;) {
        // sitting just after the previous parameter
        consumeOptionalWhitespace(state);

        if (state.isFinished()) {
            break;
        }

        // there should be a ; between parameters
        const semicolon = state.current();
        if (semicolon !== ";") {
            throw new ParseError(
                `Unexpected '${semicolon}' when expecting a semi-colon ';'.`
            );
        }

        // move past semicolon
        state.moveNext();

        // then a parameter
        const parameter = readOneParameter(state);

        if (!parameter) {
            if (!state.isFinished()) {
                throw new ParseError(
                    `Unexpected '${state.current()
                    }' when expecting parameter or EOF.`
                );
            }
            break; // technically a violation of the standard but we'll allow it
        }

        res.push(parameter);
    }

    return res;
}