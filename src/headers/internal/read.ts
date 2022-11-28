
import { ParseError } from "../../errors/ParseError.js";
import { HeaderParserState } from "./HeaderParserState.js";
import { isSPOrVTAB } from "./is.js";

// refer https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.5
// > media-type = type "/" subtype *( OWS ";" OWS parameter )
// > parameter  = token "=" ( token / quoted-string )
// https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.3
// zero or more linear whitespace octets
// > OWS            = ( SP / HTAB )
// https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
// > token          = 1*tchar
// > tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
// >                / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
// >                / DIGIT / ALPHA
// >                ; any VCHAR, except delimiters
// > quoted-string  = DQUOTE *( qdtext / quoted-pair ) DQUOTE
// > qdtext         = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
// > obs-text       = %x80-FF
// > delimiter      => any of "(),/:;<=>?@[\]{}

/**
  * Consume any whitespace at the current index. Does nothing if the end has been reached.
  * OWS            = ( SP / HTAB )
  */
export function consumeOptionalWhitespace(
    state: HeaderParserState,
    allowObsFold = false
): string {

    const parts: string[] = [];

    for (; ;) {
        if (state.isFinished()) {
            break;
        }

        const current = state.current();
        if (isSPOrVTAB(current)) {
            // must have been whitespace, continue
            parts.push(current);
            state.moveNext();
            continue;
        }
        else if (allowObsFold && state.isAtObsFold()) {
            parts.push(' ');
            state.move(3);
            continue;
        }

        break;
    }

    return parts.join('');
}

export function readToNextLine(state: HeaderParserState) {
    const startIndex = state.index();
    let end: number | undefined;

    for (; ;) {
        if (state.isAtCRLF()) {
            end = state.index();
            state.move(2);
            break;
        } else if (state.isFinished()) {
            end = state.index();
            break;
        }

        state.moveNext();
    }

    if (end === undefined) {
        throw new ParseError("Unexpected.");
    }

    return state.string.substring(startIndex, end);
}
