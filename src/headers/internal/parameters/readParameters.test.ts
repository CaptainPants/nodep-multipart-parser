import { describe, expect, test } from "@jest/globals";
import { Parameter } from "../../types.js";
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

    test("; filename*=utf-8'en'£20.txt", () => {
        const expected: Parameter = {
            name: 'filename*',
            value: '£20.txt',
            charset: 'utf-8',
            language: 'en'
        };

        const res = readOneParameter(new HeaderParserState("; filename*=utf-8'en'£20.txt"));

        expect(res).toEqual(expected);
    });
});