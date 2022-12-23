import { describe, expect, test } from "@jest/globals";

import { HeaderParserState } from "./HeaderParserState.js";
import { readToken } from "./readToken.js";

describe("readToken", () => {
    test("encoding=utf-8", () => {
        const input = "encoding=utf-8 ";
        const state = new HeaderParserState(input);
        const res = readToken(state);
        expect(res).toEqual("encoding");
    });
});
