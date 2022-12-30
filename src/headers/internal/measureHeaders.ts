import { Header } from "../Header.js";

export function measureHeaders(headers: Header[]) {
    let count = 0;

    for (const header of headers) {
        // name + : + SP + value + CR LF
        count += header.name.length + 2 + header.value.length + 2;
    }

    // Add the CR LF at the end
    return count + 2;
}
