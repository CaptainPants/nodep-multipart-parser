# HttpContent

The HttpContent classes provide simplified access to single and multi-part HTTP content. You can use this easily with XMLHttpRequest, or with our included HttpClient class.

Using HttpContent with HttpClient:
```typescript
import { HttpClient, isMultipartContent, MultipartHttpResponse, builder } from '@captainpants/zerodeps-multipart-parser';

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

This is most easily used with HttpClient, but can also be used directly with XMLHttpRequest as per the below example:

```typescript
import { HttpContent, isMultipartContent } from '@captainpants/zerodeps-multipart-parser';

const xhr = new XMLHttpRequest();
// To handle multipart responses you will need to specify responseType = 'arraybuffer'
xhr.responseType = 'arraybuffer';

req.addEventListener("load", reqListener);
req.open("GET", "http://www.example.org/example.txt");
req.send();

async function reqListener() {
    // run the XML request and wait for result
    const content = HttpContent.fromXHRResponse(xhr);

    if (isMultipartContent(content)) {
        // This is multipart content
        for (const part of content.parts) {
            /*
            Do something with the parts here.
            Each part is a SingularHttpContent with a data (of type Data) property, 
            which internally is a DataView to the bytes of that segment.
            */
            const asString = await part.data.string();
        }

        // alternatively 
        for (const { name, filename, data } of response.entries()) {
            // The entries method is modelled on the structure of FormData.prototype.entries()
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

# MultipartBuilder
You can use the **MultipartBuilder** class to easily create multipart content for requests:
```typescript
import { MultipartBuilder } from '@captainpants/zerodeps-multipart-parser';

const builder = new MultipartBuilder();
builder.append({
    name: part,
    mediaType: 'application/json',
    data: JSON.stringify({ test: 1 }),
    filename: 'file.json'
});
const content = await builder.build();

// Now either pass to HttpClient.request
const client = new HttpClient();
const result = await client.request({ method: 'POST', url: '/something', content: content });

// or create an array buffer for XMLHttpRequest:
const arrayBuffer = await content.toArrayBuffer('BOUNARY-STRING');
