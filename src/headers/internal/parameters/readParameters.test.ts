import { describe, expect, test } from "@jest/globals";
import { HeaderParserState } from "../HeaderParserState.js";
import { readOneParameter } from './readParameters.js';

describe("readOneParameter", () => {
    test("encoding=utf-8", () => {
        const input = ";encoding=utf-8 ";
        const state = new HeaderParserState(input);
        const res = readOneParameter(state);

        expect(res).toEqual({ name: "encoding", value: "utf-8" });
    });

    test("boundary=\"ham sandwich\\\" test\"", () => {
        const input = ";boundary=\"ham sandwich\\\" test\"";
        const state = new HeaderParserState(input);
        const res = readOneParameter(state);

        expect(res).toEqual({ name: "boundary", value: "ham sandwich\" test" });
    });
});