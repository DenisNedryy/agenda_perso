export class CoffreView {
    render() {
        const root = document.getElementById("root");
        root.innerHTML = `
            <section class="coffre">
                <h2>Coffre</h2>
                <p class="coffre__status" role="status"></p>
                <div class="coffre__layout">
                    <div>
                        <div class="coffre__toolbar">
                            <input type="search" aria-label="Rechercher un accès" placeholder="Rechercher un accès…" data-coffre-search>
                            <select aria-label="Catégorie" data-coffre-category></select>
                            <button type="button" data-action="favorites" aria-pressed="false">Favoris</button>
                            <button type="button" class="coffre__primary" data-action="new">Nouvel accès</button>
                        </div>
                        <div class="coffre__grid"></div>
                        <div class="coffre__pagination" aria-label="Pagination">
                            <button type="button" data-action="previous">Précédent</button>
                            <span data-coffre-page></span>
                            <button type="button" data-action="next">Suivant</button>
                        </div>
                    </div>
                    <section class="coffre__details" aria-label="Détails de l’accès">
                        Sélectionne un accès pour afficher sa fiche.
                    </section>
                </div>
            </section>
        `;
        return root.querySelector(".coffre");
    }

    renderCards(page, { entries, categories, category, favorites, number, total, selectedId }) {
        const select = page.querySelector("[data-coffre-category]");
        select.replaceChildren(new Option("Toutes les catégories", ""));
        for (const name of categories) select.add(new Option(name, name));
        select.value = category;
        page.querySelector('[data-action="favorites"]').setAttribute("aria-pressed", String(favorites));

        const grid = page.querySelector(".coffre__grid");
        grid.replaceChildren();
        if (!entries.length) grid.textContent = "Aucun accès trouvé.";

        for (const entry of entries) {
            const card = document.createElement("div");
            card.className = "coffre__card";
            const selectEntry = document.createElement("button");
            selectEntry.type = "button";
            selectEntry.dataset.action = "select";
            selectEntry.dataset.id = entry.id;
            selectEntry.setAttribute("aria-pressed", String(selectedId === entry.id));

            const name = document.createElement("strong");
            name.textContent = entry.name;
            const category = document.createElement("span");
            category.textContent = entry.category;
            selectEntry.append(name, category);

            const favorite = document.createElement("button");
            favorite.type = "button";
            favorite.dataset.action = "favorite";
            favorite.dataset.id = entry.id;
            favorite.setAttribute("aria-pressed", String(Boolean(entry.is_favorite)));
            const isFavorite = Boolean(entry.is_favorite);

            favorite.textContent = isFavorite ? "★" : "☆";
            favorite.setAttribute("aria-label", "Favori");
            favorite.setAttribute("aria-pressed", String(isFavorite));
            favorite.title = isFavorite ? "Retirer des favoris" : "Ajouter aux favoris";
            card.append(selectEntry, favorite);
            grid.append(card);
        }

        page.querySelector("[data-coffre-page]").textContent = "Page " + number + " sur " + total;
        page.querySelector('[data-action="previous"]').disabled = number === 1;
        page.querySelector('[data-action="next"]').disabled = number === total;
    }
}
