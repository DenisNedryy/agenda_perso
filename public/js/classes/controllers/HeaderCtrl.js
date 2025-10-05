export class HeaderCtrl {
    constructor(headerEventBinder, taskModel, modalView) {
        this.headerEventBinder = headerEventBinder;
        this.taskModel = taskModel;
        this.modalView = modalView;

        this.headerEventBinder.setController(this);
    }

    async init() {
        // afficher le nb d'alertes sur la cloche
        const alerts = await this.taskModel.getAlerts();
        this.modalView.renderAlertsLength(alerts);

        this.headerEventBinder.addEventListeners();
    }
}