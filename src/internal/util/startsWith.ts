export function startsWith(obj: string, prefix: string) {
    if (prefix.length > obj.length) return false;
    return obj.substring(0, prefix.length) === prefix;
}
