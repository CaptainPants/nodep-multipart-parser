
export function arrayFindIndex<T>(items: T[], predicate: (item: T, index: number, items: T[]) => boolean) {
    for (let i = 0; i < items.length; ++i) {
        if (predicate(items[i], i, items)) {
            return i;
        }
    }

    return -1;
}