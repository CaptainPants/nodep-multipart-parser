import { describe, expect, test } from "@jest/globals";
import { asciiToDataViewForTesting, chars, findBoundaryOffsets, getCharCodesForString, matchBoundary } from ".";

describe('findBoundaryOffsets', () => {
    test('test1', () => {
        const boundary = '9051914041544843365972754266';

        const dataview = asciiToDataViewForTesting(`
--9051914041544843365972754266
Content-Disposition: form-data; name="file1"; filename="a.html"

test1
--9051914041544843365972754266
Content-Disposition: form-data; name="file2"; filename="b.html"

test2
--9051914041544843365972754266--`); // string literals use \n

        const result = findBoundaryOffsets(getCharCodesForString(boundary), dataview);

        expect(result).toEqual([
            { start: 0, end: 34, length: 34, isLast: false },
            { start: 106, end: 140, length: 34, isLast: false },
            { start: 212, end: 246, length: 34, isLast: true }
        ]);
    });
});

describe('getCharCodes', () => {
    test('abcdefg', () => {
        const codes = getCharCodesForString('abcdefg');
        expect(codes).toEqual([97, 98, 99, 100, 101, 102, 103]);
    });
});

describe('matchBoundary', () => {
    test('\\r\\n--a\\r\\n--aabcdefg', () => {
        // aabcdefg
        const bytes = [
            chars.cr,
            chars.lf,
            chars.hyphen,
            chars.hyphen,
            97, // a
            chars.cr,
            chars.lf,
            chars.hyphen,
            chars.hyphen,
            97, // b
            98, // c
            99, // d
            100, // e
            101, // f
            102, // g
            103, // h
            chars.cr,
            chars.lf
        ];

        const buffer = new ArrayBuffer(bytes.length);
        const uint8 = new Uint8Array(buffer);
        uint8.set(bytes, 0);

        const boundary = getCharCodesForString('abcdefg');

        const data = new DataView(buffer);
        const res1 = matchBoundary(boundary, data, 0);
        expect(res1).toEqual(undefined);

        const res2 = matchBoundary(boundary, data, 5);
        expect(res2).toEqual({ start: 5, end: 18, length: 13, isLast: false });
    });
});