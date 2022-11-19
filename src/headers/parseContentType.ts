
import { ParseError } from '..';
import { HeaderParserState, readOneParameter, Parameters, processParametersIfPresent } from './internal';

import { isFinished, readToken, consumeOptionalWhitespace, readOptionalToken, readQuoted } from './internal';

export interface ContentType {
    mediaType: string;
    type: string;
    subtype: string;
    parameters: Parameters;
    boundary: string | undefined;
    charset: string | undefined;
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

    const parameters = processParametersIfPresent(state);

    const boundaryIndex = parameters.findIndex(x => x.name == 'boundary');
    const charsetIndex = parameters.findIndex(x => x.name == 'charset');

    return {
        mediaType: type + '/' + subtype,
        type: type,
        subtype: subtype,
        parameters: parameters,
        boundary: boundaryIndex >= 0 ? parameters[boundaryIndex].value : undefined,
        charset: charsetIndex >= 0 ? parameters[charsetIndex].value.toLowerCase() : undefined
    };
}

export const __testing = process.env.NODE_ENV == 'test' ? {
    consumeOptionalWhitespace,
    readToken,
    readOptionalToken,
    readQuoted
} : void 0;