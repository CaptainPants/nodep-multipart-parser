# Data

The **Data** class lets you conveniently switch data back and forth between binary structures and strings. 

Input can be any of:
- string
- Blob
- ArrayBuffer
- DataView
- null

There are methods to convert the content into any of those same list of data structures (except null). This is similar to the modern 'Response' class but with support for old browsers.

For conversion we use TextEncoder/TextDecoder, falling back to FileReader/Blob constructor for IE11 and other browsers (Hopefully IE10 too according to https://caniuse.com/mdn-api_filereader_readastext). Functions that return a binary result also return the text encoding if relevant (if converting from string or if the data was already binary encoded text with a known encoding).

The constructor takes three parameters, of which two are optional:
```typescript
constructor(content: string | Blob | ArrayBuffer | DataView, sourceEncoding?: string, sourceMediaType?: string);
```

Each of those parameter values are available as public properties. The value sourceEncoding is when the source data is encoded text, so that if/when read into a string it is decoded correctly. The sourceMediaType parameter only really applies when converting to a Blob, so that its 'type' is correctly set.

There are 4 conversion methods:
- `string(): Promise<string>`
- `arrayBuffer(): Promise<BinaryResult<ArrayBuffer>>`
- `blob(): Promise<BinaryResult<Blob>>`
- `dataView(): Promise<BinaryResult<DataView>>`

Where a `BinaryResult<T>` has structure:
```typescript
interface BinaryResult<T> {
    value: T;
    encoding?: string;
}
```

Some example usage:
```typescript
import { Data } from '@captainpants/zerodeps-multipart-parser';

const data1 = new Data('Cheesecake', undefined, 'text/plain');
const asArrayBuffer1 = await data1.arrayBuffer();
const asBlob1 = await data1.blob();
const asDataView1 = await data1.dataView();

const data2 = new Data(asArrayBuffer1.value, asArrayBuffer1.encoding);
const asString2 = await data2.string();
```

Importantly: the data will not be converted until needed, and will transparently convert without you having to worry about it very much - which makes dealing with the results of an XMLHttpRequest very easy.

There is also the useful method:
```typescript
isEmpty(): boolean;
```
Which will return true if the input is null, an empty string, or a binary object with zero bytes.