# MultipartParser

The class **MultipartParser** which will take a **DataView** (wrapping an **ArrayBuffer**) and break it into parts according to a given boundary string.

Using the multipart parser directly:
```typescript
import { MultipartParser, parseContentType } from 'nodep-multipart-parser';

const contentType = parseContentType('multipart/form-data; boundary="example-boundary-1251436436"');
const content: ArrayBuffer = ...;

if (!contentType.boundary) {
    throw new Error('No boundary provided.');
}

const parser = new MultipartParser();
const result = parser.parseDataView(contentType.boundary, new DataView(content));

let i = 0;

for (const part of result.parts) {
    console.log('Part ', i, ' ', part);

    ++i;
}