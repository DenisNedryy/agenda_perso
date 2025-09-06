export class VocabularyModel {

    constructor(vocabularyService) {
        this.vocabularyService = vocabularyService;
    }

    async getVocabulary() {
        const res = await this.vocabularyService.getVocabulary();
        return res.data.vocabulary;
    }

    async getVocabularyByCategories(){
        const res = await this.vocabularyService.getVocabularyByCategories();
        return res.data.vocabulary;
    }
}