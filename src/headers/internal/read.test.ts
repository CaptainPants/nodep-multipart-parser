import { describe, expect, test } from "@jest/globals";

import { consumeOptionalWhitespace, readQuoted, readToken, readToNextLine } from "./read.js";

describe("readToNextLine", () => {
    test("test 1", () => {
        const input = "test1 2 3 4\r\nbanana";
        const res = readToNextLine({
            index: 0,
            end: input.length,
            string: input,
        });
        expect(res).toEqual("test1 2 3 4");
    });
});

describe("readToken", () => {
    test("encoding=utf-8", () => {
        const input = "encoding=utf-8 ";
        const res = readToken({ index: 0, end: input.length, string: input });
        expect(res).toEqual("encoding");
    });
});

describe("readQuoted", () => {
    test('"hello there \\x1 \\" "', () => {
        const input = '"hello there \\x1 \\" "';
        const res = readQuoted({ index: 0, end: input.length, string: input });
        expect(res).toEqual('hello there x1 " ');
    });
});

describe("consumeOptionalWhitespace", () => {
    test("      =", () => {
        const input = "      =";
        const state = { index: 0, end: input.length, string: input };
        consumeOptionalWhitespace(state);

        expect(state).toEqual({ index: 6, end: 7, string: input });
        expect(state.string[state.index]).toEqual("=");
    });

    test("word", () => {
        const input = "word";
        const state = { index: 0, end: input.length, string: input };
        consumeOptionalWhitespace(state);

        expect(state).toEqual({ index: 0, end: input.length, string: input });
        expect(state.string[state.index]).toEqual("w");
    });
});

