export class CoffreDetailsView {
    render(panel, entry) {
        panel.innerHTML = `
            <div class="coffre__details-header">
                <h3></h3>
                <button type="button" data-action="edit">Modifier</button>
            </div>
            <dl class="coffre__fields">
                <dt>Catégorie</dt><dd data-value="category"></dd>
                <dt>Adresse de connexion</dt><dd><span data-value="url"></span><button type="button" data-action="copy" data-field="url">Copier</button></dd>
                <dt>Identifiant</dt><dd><span data-value="username"></span><button type="button" data-action="copy" data-field="username">Copier</button></dd>
                <dt>Mot de passe</dt><dd><span data-password>••••••••</span><button type="button" data-action="reveal">Afficher</button><button type="button" data-action="copy-password" hidden>Copier</button></dd>
            </dl>
            <div class="coffre__footer">
                <button type="button" data-action="reminder">Ajouter un rappel</button>
                <button type="button" data-action="delete">Supprimer</button>
            </div>
        `;
        panel.querySelector("h3").textContent = entry.name;
        for (const field of ["category", "url", "username"]) {
            panel.querySelector('[data-value="' + field + '"]').textContent = entry[field] || "Non renseigné";
        }
        panel.querySelector('[data-field="url"]').disabled = !entry.url;
        panel.querySelector('[data-field="username"]').disabled = !entry.username;
    }

    renderForm(panel, entry) {
        panel.innerHTML = `
            <h3></h3>
            <form class="coffre__form" data-form="entry">
                <label>Nom<input name="name" required maxlength="150"></label>
                <label>Catégorie<input name="category" required maxlength="100"></label>
                <label>Adresse de connexion<input name="url" type="url" maxlength="2048"></label>
                <label>Identifiant<input name="username" maxlength="255" autocomplete="off"></label>
                <label>Mot de passe<input name="password" type="password" autocomplete="new-password"></label>
                <div class="coffre__footer">
                    <button class="coffre__primary" type="submit">Enregistrer</button>
                    <button type="button" data-action="cancel">Annuler</button>
                </div>
            </form>
        `;
        panel.querySelector("h3").textContent = entry ? "Modifier l’accès" : "Nouvel accès";
        const form = panel.querySelector("form");
        for (const field of ["name", "category", "url", "username"]) {
            form.elements[field].value = entry?.[field] ?? "";
        }
        form.elements.password.required = !entry;
        if (entry) form.elements.password.placeholder = "Laisser vide pour conserver le mot de passe";
        form.elements.name.focus();
    }

    renderReminder(panel, entry) {
        panel.innerHTML = `
            <h3>Ajouter un rappel</h3>
            <form class="coffre__form" data-form="reminder">
                <label>Titre<input name="name" maxlength="100" required></label>
                <label>Date<input name="date" type="date" required></label>
                <div class="coffre__footer">
                    <button class="coffre__primary" type="submit">Enregistrer le rappel</button>
                    <button type="button" data-action="cancel">Annuler</button>
                </div>
            </form>
        `;
        panel.querySelector('[name="name"]').value = ("Vérifier l’accès " + entry.name).slice(0, 100);
        panel.querySelector('[name="date"]').focus();
    }

    setPassword(panel, password) {
        panel.querySelector("[data-password]").textContent = password ?? "••••••••";
        panel.querySelector('[data-action="reveal"]').textContent = password == null ? "Afficher" : "Masquer";
        panel.querySelector('[data-action="copy-password"]').hidden = password == null;
    }
}
