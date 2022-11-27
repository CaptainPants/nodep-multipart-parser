import { Parameter } from '..';
import { ParseError } from '../../errors/index.js';
import { Parameters } from '../types.js';
import { HeaderParserState } from './HeaderParserState';
import { isFinished } from './is';
import { consumeOptionalWhitespace, readOptionalToken, readQuoted, readToken } from './read';

export function writeParameters(parameters: Parameters) {
    const res: string[] = [];

    for (const param of parameters) {
        res.push('; ');
        res.push(param.name);
        res.push('"');
        // TODO: this is totally not kosher
        res.push(encodeURIComponent(param.value));
        res.push('"');
    }

    return res.join('');
}

/**
 * Refer to 'parameter' in https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.1
 */
export function readOneParameter(
    state: HeaderParserState
): Parameter | undefined {
    consumeOptionalWhitespace(state);

    const parameterName = readOptionalToken(state);

    if (!parameterName) {
        if (isFinished(state)) {
            return undefined;
        } else {
            throw new ParseError(
                `Unexpected ${state.string[state.index]}, expecting a token.`
            );
        }
    }

    // technically not allowed, but for tolerance sake
    consumeOptionalWhitespace(state);

    if (isFinished(state) || state.string[state.index] !== "=") {
        throw new ParseError(
            `Unexpected ${state.string[state.index]}, expecting an equals sign.`
        );
    }

    // move past the =
    ++state.index;

    // technically not allowed, but for tolerance sake
    consumeOptionalWhitespace(state);

    if (isFinished(state)) {
        throw new ParseError(
            `Unexpected EOF, expecting a token or quoted-string.`
        );
    }

    let value: string;
    if (state.string[state.index] === '"') {
        value = readQuoted(state);
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

        if (isFinished(state)) {
            break;
        }

        // there should be a ; between parameters
        const semicolon = state.string[state.index];
        if (semicolon !== ";") {
            throw new ParseError(
                `Unexpected '${semicolon}' when expecting a semi-colon ';'.`
            );
        }

        // move past semicolon
        ++state.index;

        // then a parameter
        const parameter = readOneParameter(state);

        if (!parameter) {
            if (!isFinished(state)) {
                throw new ParseError(
                    `Unexpected '${state.string[state.index]
                    }' when expecting parameter or EOF.`
                );
            }
            break; // technically a violation of the standard but we'll allow it
        }

        res.push(parameter);
    }

    return res;
}