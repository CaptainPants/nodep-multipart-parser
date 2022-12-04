import { findIndex } from "./arrayFindIndex.js";


export function arrayRemoveWhere<T>(items: T[], predicate: (item: T) => boolean) {
    let index = findIndex(items, predicate);

    while (index >= 0) {
        items.splice(index, 1);
        index = findIndex(items, predicate);
    }
}