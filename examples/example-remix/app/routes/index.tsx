
import { Data, HttpClient, SingularHttpContent, isMultipartContent, MultipartBuilder, Header } from '@captainpants/zerodeps-multipart-parser';
import { type ReactNode, useState } from 'react';
import { generateArrayBuffer } from '~/util/generateArrayBuffer';

type Test = (log: (...message: unknown[]) => void) => Promise<void>;

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(message);
    }
}

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
            [new Header (
                'content-type', 
                'text/plain'
            )],
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

        const inputString = 'The quick brown fox jumped over the lazy dog. Σὲ γνωρίζω ἀπὸ τὴν κόψη';
        const inputArray = generateArrayBuffer(1024);

        const builder = new MultipartBuilder();
        builder.add({ 
            data: inputString,
            name: 'test1',
            filename: 'test1.txt'
        });
        builder.add({ 
            data: inputArray,
            name: 'test2',
            filename: 'test2.bin'
        });

        const content = await builder.build();

        const response = await client.request({ method: 'POST', url: `/test/echo-formdata?reverse=true`, content: content });

        if (!isMultipartContent(response.content)) {
            throw new Error('Unexpected multipart data.');
        }

        log(response.status);

        assert(response.content.parts.length === 2,`Found ${response.content.parts.length} when expecting 2.`);

        const entries = response.content.entries();

        assert(entries[0].name == 'test2', `Incorrect content-disposition on part 0 - ${entries[0].name}`);
        assert(await Data.isSame(entries[0].data, new Data(inputArray)), `Mismatched content in part 0`);

        assert(entries[1].name == 'test1', `Incorrect content-disposition on part 1 - ${entries[1].name}`);
        assert(await Data.isSame(entries[1].data, new Data(inputString)), `Mismatched content in part 1`);
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
