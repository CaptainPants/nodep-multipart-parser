import { arrayFindIndex } from'./arrayFindIndex.js';

/**
  * This is primarily used as a replacement for Array.prototype.find as that is not supported in es5 / IE11
  */
export function arrayFind<T>(items: T[], predicate: (element: T, index: number, array: T[]) => boolean) {
    const index = arrayFindIndex(items, predicate);
    return index < items.length ? items[index] : undefined;
}