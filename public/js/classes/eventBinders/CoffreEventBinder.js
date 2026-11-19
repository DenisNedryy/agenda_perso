export class CoffreEventBinder {
    setController(controller) {
        this.controller = controller;
    }

    addEventListeners(page) {
        page.onclick = (event) => {
            const button = event.target.closest("button[data-action]");
            if (button) this.controller.handleAction(button);
        };

        page.oninput = (event) => {
            if (event.target.matches("[data-coffre-search]")) {
                this.controller.setFilter("query", event.target.value);
            }
        };

        page.onchange = (event) => {
            if (event.target.matches("[data-coffre-category]")) {
                this.controller.setFilter("category", event.target.value);
            }
        };

        page.onsubmit = async (event) => {
            const form = event.target;
            if (!form.matches("form[data-form]")) return;
            event.preventDefault();

            const submit = event.submitter ?? form.querySelector('[type="submit"]');
            if (submit.disabled) return;
            submit.disabled = true;
            try {
                await this.controller.submitForm(form);
            } finally {
                submit.disabled = false;
            }
        };
    }
}
