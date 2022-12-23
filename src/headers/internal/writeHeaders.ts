import { writeStringToDataView } from "../../internal/util/writeStringToDataView.js";
import { Header } from "../types.js";

export function writeHeaders(headers: Header[], view: DataView, offset: number): number {
    for (const header of headers) {
        offset += writeStringToDataView(header.name, view, offset);
        offset += writeStringToDataView(':', view, offset);
        offset += writeStringToDataView(header.value, view, offset);
        offset += writeStringToDataView('\r\n', view, offset);
    }

    offset += writeStringToDataView('\r\n', view, offset);
    return offset;
}