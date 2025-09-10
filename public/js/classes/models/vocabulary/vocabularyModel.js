export class VocabularyModel {

    constructor(vocabularyService) {
        this.vocabularyService = vocabularyService;
    }

    async getVocabulary() {
        const res = await this.vocabularyService.getVocabulary();
        return res.data.vocabulary;
    }

    async getVocabularyByCategories() {
        const res = await this.vocabularyService.getVocabularyByCategories();
        return res.data.vocabulary;
    }
    async getVocabularyByFamily(family) {
        const res = await this.vocabularyService.getVocabularyByFamily(family);
        return res.data.vocabulary;
    }
    async getFamilies() {
        const res = await this.vocabularyService.getFamilies();
        return res.data.families;
    }

}