# HttpClient

HttpClient is a promise-based wrapper around XMLHttpRequest, using HttpContent to provide a convenient interface to the underlying content whether it be single part/multipart and text/binary.

Using HttpContent with HttpClient:
```typescript
import { HttpClient, isMultipartContent, MultipartHttpResponse, MultipartBuilder } from '@captainpants/zerodeps-multipart-parser';

const builder = new MultipartBuilder();
builder.add({ 
    data: 'The quick brown fox jumped over the lazy dog.',
    name: 'test1',
    filename: 'test1.txt'
});
builder.add({ 
    data: 'Another example file.',
    name: 'test2',
    filename: 'test2.txt'
});

const client = new HttpClient();

const response = await client.request({
    method: 'POST',
    url: 'https://test.com',
    responseType: 'arraybuffer', // 'text' or 'blob' or 'arraybuffer'
    content: await builder.build()
});

// now response is either a SingularHttpContent or MultipartHttpContent, and you can check which with a simple instanceof check, or check for the presence of the 'parts' property

if (isMultipartContent(response)) { // or response instanceof MultipartHttpResponse
    let i = 1;
    for (const { data } of response.parts) {
        console.log(`Part ${i}: ${await data.string()}`);

        ++i;
    }

    // alternatively 
    for (const { name, filename, data } of response.entries()) {
        // The entries method is modelled on the structure of FormData.prototype.entries()
    }
}
else {
    // otherwise its a SingularHttpContent
}
```

The request object looks like so:
```typescript
export interface HttpRequest {
    method: string;
    url: string;

    /**
     * Content including headers to send as part of the request.
     * TODO: implement multipart writing
     */
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
    
    /*
     * If this callback returns true, then the result is considered 
     * a success and the promise will return. If the result from 
     * this callback is false, then the promise will reject with
     * an HttpError.
     */
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