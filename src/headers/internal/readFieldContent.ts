import { ParseError } from "../../errors/ParseError.js";
import { HeaderParserState } from "./HeaderParserState.js";
import { isFieldVCHAR, isSPOrVTAB } from "./is.js";

export function readFieldContent(state: HeaderParserState): string {

    const startIndex = state.index();

    const first = state.current();

    // Must start with a field-char
    if (typeof first !== 'undefined' && !isFieldVCHAR(first)) {
        throw new ParseError(`Expected a field-vchar, found instead ${first}.`);
    }

    const parts: string[] = [];

    // Characters except first and last are field-char | SP | VTAB
    for (; ;) {
        const current = state.current();

        if (typeof current === 'undefined') { // EOF
            break;
        }
        else if (!isFieldVCHAR(current) && !isSPOrVTAB(current)) {
            break;
        }

        parts.push(current);
        state.moveNext();
    }

    let asString = parts.join('');

    // Roll back trailing whitespaces (SP | VTAB)
    // TODO: this is not necessarily super fast
    while (asString.length > 0 && isSPOrVTAB(asString[asString.length - 1])) {
        asString = asString.substring(0, asString.length - 1);
    }

    state.set(startIndex + asString.length);

    return asString;
}