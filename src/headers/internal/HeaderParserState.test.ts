import { describe, expect, test } from "@jest/globals";

import { HeaderParserState } from './HeaderParserState';

describe("isFinished", () => {
    test("false 1", () => {
        const state = new HeaderParserState("abcdefghijk");
        expect(
            state.isFinished()
        ).toEqual(false);
    });
    test("true 1", () => {
        const state = new HeaderParserState("abcdefghijk");
        state.move(11);
        expect(
            state.isFinished()
        ).toEqual(true);
    });
    test("true 2", () => {
        const state = new HeaderParserState("abcdefghijk");
        state.move(15);
        expect(
            state.isFinished()
        ).toEqual(true);
    });
});

describe("isAtCRLF", () => {
    test("true 1", () => {
        const state = new HeaderParserState("\r\n");
        expect(state.isAtCRLF()).toEqual(true);
    });
    test("false 1", () => {
        const state = new HeaderParserState("\r\n");
        state.move(1);
        expect(state.isAtCRLF()).toEqual(false);
    });
    test("false 2", () => {
        const state = new HeaderParserState("abcde");
        expect(state.isAtCRLF()).toEqual(false);
    });
});
