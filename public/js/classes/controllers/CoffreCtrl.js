const PAGE_SIZE = 6;

export class CoffreCtrl {
    constructor(view, seoManager, eventBinder, services, detailsView, taskServices, userServices) {
        Object.assign(this, { view, seoManager, eventBinder, services, detailsView, taskServices, userServices });
        eventBinder.setController(this);
    }

    async show() {
        this.seoManager.setTitle("Naboo - Coffre");
        const page = this.view.render();
        this.state = {
            page,
            panel: page.querySelector(".coffre__details"),
            entries: [],
            entry: null,
            detailRequest: null,
            query: "",
            category: "",
            favorites: false,
            number: 1,
        };
        this.eventBinder.addEventListeners(page);
        await this.loadEntries(this.state);
    }

    active(state) {
        return this.state === state && state.page.isConnected;
    }

    status(state, message) {
        if (this.active(state)) state.page.querySelector(".coffre__status").textContent = message;
    }

    async loadEntries(state) {
        const result = await this.services.getEntriesByAuth();
        if (!this.active(state)) return;
        if (!result.ok) {
            this.renderCards(state);
            this.status(state, "Impossible de charger les accès.");
            return;
        }

        state.entries = result.data.entries;
        if (!state.entries.some((entry) => entry.category === state.category)) state.category = "";
        this.renderCards(state);
    }

    renderCards(state) {
        const categories = [...new Set(state.entries.map((entry) => entry.category))].sort();
        const query = state.query.trim().toLocaleLowerCase("fr");
        const matching = state.entries.filter((entry) =>
            (!state.favorites || entry.is_favorite) &&
            (!state.category || entry.category === state.category) &&
            (entry.name + " " + entry.category).toLocaleLowerCase("fr").includes(query)
        );
        const total = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
        state.number = Math.max(1, Math.min(state.number, total));
        const offset = (state.number - 1) * PAGE_SIZE;
        this.view.renderCards(state.page, {
            entries: matching.slice(offset, offset + PAGE_SIZE),
            categories,
            category: state.category,
            favorites: state.favorites,
            number: state.number,
            total,
            selectedId: state.entry?.id,
        });
    }

    setFilter(key, value) {
        const state = this.state;
        state[key] = value;
        state.number = 1;
        this.renderCards(state);
    }

    async showEntry(state, id) {
        const request = Symbol();
        state.detailRequest = request;
        state.entry = null;
        state.panel.textContent = "Chargement de l’accès…";
        this.renderCards(state);

        const result = await this.services.getEntry(id);
        if (!this.active(state) || state.detailRequest !== request) return;
        if (!result.ok) {
            state.panel.textContent = result.data?.msg ?? "Impossible de charger cet accès.";
            return;
        }

        state.entry = result.data.entry;
        this.detailsView.render(state.panel, state.entry);
        this.renderCards(state);
    }

    async handleAction(button) {
        const state = this.state;
        const { action, id, field } = button.dataset;
        this.status(state, "");

        switch (action) {
            case "select":
                return this.showEntry(state, id);
            case "previous":
            case "next":
                state.number += action === "next" ? 1 : -1;
                return this.renderCards(state);
            case "favorites":
                return this.setFilter("favorites", !state.favorites);
            case "favorite":
                return this.toggleFavorite(state, id, button);
            case "new":
                state.detailRequest = null;
                state.entry = null;
                this.renderCards(state);
                return this.detailsView.renderForm(state.panel);
            case "edit":
                return this.detailsView.renderForm(state.panel, state.entry);
            case "cancel":
                if (state.entry) return this.detailsView.render(state.panel, state.entry);
                state.panel.textContent = "Sélectionne un accès pour afficher sa fiche.";
                return;
            case "reminder":
                return this.detailsView.renderReminder(state.panel, state.entry);
            case "copy":
                return this.copy(state, state.entry[field]);
            case "copy-password":
                return this.copy(state, state.panel.querySelector("[data-password]").textContent);
            case "reveal":
                return this.togglePassword(state, button);
            case "delete":
                return this.deleteEntry(state, button);
        }
    }

    async copy(state, value) {
        try {
            await navigator.clipboard.writeText(value);
            this.status(state, "Copié.");
        } catch {
            this.status(state, "Impossible de copier.");
        }
    }

    async togglePassword(state, button) {
        if (button.textContent === "Masquer") {
            this.detailsView.setPassword(state.panel, null);
            return;
        }
        button.disabled = true;
        const result = await this.services.getEntryPassword(state.entry.id);
        if (!this.active(state) || !button.isConnected) return;
        button.disabled = false;
        if (!result.ok) return this.status(state, result.data?.msg ?? "Mot de passe indisponible.");
        this.detailsView.setPassword(state.panel, result.data.password);
    }

    async toggleFavorite(state, id, button) {
        const entry = state.entries.find((item) => item.id === id);
        if (!entry || entry.pendingFavorite) return;
        entry.pendingFavorite = true;
        button.disabled = true;
        const favorite = !entry.is_favorite;
        const result = await this.services.updateEntry(id, { is_favorite: favorite });
        entry.pendingFavorite = false;
        button.disabled = false;
        if (!this.active(state)) return;
        if (!result.ok) return this.status(state, result.data?.msg ?? "Impossible de modifier le favori.");
        entry.is_favorite = favorite;
        this.renderCards(state);
    }

    async deleteEntry(state, button) {
        const id = state.entry.id;
        if (!window.confirm("Supprimer cet accès ?")) return;
        button.disabled = true;
        const result = await this.services.deleteEntry(id);
        button.disabled = false;
        if (!this.active(state)) return;
        if (!result.ok) return this.status(state, result.data?.msg ?? "Impossible de supprimer l’accès.");

        if (state.entry?.id === id) {
            state.entry = null;
            state.panel.textContent = "Sélectionne un accès pour afficher sa fiche.";
        }
        await this.loadEntries(state);
    }

    async submitForm(form) {
        const state = this.state;
        const data = Object.fromEntries(new FormData(form));
        this.status(state, "");
        if (form.dataset.form === "reminder") return this.saveReminder(state, form, data);

        const id = state.entry?.id;
        if (id && data.password === "") delete data.password;
        const result = id ? await this.services.updateEntry(id, data) : await this.services.addEntry(data);
        if (!this.active(state)) return;
        if (!result.ok) return this.status(state, result.data?.msg ?? "Impossible d’enregistrer l’accès.");

        await this.loadEntries(state);
        if (this.active(state) && form.isConnected) await this.showEntry(state, id ?? result.data.id);
    }

    async saveReminder(state, form, data) {
        const entry = state.entry;
        const profile = await this.userServices.getMyProfil();
        if (!this.active(state) || !form.isConnected) return;
        const userId = profile?.data?.user?.id;
        if (!userId) return this.status(state, "Impossible de retrouver le compte connecté.");

        const result = await this.taskServices.createTask({
            name: data.name,
            date: data.date,
            type: "alert",
            subject: "unspecified",
            author_id: userId,
            owner_id: userId,
        });

        if (!this.active(state)) return;
        if (!result?.ok) return this.status(state, result?.data?.msg ?? "Impossible de créer le rappel.");
        if (form.isConnected) this.detailsView.render(state.panel, entry);
        this.status(state, "Rappel ajouté à l’Agenda.");
    }
}
