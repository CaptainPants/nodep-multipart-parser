import { Parameter } from '../types.js';
import { ParseError } from '../../errors/index.js';
import { Parameters } from '../types.js';
import { HeaderParserState } from './HeaderParserState';
import { readOptionalWhitespace } from './readOptionalWhitespace';
import { readOptionalToken, readToken } from './readToken.js';
import { readQuotedString } from './readQuotedString.js';
import { isQuoteSafe } from './is.js';

// Refer https://datatracker.ietf.org/doc/html/rfc8187#section-3.1
// https://datatracker.ietf.org/doc/html/rfc9110#section-5.6.6 references 8187
//
// Older references:
// - https://datatracker.ietf.org/doc/html/rfc8187 obsoletes 5987
// - https://datatracker.ietf.org/doc/html/rfc5987 adds ext-parameter to 2616
// - https://datatracker.ietf.org/doc/html/rfc2616#section-3.6
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
  * https://datatracker.ietf.org/doc/html/rfc9110#section-5.6.6
  */
export function readOneParameter(
    state: HeaderParserState
): Parameter | undefined {

    // sitting just after the previous parameter
    readOptionalWhitespace(state);

    if (state.isFinished()) {
        return undefined;
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

    readOptionalWhitespace(state);

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

    // No whitespace is allowed
    // https://datatracker.ietf.org/doc/html/rfc9110#section-5.6.6

    if (state.isFinished() || state.current() !== "=") {
        throw new ParseError(
            `Unexpected ${state.current()}, expecting an equals sign.`
        );
    }

    // move past the =
    state.moveNext();

    // No whitespace is allowed
    // https://datatracker.ietf.org/doc/html/rfc9110#section-5.6.6

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