export class VocabularyCtrl {

    constructor(view, eventBinder, vocabularyService, vocabularyModel, seoManager) {
        this.view = view;
        this.eventBinder = eventBinder;
        this.vocabularyService = vocabularyService;
        this.vocabularyModel = vocabularyModel;
        this.seoManager = seoManager;

        this.eventBinder.setController(this);
    }

    async show() {
        const vocabulary = await this.vocabularyModel.getVocabulary();
        const vocabularyByCategories = await this.vocabularyModel.getVocabularyByCategories();
        const vocabularyByFamily = await this.vocabularyModel.getVocabularyByFamily();
        const families = await this.vocabularyModel.getFamilies();
        this.view.render();
        this.view.renderVocabulary(vocabularyByFamily);
        this.view.renderFilter(families);

        this.seoManager.setTitle('Ecorcerie Gestionnaire - Profil');
        this.eventBinder.addEventListeners();
    }
}