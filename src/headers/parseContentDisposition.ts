
import { HeaderParserState, Parameters, processParametersIfPresent, readToken } from './internal.js';

/**
 * TODO: look at filename* in https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition and https://datatracker.ietf.org/doc/html/rfc5987
 */
export interface ContentDisposition {
    type: string;
    parameters: Parameters;
    name: string | undefined;
    filename: string | undefined;
    //filenameStar: string | undefined;
}

export function parseContentDisposition(header: string): ContentDisposition {
    const state: HeaderParserState = {
        index: 0,
        end: header.length,
        string: header
    };

    const type: string = readToken(state);

    const parameters = processParametersIfPresent(state);

    const filenameIndex = parameters.findIndex(x => x.name == 'filename');
    //const filenameStarIndex = parameters.findIndex(x => x.name == 'filename*');
    const nameIndex = parameters.findIndex(x => x.name == 'name');

    return {
        type: type,
        parameters: parameters,
        name: nameIndex >= 0 ? parameters[nameIndex].value.toLowerCase() : undefined,
        filename: filenameIndex >= 0 ? parameters[filenameIndex].value : undefined,
        //filenameStar: filenameStarIndex >= 0 ? parameters[filenameStarIndex].value : undefined
    };
}
