export class VocabularyCtrl {

    constructor(view, eventBinder, seoManager) {
        this.view = view;
        this.eventBinder = eventBinder;
        this.seoManager = seoManager;


        this.eventBinder.setController(this);
    }

    async show() {
        this.view.render();
        this.seoManager.setTitle('Ecorcerie Gestionnaire - Profil');
        this.eventBinder.addEventListeners();
    }
}