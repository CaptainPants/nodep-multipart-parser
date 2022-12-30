import { describe, expect, test } from "@jest/globals";
import { Parameter } from "../../Parameter.js";
import { HeaderParserState } from "../HeaderParserState.js";
import { readOneParameter } from "./readParameters.js";

describe("readOneParameter", () => {
    test("encoding=utf-8", () => {
        const input = ";encoding=utf-8 ";
        const state = new HeaderParserState(input);
        const res = readOneParameter(state);

        expect(res).toEqual(new Parameter("encoding", "utf-8"));
    });

    test('boundary="ham sandwich\\" test"', () => {
        const input = ';boundary="ham sandwich\\" test"';
        const state = new HeaderParserState(input);
        const res = readOneParameter(state);

        expect(res).toEqual(new Parameter("boundary", 'ham sandwich" test'));
    });

    test("; filename*=utf-8'en'£20.txt", () => {
        const expected = new Parameter("filename*", "£20.txt", "en", "utf-8");

        const res = readOneParameter(
            new HeaderParserState("; filename*=utf-8'en'£20.txt")
        );

        expect(res).toEqual(expected);
    });
});
