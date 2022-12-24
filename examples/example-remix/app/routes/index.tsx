
import { Data, HttpClient, SingularHttpContent, isMultipartContent, MultipartBuilder } from '@captainpants/zerodeps-multipart-parser';
import { type ReactNode, useState } from 'react';

type Test = (log: (...message: unknown[]) => void) => Promise<void>;

const tests: Record<string, Test> = {
    downloadTextMultipart: async (log) => {
        const client = new HttpClient();

        const numberOfParts = 10;

        const response = await client.request({ method: 'POST', url: `/test/generate-text-form-data?parts=${numberOfParts}&content=Sample-{0}` });
        
        log(response.status);
        
        if (!isMultipartContent(response.content)) {
            throw new Error('Unexpected single part response');
        }

        if (response.content.parts.length != numberOfParts) {
            throw new Error(`Expected ${numberOfParts}, found ${response.content.parts.length}.`);
        }

        log(`Response received: ${response.content.parts.length} parts`);

        let index = 0;
        for (const part of response.content.parts) {
            const partAsString = await part.data.string();

            log(`Content: ${partAsString}`);

            if (partAsString !== `Sample-${index}`) {
                throw new Error(`Expected content 'Sample-${index}', found '${partAsString}'.`);
            }

            ++index;
        }
    },
    uploadTextSinglepart: async (log) => {
        const client = new HttpClient();

        const input = 'The quick brown fox jumped over the lazy dog. Σὲ γνωρίζω ἀπὸ τὴν κόψη';

        const requestContent = new SingularHttpContent(
            [{
                name: 'content-type', 
                value: 'text/plain'
            }],
            new Data(
                input, 
                undefined,
                // This isn't read unless converted to Blob
                'text/plain'
            )
        );

        const response = await client.request({ method: 'POST', url: `/test/echo`, content: requestContent });
        
        log(response.status);

        if (isMultipartContent(response.content)){
            throw new Error('Unexpected multi-part response');
        }

        // Note that if you don't specify, HttpClient will use responseType 'arraybuffer' so this should be internally an arraybuffer
        if (!(response.content.data.source instanceof ArrayBuffer)) {
            throw new Error('Expected an array buffer respponse');
        }

        const responseText = await response.content.data.string();

        log(`Received: ${responseText}`);

        if (responseText != input) {
            throw new Error(`Unexpected '${responseText}' when expecting '${input}'.`);
        }
    },
    uploadTextMultipart: async (log) => {
        const client = new HttpClient();

        const input = 'The quick brown fox jumped over the lazy dog. Σὲ γνωρίζω ἀπὸ τὴν κόψη';

        const builder = new MultipartBuilder();
        builder.add({ 
            content: input,
            name: 'test1'
        });
        builder.add({ 
            content: input,
            name: 'test2'
        });

        const content = await builder.build();

        const response = await client.request({ method: 'POST', url: `/test/receive-text-formdata`, content: content });

        if (isMultipartContent(response.content)) {
            throw new Error('Unexpected multipart data.');
        }

        const responseContent = await response.content.data.string();

        log(response.status, ' ', responseContent);

        const expected = JSON.stringify({ parts: [{ name: 'test1', content: input }, { name: 'test2', content: input }] });

        if (responseContent !== expected) {
            throw new Error(`Unexpected response ${responseContent} expected ${expected}.`);
        }
    }
};

export default function Index() {
    const [logContent, setLogContent] = useState<ReactNode[]>([]);

    const log = (...messages: unknown[]) => {
        setLogContent(
            old => {
                return old.concat(<div key={`item-${old.length}`}>{messages.map(x => String(x)).join('')}</div>);
            }
        );
    };

    const warn = (...messages: unknown[]) => {
        console.warn(...messages);
        setLogContent(
            old => {
                return old.concat(<div key={`item-${old.length}`} style={{ color: 'red' }}>{messages.map(x => String(x)).join('')}</div>);
            }
        );
    };

    const onClick = async () => {
        setLogContent([]);

        for (const key of Object.getOwnPropertyNames(tests)) {
            const test = tests[key];

            try{
                log(`== Running ${key} ==`);
                await test(log);
                log('Finished!');
            }
            catch(err) {
                warn(`Failed test ${key} ${err}`);
            }
        }
    };

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
            <button onClick={onClick}>Do a test run</button>
            <pre>{logContent}</pre>
        </div>
    );
}
