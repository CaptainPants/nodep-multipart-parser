import { describe, expect, test } from "@jest/globals";

import { HeaderParserState } from "./HeaderParserState.js";

import { readQuotedString } from './readQuotedString.js';

describe("readQuoted", () => {
    test('"hello there \\x1 \\" "', () => {
        const input = '"hello there \\x1 \\" "';
        const state = new HeaderParserState(input);
        const res = readQuotedString(state);
        expect(res).toEqual('hello there x1 " ');
    });
});