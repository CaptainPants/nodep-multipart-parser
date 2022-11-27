
export function isAbortError(err: unknown): err is DOMException {
    return err instanceof DOMException && err.code === DOMException.ABORT_ERR;
}