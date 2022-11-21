import { describe, test, expect } from "@jest/globals";

import { Data } from './Data.js';

describe('string to binary and back', () => {
    test('test1', async () => {
        const inputs = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

        for (const input of inputs) {
            const start = await new Data(input, undefined).arrayBuffer();
            const returned = await new Data(start.value, start.encoding).string();
            expect(input).toEqual(returned);
        }
    });
});