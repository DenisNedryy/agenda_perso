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
            this.controller.vocabularyModel.end();
            const category = fiche.getAttribute("data-name");
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            const options = this.controller.vocabularyModel.vocabularyOptions;
            this.controller.view.renderCategory(oneVocabularyCategory, { options });
        }

        const start = e.target.closest(".btn-vocabulary-start");
        if (start) {
            const category = e.target.closest(".vocabulary__content").getAttribute("data-category");
            this.controller.vocabularyModel.start();
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            const options = this.controller.vocabularyModel.vocabularyOptions;
            this.controller.view.renderCategory(oneVocabularyCategory, { options });
        }

        const flashCard = e.target.closest(".flashCard");
        if (flashCard) {
            this.controller.vocabularyModel.toggleTraduction();
            const category = e.target.closest(".vocabulary__content").getAttribute("data-category");
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            const options = this.controller.vocabularyModel.vocabularyOptions;
            this.controller.view.renderCategory(oneVocabularyCategory, { options });
        }

        const btnFlashCard = e.target.closest(".btn-flashCard");
        if (btnFlashCard) {
            const category = e.target.closest(".vocabulary__content").getAttribute("data-category");
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            const index = this.controller.vocabularyModel.vocabularyOptions.index;
            if (index + 1 === oneVocabularyCategory.length) {
                const answer = btnFlashCard.classList.contains("btn-flashCard-yes") ? true : false;
                this.controller.vocabularyModel.pushVocabularySession(answer, oneVocabularyCategory[index]);
                this.controller.vocabularyModel.next();
                await this.controller.vocabularyModel.updateategoryPertencil(category); 
                this.controller.vocabularyModel.end();
                this.controller.show();
                return;
            }
            const answer = btnFlashCard.classList.contains("btn-flashCard-yes") ? true : false;
            this.controller.vocabularyModel.pushVocabularySession(answer, oneVocabularyCategory[index]);
            this.controller.vocabularyModel.next();
            const options = this.controller.vocabularyModel.vocabularyOptions;
            this.controller.view.renderCategory(oneVocabularyCategory, { options });
        }

    }

}