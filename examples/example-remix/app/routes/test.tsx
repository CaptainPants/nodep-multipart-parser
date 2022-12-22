
import { HttpClient, type SingularHttpContent } from '@captainpants/zerodeps-multipart-parser';
import { type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = ({ request }) => {
    return new Response('Example text');
};

export default function Index() {
    const onClick = async () => {
        try{
            const client = new HttpClient();
            const response = await client.request({ method: 'POST', url: '/test' });
            const asText = await (response.content as SingularHttpContent).data.string();
            console.warn(`Response received: ${asText}`);
        }
        catch(err) {
            console.warn(`Failed request ${err}`);
        }
    };

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
            <button onClick={onClick}>Do a test run</button>
        </div>
    );
}
