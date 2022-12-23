
import { Header } from "../types.js";

export function measureHeaders(headers: Header[]) {
    let count = 0;

    for (const header of headers) {
        // name + : + value + CR LF
        count += header.name.length + 1 + header.value.length + 2;
    }

    // Add the CR LF at the end
    return count + 2;
}