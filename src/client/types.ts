import {
    SingularHttpContent,
    MultipartHttpContent,
} from "../content/HttpContent.js";

/**
  * How the XHR should provide the response data. XHR supports additional options
  * like JSON, but for cleanliness of the interface (Using Data for the response 
  * payload) we're recommending you use 'text' for JSON and use JSON.parse() 
  * yourself to get the JSON content. 
  */
export type HttpResponseDataType = 'text' | 'blob' | 'arraybuffer';

export interface HttpRequest {
    method: string;
    url: string;

    /**
      * TODO: implement multipart writing
      */
    content: SingularHttpContent;

    onUploadProgress?: (evt: ProgressEvent) => void;
    onDownloadProgress?: (evt: ProgressEvent) => void;

    abort?: AbortSignal;

    responseType: HttpResponseDataType;

    timeout?: number;

    isValidStatus?: (statusCode: number) => boolean;
}

export interface HttpResponse {
    status: number;
    statusText: string;
    content: SingularHttpContent | MultipartHttpContent;
    raw: XMLHttpRequest;
}
