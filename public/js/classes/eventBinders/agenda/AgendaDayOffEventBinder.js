

export class AgendaDayOffEventBinder {

    constructor() {
        this.boundHandleClick = this.handleClick.bind(this);
    }

    setController(controller) {
        this.controller = controller;
    }

    addEventListeners() {
        document.removeEventListener('click', this.boundHandleClick);
        document.addEventListener('click', this.boundHandleClick);
    }

    async handleClick(e) {
        const dayOffBtn = e.target.closest(".dayOff-manager");
        console.log(dayOffBtn);
        if (dayOffBtn) {
            // chercher dans la bdd le weekEnd et l'envoyer dans le render
            this.controller.agendaDayOffView.render();

        }

    }


}