import { ParseError } from "../errors/index.js";
import { HeaderParserState } from "./internal/HeaderParserState.js";
import { processParametersIfPresent } from "./internal/parameters/readParameters.js";
import { readToken } from "./internal/readToken.js";
import { ContentType } from "./types.js";

export function parseContentType(header: string): ContentType {
    const state = new HeaderParserState(header);

    const type: string = readToken(state);
    if (state.isFinished()) {
        throw new ParseError("Unexpected EOF when expecting '/'.");
    }
    if (state.current() != "/") {
        throw new ParseError(
            `Unexpected '${state.current()}' when expecting '/'.`
        );
    }
    state.moveNext();

    const subtype: string = readToken(state);

    const parameters = processParametersIfPresent(state);

    return {
        type: type,
        subtype: subtype,
        parameters: parameters,
    };
}
