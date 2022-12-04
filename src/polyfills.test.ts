
import { expect, test, describe } from '@jest/globals';

import { AbortControllerPolyfill } from './polyfills.js';

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
