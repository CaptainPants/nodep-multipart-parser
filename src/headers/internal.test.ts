import { describe, expect, test } from '@jest/globals';

import { isFinished, isAtCRLF, readToNextLine, readToken, consumeOptionalWhitespace, readQuoted, readOneParameter } from './internal';

describe('isFinished', () => {
    test('false 1', () => {
        expect(isFinished({ index: 0, end: 10, string: 'abcdefghijk' })).toEqual(false);
    });
    test('true 1', () => {
        expect(isFinished({ index: 10, end: 10, string: 'abcdefghijk' })).toEqual(true);
    });
    test('true 1', () => {
        expect(isFinished({ index: 11, end: 10, string: 'abcdefghijk' })).toEqual(true);
    });
});

describe('isAtCRLF', () => {
    test('true 1', () => {
        expect(isAtCRLF({ index: 0, end: 2, string: '\r\n' })).toEqual(true);
    });
    test('false 1', () => {
        expect(isAtCRLF({ index: 1, end: 2, string: '\r\n' })).toEqual(false);
    });
    test('false 2', () => {
        expect(isAtCRLF({ index: 0, end: 5, string: 'abcde' })).toEqual(false);
    });
});

describe('readToNextLine', () => {
    test('test 1', () => {
        const input = 'test1 2 3 4\r\nbanana';
        const res = readToNextLine({ index: 0, end: input.length, string: input });
        expect(res).toEqual('test1 2 3 4');
    });
});

describe('readToken', () => {
    test('encoding=utf-8', () => {
        const input = 'encoding=utf-8 ';
        const res = readToken({ index: 0, end: input.length, string: input });
        expect(res).toEqual('encoding');
    });
});

describe('readQuoted', () => {
    test('"hello there \\x1 \\" "', () => {
        const input = '"hello there \\x1 \\" "';
        const res = readQuoted({ index: 0, end: input.length, string: input });
        expect(res).toEqual('hello there x1 " ');
    });
});

describe('consumeOptionalWhitespace', () => {
    test('      =', () => {
        const input = '      =';
        const state = { index: 0, end: input.length, string: input };
        consumeOptionalWhitespace(state);

        expect(state).toEqual({ index: 6, end: 7, string: input });
        expect(state.string[state.index]).toEqual('=');
    });

    test('word', () => {
        const input = 'word';
        const state = { index: 0, end: input.length, string: input };
        consumeOptionalWhitespace(state);

        expect(state).toEqual({ index: 0, end: input.length, string: input });
        expect(state.string[state.index]).toEqual('w');
    });
});


describe('readOneParameter', () => {
    test('encoding=utf-8', () => {
        const input = 'encoding=utf-8 ';
        const parameters: { [key: string]: string } = {};
        const res = readOneParameter({ index: 0, end: input.length, string: input });
        const keys = Object.keys(parameters);

        expect(res).toEqual({ name: "encoding", value: 'utf-8' });
    });
});