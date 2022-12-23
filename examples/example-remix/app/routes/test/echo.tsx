
import { type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    return new Response(request.body, { status: 200 });
};