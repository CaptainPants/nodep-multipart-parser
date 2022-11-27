import { ParseError } from "../errors/index.js";
import { HeaderParserState } from "./internal/HeaderParserState.js";
import { isFinished, isSpace } from "./internal/is.js";
import { consumeOptionalWhitespace, readOptionalToken, readToNextLine } from "./internal/read.js";

export interface ParseHeadersParameters {
    headerString: string;
}

export interface ParseHeadersResult {
    headers: Header[];
}

export interface Header {
    name: string;
    value: string;
}

/**
 * Refer https://datatracker.ietf.org/doc/html/rfc7230#section-3.2
 */
export function parseHeaders(
    params: ParseHeadersParameters
): ParseHeadersResult {
    const headerString = params.headerString ?? "";

    const state: HeaderParserState = {
        index: 0,
        end: headerString.length,
        string: headerString,
    };

    const headers: Header[] = [];

    for (; ;) {
        const headerName = readOptionalToken(state);

        if (!headerName) {
            break;
        }

        if (isFinished(state)) {
            throw new ParseError(`Expected :, found instead EOF.`);
        }

        const colon = state.string[state.index];
        if (colon != ":") {
            throw new ParseError(`Expected :, found instead '${colon}'.`);
        }

        // move past the :
        state.index += 1;

        consumeOptionalWhitespace(state);

        let value = "";

        if (!isFinished(state)) {
            value += readToNextLine(state);

            // handle obs-fold
            while (!isFinished(state) && isSpace(state.string[state.index])) {
                // replace obs-fold newline with a single space per
                // https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.4
                value += " ";

                value += readToNextLine(state);
            }
        }

        headers.push({ name: headerName.toLowerCase(), value: value });
    }

    return {
        headers: headers,
    };
}
