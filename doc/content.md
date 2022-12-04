# HttpContent

The HttpContent classes provide simplified access to single and multi-part HTTP content. You can use this easily with XMLHttpRequest, or with our included HttpClient class.

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

This is most easily used with HttpClient, but can also be used directly with XMLHttpRequest as per the below example:

```typescript
import { HttpContent, MultipartHttpContent, SingularHttpContent } from '@captainpants/zerodeps-multipart-parser';

const xhr = new XMLHttpRequest();
// To handle multipart responses you will need to specify responseType = 'arraybuffer'
xhr.responseType = 'arraybuffer';

req.addEventListener("load", reqListener);
req.open("GET", "http://www.example.org/example.txt");
req.send();

async function reqListener() {
    // run the XML request and wait for result
    const content = HttpContent.fromXHRResponse(xhr);

    if (content instanceof MultipartHttpContent) {
        // This is multipart content
        for (const part of content.parts) {
            /*
            Do something with the parts here.
            Each part is a SingularHttpContent with a data (of type Data) property, 
            which internally is a DataView to the bytes of that segment.
            */
            const asString = await part.data.string();
        }
    }
    else {
        // Singular content

        // get content as a string
        const asString = await content.data.string(); 
        // or in a binary format
        const asBinary1 = await content.data.arrayBuffer();
        const asBinary2 = await content.data.blob();
        const asBinary3 = await content.data.dataView();
    }
}
```