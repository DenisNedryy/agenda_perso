export class VocabularyEventBinder {

    constructor() {
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleChange = this.handleChange.bind(this);
        this.boundHandleSubmit = this.handleSubmit.bind(this);
    }

    setController(controller) {
        this.controller = controller;
    }

    addEventListeners() {
        document.removeEventListener('click', this.boundHandleClick);
        document.addEventListener('click', this.boundHandleClick);
        document.removeEventListener('change', this.boundHandleChange);
        document.addEventListener('change', this.boundHandleChange);
        document.removeEventListener('submit', this.boundHandleSubmit);
        document.addEventListener('submit', this.boundHandleSubmit);
    }

    async handleChange(e) {
        // submit family
        const fieldsetFamily = e.target.closest("#fieldset-family");
        const isCategory = this.controller.vocabularyModel.isCategory;
        if (fieldsetFamily) {
            e.preventDefault();
            const family = fieldsetFamily.elements['family'].value;
            const categories = await this.controller.vocabularyModel.getCategoriesNames(family);
            this.controller.vocabularyModel.isNewCategory = false;
            const isNewCategory = this.controller.vocabularyModel.isNewCategory;
            console.log(this.controller.vocabularyModel.isNewCategory);
            this.controller.modalViews.renderSelectCategories(categories, isNewCategory);
        }
    }

    async handleSubmit(e) {
        const formAddModal = e.target.closest("#vocabularyAddModal");
        if (formAddModal) {
            e.preventDefault();
            console.log(formAddModal);
            const family = formAddModal.elements['family'].value;
            const category = formAddModal.elements['category'].value;
            const img = formAddModal.elements['img'].files[0];
            if (!family || family === "" || !category || category === "" || !img) return;
            const options = {
                family: family,
                category: category,
                img: img
            }
            this.controller.vocabularyModel.setUpVocabularyAddOptions(options);
            this.controller.modalViews.renderVocabularyForm(options);
        }
    }

    async handleClick(e) {

        // ajouter un mot de vocabulaire
        const btnVocabularyAdd = e.target.closest(".btn-vocabulary-add");
        if (btnVocabularyAdd) {
            e.preventDefault();
            const form = e.target.closest("form");
            const frName = form.elements['name-fr'].value;
            const ukName = form.elements['name-uk'].value;
            const options = this.controller.vocabularyModel.vocabularyAddOptions;
            options.uk_name = ukName;
            options.fr_name = frName;
            // envoyer 
            const res = await this.controller.vocabularyModel.addVocabulary(options);
            form.reset();
        }

        // add base vocabulary
        const vocabulary = e.target.closest(".addBaseVocabulary");
        if (vocabulary) {
            const data = this.controller.data;
            await this.controller.vocabularyModel.init(data);
            this.controller.show();
        }

        // family
        const familyContainer = e.target.closest(".vocabulary__families");
        if (familyContainer && e.target.classList.contains("btn-mini-white")) {
            const family = e.target.getAttribute("data-name");
            this.controller.vocabularyModel.end();
            this.controller.show(family);
        }

        // category
        const fiche = e.target.closest(".vocFiche");
        if (fiche) {
            this.controller.vocabularyModel.end();
            const category = fiche.getAttribute("data-name");
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            const options = this.controller.vocabularyModel.vocabularyOptions;
            this.controller.view.renderCategory(oneVocabularyCategory, { options });
        }

        // traduction
        const flashCard = e.target.closest(".category__body");
        if (flashCard) {
            this.controller.vocabularyModel.openTraduction();
            const category = e.target.closest(".vocabulary__content").getAttribute("data-category");
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            const options = this.controller.vocabularyModel.vocabularyOptions;
            this.controller.view.renderCategory(oneVocabularyCategory, { options });
            const isEnglishMode = this.controller.vocabularyModel.vocabularyOptions.isFrToUk;
            if (isEnglishMode && this.controller.vocabularyModel.vocabularyOptions.isSounds) {
                const text = oneVocabularyCategory[this.controller.vocabularyModel.vocabularyOptions.index].ukName;
                this.controller.debouncer.execute(() => {
                    this.controller.vocabularyModel.speak(text);
                })

            }
        }

        // next
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

        // switch language
        const btnLg = e.target.classList.contains("switch-lg");
        if (btnLg) {
            this.controller.vocabularyModel.switchLanguage();
            const families = await this.controller.vocabularyModel.getFamilies();
            const options = this.controller.vocabularyModel.vocabularyOptions;
            this.controller.view.renderFilter(families, options);
            const category = document.querySelector(".vocabulary__content").getAttribute("data-category");
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            this.controller.view.renderCategory(oneVocabularyCategory, { options });
        }

        // toggle sounds
        const btnSound = e.target.classList.contains("toggle-sounds");
        if (btnSound) {
            this.controller.vocabularyModel.toggleSounds();
            const families = await this.controller.vocabularyModel.getFamilies();
            const options = this.controller.vocabularyModel.vocabularyOptions;
            this.controller.view.renderFilter(families, options);
            const category = document.querySelector(".vocabulary__content").getAttribute("data-category");
            const oneVocabularyCategory = await this.controller.vocabularyModel.getOneVocabularyCategory(category);
            this.controller.view.renderCategory(oneVocabularyCategory, { options });
        }

        // render modal container
        const btnModalContainer = e.target.closest(".addVocabulary");
        if (btnModalContainer) {
            this.controller.vocabularyModel.resetVocabularyAddOptions();
            const familiesNames = await this.controller.vocabularyModel.getFamilies();
            this.controller.modalViews.renderModalContainer();
            this.controller.modalViews.renderBodyFamilyForm();
            const isNewFamily = this.controller.vocabularyModel.isNewFamily;
            this.controller.modalViews.renderSelectFamilies(familiesNames, isNewFamily);
            const categories = await this.controller.vocabularyModel.getCategoriesNames();
            const isNewCategory = this.controller.vocabularyModel.isNewCategory;
            this.controller.modalViews.renderSelectCategories(categories, isNewCategory);
        }

        const familyLink = e.target.closest(".familyLink");
        if (familyLink) {
            this.controller.vocabularyModel.isNewFamily = !this.controller.vocabularyModel.isNewFamily;
            this.controller.vocabularyModel.isCategory = true;
            const isNewFamily = this.controller.vocabularyModel.isNewFamily;
            const familiesNames = await this.controller.vocabularyModel.getFamilies();
            this.controller.modalViews.renderSelectFamilies(familiesNames, isNewFamily);
            const isNewCategory = this.controller.vocabularyModel.isCategory;
            const categories = await this.controller.vocabularyModel.getCategoriesNames();
            this.controller.modalViews.renderSelectCategories(categories, isNewCategory);
        }

        const categoryLink = e.target.closest(".categoryLink");
        if (categoryLink) {
            this.controller.vocabularyModel.isCategory = !this.controller.vocabularyModel.isCategory;
            const isNewCategory = this.controller.vocabularyModel.isCategory;
            const categories = await this.controller.vocabularyModel.getCategoriesNames();
            this.controller.modalViews.renderSelectCategories(categories, isNewCategory);
        }

    }

}