import { describe, expect, test } from "@jest/globals";
import { HeaderParserState } from "./HeaderParserState.js";

import { readOptionalWhitespace } from "./readOptionalWhitespace.js";

describe("readOptionalWhitespace", () => {
    test("      =", () => {
        const input = "      =";
        const state = new HeaderParserState(input);
        readOptionalWhitespace(state);

        expect(state.toObject()).toEqual({ index: 6, end: 7, string: input });
        expect(state.current()).toEqual("=");
    });

    test("word", () => {
        const input = "word";
        const state = new HeaderParserState(input);
        readOptionalWhitespace(state);

        expect(state.toObject()).toEqual({
            index: 0,
            end: input.length,
            string: input,
        });
        expect(state.current()).toEqual("w");
    });
});
