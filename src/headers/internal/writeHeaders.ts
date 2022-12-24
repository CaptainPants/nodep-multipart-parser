import { writeStringToDataView } from "../../internal/util/writeStringToDataView.js";
import { Header } from "../types.js";

export function writeHeaders(headers: Header[], view: DataView, offset: number): number {
    const start = offset;

    for (const header of headers) {
        const headerString = header.name + ':' + header.value + '\r\n';
        offset += writeStringToDataView(headerString, view, offset);
    }

    offset += writeStringToDataView('\r\n', view, offset);

    return offset - start;
}