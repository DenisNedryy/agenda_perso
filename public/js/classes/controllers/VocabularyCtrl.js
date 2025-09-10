export class VocabularyCtrl {

    constructor(view, { vocabularyEventBinders }, vocabularyService, vocabularyModel, seoManager) {
        this.view = view;
        this.vocabularyService = vocabularyService;
        this.vocabularyModel = vocabularyModel;
        this.vocabularyEventBinder = vocabularyEventBinders.vocabularyEventBinder;
        this.seoManager = seoManager;

        this.vocabularyEventBinder.setController(this);
    }

    async show(family="nature et environnement") {
        const vocabulary = await this.vocabularyModel.getVocabulary();
        const vocabularyByCategories = await this.vocabularyModel.getVocabularyByCategories();
        const vocabularyByFamily = await this.vocabularyModel.getVocabularyByFamily(family);
        const families = await this.vocabularyModel.getFamilies(); 
        this.view.render();
        this.view.renderVocabulary(vocabularyByFamily);
        this.view.renderFilter(families);

        this.seoManager.setTitle('Ecorcerie Gestionnaire - Profil');
        this.vocabularyEventBinder.addEventListeners();
         this.vocabularyEventBinder.addEventListeners();
    }
}