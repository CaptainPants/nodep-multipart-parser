
import { expect, test, describe } from '@jest/globals';

import { arrayFind } from './arrayFind.js';

test('arrayFind', () => {
    const data = [1, 2, 3];

    expect(arrayFind(data, x => x === 1)).toEqual(1);
    expect(arrayFind(data, x => x === 4)).toEqual(undefined);
});