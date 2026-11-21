export class RoutineEventBinder {
    constructor() {
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleChange = this.handleChange.bind(this);
    }

    setController(controller) {
        this.controller = controller;
    }

    addEventListeners() {
        const root = document.getElementById("root");
        if (!root) return;

        root.addEventListener("click", this.boundHandleClick);
        root.addEventListener("change", this.boundHandleChange);
    }

    handleClick(event) {
        const button = event.target.closest(".routine button");
        if (!button) return;

        const { routineFilter, routineSkip } = button.dataset;

        if (routineFilter !== undefined) {
            this.controller.setFilter(routineFilter);
        } else if (routineSkip !== undefined) {
            this.controller.toggleTaskSkipped(routineSkip);
        }
    }

    handleChange(event) {
        const checkbox = event.target;
        if (!checkbox.matches('.routine input[type="checkbox"][data-routine-task]')) {
            return;
        }

        this.controller.setTaskDone(
            checkbox.dataset.routineTask,
            checkbox.checked
        );
    }
}