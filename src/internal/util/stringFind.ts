export function stringFind(
    str: string,
    predicate: (char: string, index: number) => boolean
) {
    for (let i = 0; i < str.length; ++i) {
        const current = str[i];
        if (predicate(current, i)) {
            return current;
        }
    }
    return undefined;
}
