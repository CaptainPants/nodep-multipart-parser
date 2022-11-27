import { describe, expect, test } from "@jest/globals";

import { isAtCRLF, isFinished } from './is.js';

describe("isFinished", () => {
    test("false 1", () => {
        expect(
            isFinished({ index: 0, end: 10, string: "abcdefghijk" })
        ).toEqual(false);
    });
    test("true 1", () => {
        expect(
            isFinished({ index: 10, end: 10, string: "abcdefghijk" })
        ).toEqual(true);
    });
    test("true 1", () => {
        expect(
            isFinished({ index: 11, end: 10, string: "abcdefghijk" })
        ).toEqual(true);
    });
});

describe("isAtCRLF", () => {
    test("true 1", () => {
        expect(isAtCRLF({ index: 0, end: 2, string: "\r\n" })).toEqual(true);
    });
    test("false 1", () => {
        expect(isAtCRLF({ index: 1, end: 2, string: "\r\n" })).toEqual(false);
    });
    test("false 2", () => {
        expect(isAtCRLF({ index: 0, end: 5, string: "abcde" })).toEqual(false);
    });
});
