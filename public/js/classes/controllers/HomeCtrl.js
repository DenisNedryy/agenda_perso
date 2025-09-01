export class HomeCtrl {

    constructor(homeView, seoManager, homeEventBinder, dateHelper, taskHelper, modelAgendaPlanning, taskServices) {
        this.homeView = homeView;
        this.seoManager = seoManager;
        this.homeEventBinder = homeEventBinder;
        this.dateHelper = dateHelper;
        this.taskHelper = taskHelper;
        this.modelAgendaPlanning = modelAgendaPlanning;
        this.taskServices = taskServices;

        this.homeEventBinder.setController(this);
    }

    async show() {
        this.homeView.render();
        this.seoManager.setTitle('Ecorcerie Gestionnaire - Accueil');
        this.homeEventBinder.addEventListeners();
    }

    async getTasks() {
        const res = await this.taskServices.getTasks();
        return res.data.tasks;
    }

    async getTasksByAuth() {
        const res = await this.taskServices.getTasksByAuth();
        return res.data.tasks;
    }

    async getAlerts() {
        const res = await this.taskServices.getAlerts();
        return res.data.alerts;
    }
}