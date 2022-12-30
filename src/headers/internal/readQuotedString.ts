import { ParseError } from "../../errors/index.js";
import { HeaderParserState } from "./HeaderParserState";
import { isQDTEXT } from "./is.js";

/*
 * Read a quoted string. Assumes that the current state is pointing to a double quote.
 * See 'quoted' in https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
 * Syntax:
 *     quoted-string  = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 */
export function readQuotedString(state: HeaderParserState) {
    // We are looking at the opening quote
    const start = state.current();

    if (start != '"') {
        throw new ParseError(`Unexpected ${start}, expected ".`);
    }

    // Move past the quotation mark
    state.moveNext();

    const res: string[] = [];

    for (;;) {
        const current = state.current();

        // End of the quoted-string
        if (current == '"') {
            // move past the end quotation mark
            state.moveNext();
            break;
        }
        // See 'quoted-pair' in https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
        // A double quote is allowed if preceeded by a \
        else if (current == "\\") {
            state.moveNext(); // move past the \
            const escaped = state.current(); // this character is escaped
            if (typeof escaped == "undefined") {
                throw new ParseError("Unexpected EOF after \\.");
            }
            res.push(escaped);
            state.moveNext();
        } else if (isQDTEXT(current)) {
            res.push(current);
            state.moveNext();
        } else {
            // EOF or invalid char
            throw new ParseError(
                `Unexpected ${
                    current === undefined ? "EOF" : current
                } in quoted-string.`
            );
        }
    }

    const merged = res.join("");
    // quoted pairs have a preceeding \, e.g. \"
    // Specifically replace \\ with \ and \" with ", but also anything else preceeded by a \
    return merged.replace(/\\(.)/g, "$1");
}
