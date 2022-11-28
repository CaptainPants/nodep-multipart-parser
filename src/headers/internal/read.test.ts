import { describe, expect, test } from "@jest/globals";
import { HeaderParserState } from "./HeaderParserState.js";

import { consumeOptionalWhitespace, readToNextLine } from "./read.js";

describe("readToNextLine", () => {
    test("test 1", () => {
        const input = "test1 2 3 4\r\nbanana";
        const state = new HeaderParserState(input);
        const res = readToNextLine(state);
        expect(res).toEqual("test1 2 3 4");
    });
});

describe("consumeOptionalWhitespace", () => {
    test("      =", () => {
        const input = "      =";
        const state = new HeaderParserState(input);
        consumeOptionalWhitespace(state);

        expect(state.toObject()).toEqual({ index: 6, end: 7, string: input });
        expect(state.current()).toEqual("=");
    });

    test("word", () => {
        const input = "word";
        const state = new HeaderParserState(input);
        consumeOptionalWhitespace(state);

        expect(state.toObject()).toEqual({ index: 0, end: input.length, string: input });
        expect(state.current()).toEqual("w");
    });
});

