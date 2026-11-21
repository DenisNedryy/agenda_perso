export class RoutineView {
    render({ dateLabel, tasks = [], filter = "all" } = {}) {
        const root = document.getElementById("root");
        if (!root) return;

        const done = tasks.filter((task) => task.status === "done").length;
        const applicable = tasks.filter((task) => task.status !== "skipped").length;
        const visibleTasks = filter === "todo"
            ? tasks.filter((task) => task.status === "todo")
            : tasks;

        root.innerHTML = `
            <section class="routine">
                <h2>Routines</h2>

                <section class="routine__panel" aria-labelledby="routine-title">
                    <header class="routine__header">
                        <div>
                            <h3 id="routine-title">Checklist du soir</h3>
                            <p class="routine__date"></p>
                        </div>

                        <div class="routine__filters" role="group" aria-label="Filtrer les tâches">
                            <button type="button" data-routine-filter="all">Toutes</button>
                            <button type="button" data-routine-filter="todo">À faire</button>
                        </div>
                    </header>

                    <div class="routine__progress">
                        <progress aria-label="Progression de la checklist"></progress>
                        <span></span>
                    </div>

                    <ul class="routine__list"></ul>
                    <p class="routine__empty" hidden>Aucune tâche à afficher.</p>
                </section>
            </section>
        `;

        root.querySelector(".routine__date").textContent = dateLabel ?? "";

        for (const button of root.querySelectorAll("[data-routine-filter]")) {
            button.setAttribute("aria-pressed", String(button.dataset.routineFilter === filter));
        }

        const progress = root.querySelector("progress");
        progress.max = applicable || 1;
        progress.value = done;
        progress.hidden = applicable === 0;

        root.querySelector(".routine__progress span").textContent =
            applicable === 0 ? "Aucune tâche applicable" : `${done} sur ${applicable}`;

        const list = root.querySelector(".routine__list");
        for (const task of visibleTasks) {
            list.append(this.createTaskRow(task));
        }

        const empty = root.querySelector(".routine__empty");
        empty.hidden = visibleTasks.length > 0;
        if (filter === "todo") empty.textContent = "Aucune tâche restante.";
    }

    createTaskRow(task) {
        const row = document.createElement("li");
        row.className = "routine__task";
        row.dataset.status = task.status;

        const label = document.createElement("label");
        label.className = "routine__task-label";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.status === "done";
        checkbox.disabled = task.status === "skipped";
        checkbox.dataset.routineTask = task.id;

        const name = document.createElement("span");
        name.textContent = task.name;

        label.append(checkbox, name);
        row.append(label);

        if (task.optional) {
            const skipButton = document.createElement("button");
            skipButton.type = "button";
            skipButton.dataset.routineSkip = task.id;
            skipButton.textContent = task.status === "skipped"
                ? "Réactiver"
                : "Non applicable";

            row.append(skipButton);
        }

        return row;
    }
}