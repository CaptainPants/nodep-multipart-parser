# HttpClient

HttpClient is a promise-based wrapper around XMLHttpRequest, using HttpContent to provide a convenient interface to the underlying content whether it be single part/multipart and text/binary.

Using HttpContent with HttpClient:
```typescript
import { HttpClient } from '@captainpants/zerodeps-multipart-parser';

const client = new HttpClient();

const response = await client.request({
    method: 'GET',
    url: 'https://google.com',
    responseType: 'text' // or 'blob' or 'arraybuffer'
});

// now response is either a SingularHttpContaent or MultipartHttpContent, and you can check which with a simple instanceof check

if (response instanceof MultipartHttpResponse) {
    let i = 1;
    for (const part of response.parts) {
        console.log(`Part ${i}: ${await part.data.string()}`);

        ++i;
    }
}
else {
    // otherwise its a SingularHttpResponse
}
```

The request object looks like so:
```typescript
export interface HttpRequest {
    method: string;
    url: string;

    // We plan to implement support for Multipart requests in the future
    content?: SingularHttpContent;

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
    responseType?: 'text' | 'blob' | 'arraybuffer';

    timeout?: number;

    isValidStatus?: (statusCode: number) => boolean;
}
```

And the response:
```typescript
export interface HttpResponse {
    status: number;
    statusText: string;
    content: SingularHttpContent | MultipartHttpContent;
    raw: XMLHttpRequest;
}
```