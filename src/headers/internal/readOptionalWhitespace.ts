import { HeaderParserState } from "./HeaderParserState.js";
import { isSPOrVTAB } from "./is.js";
/**
 * Consume any whitespace at the current index. Does nothing if the end has been reached.
 * OWS            = ( SP / HTAB )
 */
export function readOptionalWhitespace(state: HeaderParserState): string {
    const parts: string[] = [];

    for (;;) {
        if (state.isFinished()) {
            break;
        }

        const current = state.current();

        if (typeof current === "undefined") {
            break;
        }
        if (isSPOrVTAB(current)) {
            // must have been whitespace, continue
            parts.push(current);
            state.moveNext();
            continue;
        }

        break;
    }

    return parts.join("");
}
