import { HttpContent } from "../content/HttpContent.js";

/**
 * How the XHR should provide the response data. XHR supports additional options
 * like JSON, but for cleanliness of the interface (Using Data for the response
 * payload) we're recommending you use 'text' for JSON and use JSON.parse()
 * yourself to get the JSON content.
 */
export type HttpResponseDataType = "text" | "blob" | "arraybuffer";

export interface HttpRequest {
    method: string;
    url: string;

    /**
     * Content including headers to send as part of the request.
     * TODO: implement multipart writing
     */
    content?: HttpContent;

    onUploadProgress?: (evt: ProgressEvent) => void;
    onDownloadProgress?: (evt: ProgressEvent) => void;

    abort?: AbortSignal;

    /**
     * Recommend you use 'text' when you're expecting JSON/XML
     * 'arraybuffer' when you expect multipart content
     * 'blob' when you're downloading a file for the user
     * These recommendations are for performance only as the
     * Data class will allow you to switch between fairly easily.
     */
    responseType?: HttpResponseDataType;

    timeout?: number;

    /*
     * If this callback returns true, then the result is considered
     * a success and the promise will return. If the result from
     * this callback is false, then the promise will reject with
     * an HttpError.
     */
    isValidStatus?: (statusCode: number) => boolean;

    optimizations?: {
        formData: boolean;
    };
}

export interface HttpResponse {
    status: number;
    statusText: string;
    content: HttpContent;
    raw: XMLHttpRequest;
}
