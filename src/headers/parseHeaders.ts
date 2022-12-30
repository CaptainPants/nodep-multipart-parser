import { ParseError } from "../errors/index.js";
import { HeaderParserState } from "./internal/HeaderParserState.js";
import { readFieldContent } from "./internal/readFieldContent.js";
import { readOptionalWhitespace } from "./internal/readOptionalWhitespace.js";
import { readToken } from "./internal/readToken.js";
import { Header } from "./Header.js";

export interface ParseHeadersParameters {
    headerString: string;
}

export interface ParseHeadersResult {
    headers: Header[];
}

/**
 * @summary Parses HTTP headers from a given string.
 *
 * @description
 * See https://datatracker.ietf.org/doc/html/rfc9110#section-5 5.1 and 5.5
 * Also https://datatracker.ietf.org/doc/html/rfc9112#section-2.1
 *
 *    HTTP-message   = start-line CRLF
 *                     *( field-line CRLF )
 *                     CRLF
 *                     [ message-body ]
 *    field-line     = field-name ":" OWS field-value OWS
 *    field-name     = token
 *    field-value    = *field-content
 *    field-content  = field-vchar [ 1*( SP / HTAB / field-vchar ) field-vchar ]
 *    field-vchar    = VCHAR / obs-text
 *    obs-text       = %x80-FF
 */
export function parseHeaders(
    params: ParseHeadersParameters
): ParseHeadersResult {
    const headerString = params.headerString ?? "";

    const state = new HeaderParserState(headerString);

    const headers: Header[] = [];

    for (;;) {
        if (state.isAt("\r\n") || state.isFinished()) {
            break; // This is the end of the header block
        }

        // Header name
        const headerName = readToken(state);

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

        readOptionalWhitespace(state);

        const value = readFieldContent(state);

        readOptionalWhitespace(state);

        if (!state.isAt("\r\n")) {
            throw new ParseError(
                `Expected CRLF, found instead ${state.current()}`
            );
        }

        // Skip the CRLF
        state.move(2);

        // Normalise headers to lower case
        //    "Each header field consists of a case-insensitive field name followed
        //     by a colon (":"), optional leading whitespace, the field value, and
        //     optional trailing whitespace."
        headers.push(new Header(headerName, value));
    }

    return {
        headers: headers,
    };
}
