import { describe, test, expect } from "@jest/globals";

import { Data } from './Data.js';

describe('string to binary and back', () => {
    test('test1', async () => {
        const inputs = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

        //This was returning a zero length blob
        //console.log(new Blob([new DataView(new ArrayBuffer(10))]));
        //vs this working as expected
        //console.log(new Blob([new Uint8Array(new ArrayBuffer(10))]));

        for (const input of inputs) {
            const a = await new Data(input, undefined).arrayBuffer();
            const b = await new Data(a.value, a.encoding).dataView();
            const c = await new Data(b.value, b.encoding).blob();
            // Note that c was coming out as an empty blob so have had to add a step to switch from DataView to TypedArray on the way through
            const returned = await new Data(c.value, c.encoding).string();
            expect(input).toEqual(returned);
        }
    });
});