
import { expect, test, describe } from '@jest/globals';

import { AbortControllerPolyfill, Array$find } from './polyfills.js';

test('AbortControllerPolyfill', () => {
    const controller = new AbortControllerPolyfill();

    expect(controller.signal.aborted).toBe(false);

    controller.signal.throwIfAborted();

    controller.abort();

    expect(controller.signal.aborted).toBe(true);

    expect(() => {
        controller.signal.throwIfAborted();
    }).toThrowError(new DOMException('Aborted', 'AbortError'));
});

test('Array$find', () => {
    const data = [1, 2, 3];

    expect(Array$find.call(data, x => x === 1)).toEqual(1);
    expect(Array$find.call(data, x => x === 4)).toEqual(undefined);
});