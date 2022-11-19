import { describe, expect, test } from '@jest/globals';
import { ParseError } from '..';

import { parseContentType, __testing } from './parseContentType';

describe('getContentTypeParts', () => {
    test('image/png', () => {
        const res = parseContentType('image/png');
        expect(res.mediaType).toEqual('image/png');
        expect(res.type).toEqual('image');
        expect(res.subtype).toEqual('png');
        expect(Object.keys(res.parameters).length === 0);
    });

    test('image', () => {
        expect(() => parseContentType('image')).toThrow(ParseError);
    });

    test('text/json; encoding=utf-8', () => {
        const res = parseContentType('text/json; encoding=utf-8');

        expect(res.mediaType).toEqual('text/json');
        expect(res.parameters).toEqual([{ name: "encoding", value: "utf-8" }]);
    });

    test('text/json; encoding=utf-8 ; boundary="ham sandwich \\"1\\" 1234 "', () => {
        const res = parseContentType('text/json; encoding=utf-8 ; boundary="ham sandwich \\"1\\" 1234 "');

        expect(res.mediaType).toEqual('text/json');
        expect(res.parameters).toEqual([
            { name: "encoding", value: "utf-8" },
            { name: "boundary", value: "ham sandwich \"1\" 1234 " }
        ]);
    });

    test('text/json; encoding="utf-8"', () => {
        const res = parseContentType('text/json; encoding="utf-8"');

        expect(res.mediaType).toEqual('text/json');
        expect(res.parameters).toEqual([{ name: "encoding", value: "utf-8" }]);
    });
});

describe('readOneParameter', () => {
    test('encoding=utf-8', () => {
        const input = 'encoding=utf-8 ';
        const parameters: { [key: string]: string } = {};
        const res = __testing!.readOneParameter({ index: 0, end: input.length, string: input });
        const keys = Object.keys(parameters);

        expect(res).toEqual({ name: "encoding", value: 'utf-8' });
    });
});
