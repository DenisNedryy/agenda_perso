export class TasksManager {
    constructor() {
        this.tasks = [];
        this.currentPage = 1;
        this.tasksPerPage = 5;
    }

    render(data = []) {
        this.tasks = Array.isArray(data) ? data : [data].filter(Boolean);

        this.bindFilters();
        this.applyFilters();
    }

    displayTasks(tasks = []) {
        const el = document.querySelector(
            ".home__bodyContainer__right__findTasks__body__content"
        );
        if (!el) return;

        const totalPages = Math.max(1, Math.ceil(tasks.length / this.tasksPerPage));
        this.currentPage = Math.min(this.currentPage, totalPages);

        const page = this.currentPage;
        const start = (page - 1) * this.tasksPerPage;
        const visibleTasks = tasks.slice(start, start + this.tasksPerPage);

        const header = `
            <div class="findTasks__header">
                <span>Tâche</span>
                <span>Type</span>
                <span>Date</span>
                <span>Actions</span>
            </div>
        `;

        const rows = visibleTasks.map(task => {
            const id = this.escapeHtml(task.id);
            const type = this.escapeHtml(task.type);
            const date = task.date
                ? new Date(task.date).toLocaleDateString("fr-CA")
                : "";

            return `
                <div class="findTasks__task" data-id="${id}" data-date="${date}">
                    <div class="findTasks__task__left">
                        <p class="findTasks__task__name">
                            ${this.escapeHtml(task.name || "Sans titre")}
                        </p>
                    </div>

                    <div class="findTasks__task__right">
                        <span class="findTasks__task__type type-${type}">
                            ${this.formatType(task.type)}
                        </span>

                        <span class="findTasks__task__date">
                            ${this.formatDate(task.date)}
                        </span>

                        <div class="findTasks__task__actions">
                            <button
                                type="button"
                                class="findTasks__task__btn openTaskBtn"
                                data-id="${id}"
                                aria-label="Ouvrir la tâche"
                            >
                                <i class="fa-solid fa-arrow-up-right-from-square btn-selectDate"></i>
                            </button>

                            <button
                                type="button"
                                class="findTasks__task__btn deleteTaskBtn"
                                data-id="${id}"
                                aria-label="Supprimer la tâche"
                            >
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        const pagination = totalPages > 1 ? `
            <nav class="findTasks__pagination" aria-label="Pagination des tâches">
                <button
                    type="button"
                    class="findTasks__pagination__btn"
                    data-step="-1"
                    ${page === 1 ? "disabled" : ""}
                >
                    Précédent
                </button>

                <span class="findTasks__pagination__status">
                    Page ${page} sur ${totalPages}
                </span>

                <button
                    type="button"
                    class="findTasks__pagination__btn"
                    data-step="1"
                    ${page === totalPages ? "disabled" : ""}
                >
                    Suivant
                </button>
            </nav>
        ` : "";

        const empty = `<p class="findTasks__empty">Aucune tâche trouvée.</p>`;
        el.innerHTML = header + (rows || empty) + pagination;

        for (const button of el.querySelectorAll(".findTasks__pagination__btn")) {
            button.onclick = () => {
                const step = Number(button.dataset.step);
                this.currentPage += step;
                this.displayTasks(tasks);

                const nextFocus =
                    el.querySelector(`.findTasks__pagination__btn[data-step="${step}"]:enabled`) ||
                    el.querySelector(".findTasks__pagination__btn:enabled");

                nextFocus?.focus({ preventScroll: true });
            };
        }
    }

    bindFilters() {
        const searchInput = document.querySelector(".findTasksSearchInput");
        const typeSelect = document.querySelector(".findTasksType");
        const sortSelect = document.querySelector(".findTasksSort");

        const updateTasks = () => {
            this.currentPage = 1;
            this.applyFilters();
        };

        if (searchInput) searchInput.oninput = updateTasks;
        if (typeSelect) typeSelect.onchange = updateTasks;
        if (sortSelect) sortSelect.onchange = updateTasks;
    }

    applyFilters() {
        const searchValue = document.querySelector(".findTasksSearchInput")
            ?.value.toLowerCase().trim() || "";

        const typeValue = document.querySelector(".findTasksType")?.value || "all";
        const sortValue = document.querySelector(".findTasksSort")?.value || "recent";

        let filteredTasks = [...this.tasks];

        if (searchValue) {
            filteredTasks = filteredTasks.filter(task =>
                task.name?.toLowerCase().includes(searchValue) ||
                task.description?.toLowerCase().includes(searchValue)
            );
        }

        if (typeValue !== "all") {
            filteredTasks = filteredTasks.filter(task => task.type === typeValue);
        }

        filteredTasks.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            return sortValue === "oldest" ? dateA - dateB : dateB - dateA;
        });

        this.displayTasks(filteredTasks);
    }

    escapeHtml(value) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return String(value).replace(/[&<>"']/g, character => characters[character]);
    }

    formatDate(date) {
        if (!date) return "Aucune date";

        return new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    formatTime(time) {
        return time ? time.slice(0, 5) : "";
    }

    formatType(type) {
        const types = {
            tasks: "Tâche",
            movies: "Film",
            spaced_repetition: "Révision",
            courses: "Cours",
            rdvs: "RDV",
            events: "Évènement",
            projets: "Projet",
            alert: "Alerte",
            dayOff: "Repos"
        };

        return Object.hasOwn(types, type) ? types[type] : "Tâche";
    }
}