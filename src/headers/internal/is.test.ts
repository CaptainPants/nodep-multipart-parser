import { describe, expect, test } from "@jest/globals";

import { isSPOrVTAB } from './is.js';

describe('isSPOrVTAB', () => {
    test('positive', () => {
        [' ', '\t'].forEach(item => {
            expect(isSPOrVTAB(item)).toEqual(true);
        });
    });
    test('negative', () => {
        ['A', '.', '(', '9'].forEach(item => {
            expect(isSPOrVTAB(item)).toEqual(false);
        });
    });
});

test.todo('isObsText');