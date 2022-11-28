import { describe, expect, test } from "@jest/globals";
import { HeaderParserState } from "./HeaderParserState.js";

import { readFieldContent } from './readFieldContent.js';

test('basic', () => {
    const state = new HeaderParserState('this is some content   ');
    const result = readFieldContent(state);
    expect(result).toEqual('this is some content');
});

test('trailing space', () => {
    const state = new HeaderParserState('this is some content   ');
    const result = readFieldContent(state);
    expect(result).toEqual('this is some content');
});

test('throws', () => {
    const state = new HeaderParserState('   this is some content');
    expect(() => readFieldContent(state)).toThrow();
});
