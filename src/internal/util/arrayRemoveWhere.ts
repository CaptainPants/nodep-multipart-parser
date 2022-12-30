export function arrayRemoveWhere<T>(
    items: T[],
    predicate: (item: T, index: number) => boolean
) {
    for (let i = items.length - 1; i >= 0; --i) {
        if (predicate(items[i], i)) {
            items.splice(i, 1);
        }
    }
    return items;
}
