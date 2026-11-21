const EVENING_TASKS = [
    { id: "emails", name: "Vérifier les mails" },
    { id: "housekeeping", name: "Imprimer le planning de la gouvernante" },
    { id: "cash-register", name: "Faire la caisse" },
    { id: "breakfast", name: "Dresser la table du petit-déjeuner" },
    { id: "temperatures", name: "Noter les températures" },
    { id: "honesty-bar", name: "Réapprovisionner l’honesty bar" },
    { id: "pool", name: "Fermer la piscine" },
    { id: "terrace", name: "Nettoyer la terrasse" },
    { id: "kitchen-glasswasher", name: "Nettoyer la cuisine et le lave-verre" },
    { id: "glasswasher", name: "Éteindre le lave-verre" },
    { id: "shutters", name: "Fermer les volets" },
    { id: "chapel", name: "Fermer la chapelle" },
    { id: "supplies", name: "Noter les fournitures manquantes" },
    {
        id: "morning-handover",
        name: "Informer l’équipe du matin du nombre de petits-déjeuners et de l’horaire",
    },
    {
        id: "bakery",
        name: "Appeler le boulanger au 06 35 17 51 85 (sauf le samedi pour le dimanche)",
        optional: true,
    },
    { id: "bins", name: "Sortir les poubelles" },
];

const TIME_ZONE = "Europe/Paris";

const storageDateFormatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

const displayDateFormatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIME_ZONE,
    dateStyle: "full",
});

export class RoutineCtrl {
    constructor(routineView, seoManager, routineEventBinder, storage) {
        this.routineView = routineView;
        this.seoManager = seoManager;
        this.routineEventBinder = routineEventBinder;
        this.storage = storage;
        this.filter = "all";
        this.tasks = [];

        this.routineEventBinder.setController(this);
    }

    show() {
        const now = new Date();
        const parts = storageDateFormatter.formatToParts(now);
        const year = parts.find(({ type }) => type === "year").value;
        const month = parts.find(({ type }) => type === "month").value;
        const day = parts.find(({ type }) => type === "day").value;

        this.storageKey = `naboo:routines:soir:${year}-${month}-${day}`;
        this.dateLabel = displayDateFormatter.format(now);
        this.filter = "all";
        this.tasks = this.loadTasks();

        this.seoManager.setTitle("Schedule - Routines");
        this.render();
        this.routineEventBinder.addEventListeners();
    }

    loadTasks() {
        let savedStatuses;

        try {
            savedStatuses = JSON.parse(this.storage.getItem(this.storageKey));
        } catch (error) {
            console.warn("Impossible de lire la checklist du jour.", error);
        }

        return EVENING_TASKS.map((task) => {
            const savedStatus = savedStatuses?.[task.id];
            const canRestore = savedStatus === "done"
                || (savedStatus === "skipped" && task.optional);

            return {
                ...task,
                status: canRestore ? savedStatus : "todo",
            };
        });
    }

    render() {
        this.routineView.render({
            dateLabel: this.dateLabel,
            tasks: this.tasks,
            filter: this.filter,
        });
    }

    setFilter(filter) {
        if (filter !== "all" && filter !== "todo") return;

        this.filter = filter;
        this.render();
    }

    setTaskDone(id, checked) {
        const task = this.tasks.find((item) => item.id === id);
        if (!task || task.status === "skipped") return;

        task.status = checked ? "done" : "todo";
        this.saveAndRender();
    }

    toggleTaskSkipped(id) {
        const task = this.tasks.find((item) => item.id === id);
        if (!task?.optional) return;

        task.status = task.status === "skipped" ? "todo" : "skipped";
        this.saveAndRender();
    }

    saveAndRender() {
        const statuses = Object.fromEntries(
            this.tasks.map(({ id, status }) => [id, status])
        );

        try {
            this.storage.setItem(this.storageKey, JSON.stringify(statuses));
        } catch (error) {
            console.warn("Impossible de sauvegarder la checklist du jour.", error);
        }

        this.render();
    }
}