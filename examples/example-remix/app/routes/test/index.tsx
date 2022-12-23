
import { HttpClient, MultipartHttpContent } from '@captainpants/zerodeps-multipart-parser';

type Test = (log: (message: unknown) => void) => Promise<void>;

const tests: Record<string, Test> = {
    test1: async (log) => {
        const client = new HttpClient();

        const numberOfParts = 10;

        const response = await client.request({ method: 'POST', url: `/test/generate-form-data?parts=${numberOfParts}` });
        if (!(response.content instanceof MultipartHttpContent)) {
            throw new Error('Unexpected single part response');
        }

        if (response.content.parts.length != numberOfParts) {
            throw new Error(`Expected ${numberOfParts}, found ${response.parts.length}.`);
        }

        log(`Response received: ${response.content.parts.length} parts`);

        for (const part of response.content.parts) {
            console.log(`Content: ${await part.data.string()}`);
        }
    }
};

export default function Index() {
    const onClick = async () => {
        for (const key of Object.getOwnPropertyNames(tests)) {
            const test = tests[key];

            try{
                test(console.log);
            }
            catch(err) {
                console.warn(`Failed test ${key} ${err}`);
            }
        }
    };

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
            <button onClick={onClick}>Do a test run</button>
        </div>
    );
}
