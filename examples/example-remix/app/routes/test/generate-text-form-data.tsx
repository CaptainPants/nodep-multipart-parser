
import { type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const url = new URL(request.url);

    const count = Number(url.searchParams.get('parts') ?? '10');
    const content = url.searchParams.get('content') ?? 'x-{0}';

    const formData = new FormData();
    for (let i = 0; i < count; ++i){
        formData.append(`part ${i}`, content.replace("{0}", String(i)));
    }
    
    return new Response(formData, { status: 200 });
};