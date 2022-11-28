import { ParseError } from "../errors/index.js";
import { HeaderParserState } from "./internal/HeaderParserState.js";
import { isSPOrVTAB } from "./internal/is.js";
import { consumeOptionalWhitespace, readToNextLine } from "./internal/read.js";
import { readOptionalToken } from "./internal/readToken.js";

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
 * @summary Parses HTTP headers from a given string.
 *
 * @description
 * Refer https://datatracker.ietf.org/doc/html/rfc7230#section-3.2
 * TODO: this isn't actually validating that values are ok
 *
 * Syntax:
 *
 *     header-field   = field-name ":" OWS field-value OWS
 *     field-name     = token
 *     field-value    = *( field-content / obs-fold )
 *     field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 *     field-vchar    = VCHAR / obs-text
 *     obs-fold       = CRLF 1*( SP / HTAB )
 *                    ; obsolete line folding
 *                    ; see Section 3.2.4 (https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.4)
 */
export function parseHeaders(
    params: ParseHeadersParameters
): ParseHeadersResult {
    const headerString = params.headerString ?? "";

    const state = new HeaderParserState(headerString);

    const headers: Header[] = [];

    for (;;) {
        // Header name
        const headerName = readOptionalToken(state);

        if (!headerName) {
            break;
        }

        // Followed by a mandatory colon
        if (state.isFinished()) {
            throw new ParseError(`Expected :, found instead EOF.`);
        }

        const colon = state.current();
        if (colon != ":") {
            throw new ParseError(`Expected :, found instead '${colon}'.`);
        }

        // move past the :
        state.moveNext();

        consumeOptionalWhitespace(state);

        let value = "";

        if (!state.isFinished()) {
            value += readToNextLine(state);

            // Handle obs-fold (Obsolete field format that has a CRLF followed by a space)
            while (!state.isFinished() && isSPOrVTAB(state.current())) {
                // replace obs-fold newline with a single space per
                // https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.4
                value += " ";

                value += readToNextLine(state);
            }
        }

        // Normalise headers to lower case
        //    "Each header field consists of a case-insensitive field name followed
        //     by a colon (":"), optional leading whitespace, the field value, and
        //     optional trailing whitespace."
        headers.push({ name: headerName.toLowerCase(), value: value });
    }

    return {
        headers: headers,
    };
}
