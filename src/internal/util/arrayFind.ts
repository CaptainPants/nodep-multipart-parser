
/**
  * This is primarily used as a replacement for Array.prototype.find as that is not supported in es5 / IE11
  */
export function arrayFind<T>(self: T[], predicate: (element: T, index: number, array: T[]) => boolean) {
    for (let i = 0; i < self.length; ++i) {
        if (predicate(self[i], i, self)) {
            return self[i];
        }
    }

    return undefined;
}