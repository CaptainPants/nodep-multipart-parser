
import { HeaderParserState } from "./internal/HeaderParserState.js";
import { processParametersIfPresent } from "./internal/parameters.js";
import { readToken } from "./internal/read.js";
import { ContentDisposition } from "./types.js";

export function parseContentDisposition(header: string): ContentDisposition {
    const state: HeaderParserState = {
        index: 0,
        end: header.length,
        string: header,
    };

    const type: string = readToken(state);

    const parameters = processParametersIfPresent(state);

    return {
        type: type,
        parameters: parameters,
    };
}
