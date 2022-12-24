
import { unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const formData = await unstable_parseMultipartFormData(
        request,
        unstable_createMemoryUploadHandler() // <-- we'll look at this deeper next
    );

    const resultArray: { name: string, value: string}[] = [];

    for (const [name, content] of formData.entries()) {
        if (typeof content === 'string') {
            return { name: name, content: content };
        }
        else {
            return { name: name, content: await (new Response(content).text()) };
        }
    }
    
    const result = {
        parts: resultArray
    };

    return new Response(JSON.stringify(result), { status: 200, headers: { "content-type": "application/json" } });
};