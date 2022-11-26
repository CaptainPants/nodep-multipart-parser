import { ErrorBase } from "../errors/index.js";
import { HttpResponse } from "./types.js";

export class HttpError extends ErrorBase {
    constructor(httpResponse: HttpResponse) {
        super(`$Status ${httpResponse.status}: ${httpResponse.statusText}`);
        this.httpResponse = httpResponse;
    }

    public readonly httpResponse: HttpResponse;
}
