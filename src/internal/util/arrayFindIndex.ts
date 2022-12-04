
export function findIndex<T>(items: T[], predicate: (item: T) => boolean) {
    for (let i = 0; i < items.length; ++i) {
        if (predicate(items[i])) {
            return i;
        }
    }

    return -1;
}