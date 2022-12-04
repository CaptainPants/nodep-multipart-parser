import { describe, expect, test } from "@jest/globals";

import { writeExtendedValue } from './writeExtendedValue.js';

describe('writeExtendedValue', () => {
    test('test', async () => {
        expect(await writeExtendedValue('test')).toEqual('test');
        expect(await writeExtendedValue('£ rates')).toEqual('%C2%A3%20rates');
        expect(await writeExtendedValue('£ and € rates')).toEqual('%C2%A3%20and%20%E2%82%AC%20rates');
    });
});