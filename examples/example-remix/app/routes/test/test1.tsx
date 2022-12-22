
import { type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = ({ request }) => {
    return new Response('Example text', { status: 200 });
};