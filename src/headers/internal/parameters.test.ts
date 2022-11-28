import { describe, expect, test } from "@jest/globals";
import { HeaderParserState } from "./HeaderParserState.js";

import { encodeExtendedValue, readOneParameter, writeOneParameter } from './parameters.js';
import { Parameter } from '../types.js';

describe("readOneParameter", () => {
    test("encoding=utf-8", () => {
        const input = ";encoding=utf-8 ";
        const parameters: { [key: string]: string } = {};
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


describe("writeOneParameter", () => {
    test('; filename="test.txt"', () => {
        const param: Parameter = { name: 'filename', value: 'test.txt' };

        const res = writeOneParameter(param);

        expect(res).toEqual('; filename="test.txt"')
    });

    test("; filename*=utf-8'en'test.txt", () => {
        const param: Parameter = { name: 'filename*', value: '£20.txt', language: "en" };

        const res = writeOneParameter(param);

        expect(res).toEqual("; filename*=utf-8'en'%C2%A320.txt")
    });
});

describe('encodeExtendedValue', () => {
    test('test', () => {
        expect(encodeExtendedValue('test')).toEqual('test');
        expect(encodeExtendedValue('£ rates')).toEqual('%C2%A3%20rates');
        expect(encodeExtendedValue('£ and € rates')).toEqual('%C2%A3%20and%20%E2%82%AC%20rates');
    });
});