
import { unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const formData = await unstable_parseMultipartFormData(
        request,
        unstable_createMemoryUploadHandler() // <-- we'll look at this deeper next
    );

    const result = {
        count: formData.values.length,
    };

    return new Response(JSON.stringify(result), { status: 200, headers: { "content-type": "application/json" } });
};