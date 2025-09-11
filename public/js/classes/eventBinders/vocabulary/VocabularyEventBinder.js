export class VocabularyEventBinder {

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
        const familyContainer = e.target.closest(".vocabulary__families");
        if (familyContainer && e.target.classList.contains("btn-mini")) {
            const family = e.target.getAttribute("data-name");
            this.controller.show(family);
        }

        const fiche = e.target.closest(".vocFiche"); 
        if (fiche) {
            const category = fiche.getAttribute("data-name");
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            this.controller.view.renderCategory(oneVocabularyCategory);
        }
    }

}