import { HOST } from "../../host.js";

export class SpaceRepService {

    async updateSpaceRepetition(id) {
    try {
        const preRes = await fetch(`${HOST}/api/spaced_repetition/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: "include",
        });
        const res = await preRes.json();
        return {
            status: preRes.status,
            ok: preRes.ok,
            data: res
        };
    } catch (err) {
        console.error(err);
    }
}
}