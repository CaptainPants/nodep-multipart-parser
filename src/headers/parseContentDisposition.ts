import { HeaderParserState } from "./internal/HeaderParserState.js";
import { processParametersIfPresent } from "./internal/parameters.js";
import { readToken } from "./internal/readToken.js";
import { ContentDisposition } from "./types.js";

export function parseContentDisposition(header: string): ContentDisposition {
    const state = new HeaderParserState(header);

    const type: string = readToken(state);

    const parameters = processParametersIfPresent(state);

    return {
        type: type,
        parameters: parameters,
    };
}
