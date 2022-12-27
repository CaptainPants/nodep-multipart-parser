
import { type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const url = new URL(request.url);

    const formData = await request.formData();

    const list = [...formData.entries()];
    if (url.searchParams.get('reverse') == 'true') {
        list.reverse();
    }

    const result = new FormData();
    for (const [key, value] of list) {
        result.append(key, value);
    }

    return new Response(result, { status: 200 });
};