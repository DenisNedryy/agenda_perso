import { HOST } from "../../constants/host.js";

export class CoffreServices {
    async getEntriesByAuth() {
        return this.request("/api/coffre");
    }

    async getEntry(id) {
        return this.request("/api/coffre/" + encodeURIComponent(id));
    }

    async getEntryPassword(id) {
        return this.request("/api/coffre/" + encodeURIComponent(id) + "/password");
    }

    async addEntry(data) {
        return this.request("/api/coffre", "POST", data);
    }

    async updateEntry(id, data) {
        return this.request("/api/coffre/" + encodeURIComponent(id), "PATCH", data);
    }

    async deleteEntry(id) {
        return this.request("/api/coffre/" + encodeURIComponent(id), "DELETE");
    }

    async request(path, method = "GET", data) {
        try {
            const options = { method, credentials: "include" };
            if (data !== undefined) {
                options.headers = { "Content-Type": "application/json" };
                options.body = JSON.stringify(data);
            }
            const res = await fetch(HOST + path, options);
            return {
                status: res.status,
                ok: res.ok,
                data: res.status === 204 ? null : await res.json(),
            };
        } catch (err) {
            console.error(err);
            return { status: 0, ok: false, data: null };
        }
    }
}
