import { describe, expect, test } from "@jest/globals";

import { percentEncodeCharactersUsingTextEncoder, slowCompatiblePercentEncodeCharactersBlobConstructor, writeExtendedValue } from './writeExtendedValue.js';

describe('writeExtendedValue', () => {
    test('test', async () => {
        expect(await writeExtendedValue('test')).toEqual('test');
        expect(await writeExtendedValue('£ rates')).toEqual('%C2%A3%20rates');
        expect(await writeExtendedValue('£ and € rates')).toEqual('%C2%A3%20and%20%E2%82%AC%20rates');
    });
});

describe('percentEncodeCharacters', () => {
    const inputs = [
        ['test', '%74%65%73%74'],
        ['£ rates', '%C2%A3%20%72%61%74%65%73'],
        ['£ and € rates', '%C2%A3%20%61%6E%64%20%E2%82%AC%20%72%61%74%65%73'],
        // Just want to make sure we fill past the 30 character buffer, and so check that the looping logic is actually working
        ['£, €, abcdefghijk, abcdefghijk, xyz', '%C2%A3%2C%20%E2%82%AC%2C%20%61%62%63%64%65%66%67%68%69%6A%6B%2C%20%61%62%63%64%65%66%67%68%69%6A%6B%2C%20%78%79%7A']
    ];

    test.each(inputs)('percentEncodeCharactersUsingTextEncoder', (input, expected) => {
        const actual = percentEncodeCharactersUsingTextEncoder(input);

        expect(actual).toStrictEqual(expected);

        const decoded = decodeURIComponent(actual);

        expect(decoded).toStrictEqual(input);
    });

    test.each(inputs)('slowCompatiblePercentEncodeCharactersBlobConstructor', async (input, expected) => {
        const actual = await slowCompatiblePercentEncodeCharactersBlobConstructor(input);

        expect(actual).toStrictEqual(expected);

        const decoded = decodeURIComponent(actual);

        expect(decoded).toStrictEqual(input);
    });
});