export class VocabularyModel {

    constructor(vocabularyService) {
        this.vocabularyService = vocabularyService;
        this.vocabularyOptions = {
            index: 0,
            isStarted: false,
            isVerso: false,
            isFrToUk: true
        }
        this.vocabularySession = []; // {uuid:string, success:false}
    }

    start() {
        this.vocabularySession = [];
        this.resetIndex();
        this.vocabularyOptions.isStarted = true;
        this.closeTraduction();
    }

    next() {
        this.incrementIndex();
        this.vocabularyOptions.isVerso = false;
    }

    end() {
        this.vocabularyOptions.isStarted = false;
        this.index = 0;
        this.isVerso = false;
        this.isStarted = false;

    }

    toggleTraduction() {
        this.vocabularyOptions.isVerso = !this.vocabularyOptions.isVerso;
    }

    closeTraduction() {
        this.vocabularyOptions.isVerso = false;
    }

    incrementIndex() {
        this.vocabularyOptions.index++;
    }
    resetIndex() {
        this.vocabularyOptions.index = 0;
    }

    switchLanguage() {
        this.vocabularyOptions.isFrToUk = !this.vocabularyOptions.isFrToUk;
    }
    pushVocabularySession(success, vocabulary) {
        this.vocabularySession.push({ uuid: vocabulary.uuid, success: success });
    }
    resetVocabularySession() {
        this.vocabularySession = [];
    }

    async getVocabulary() {
        const res = await this.vocabularyService.getVocabulary();
        return res.data.vocabulary;
    }

    async getOneVocabularyCategory(category) {
        const res = await this.vocabularyService.getOneVocabularyCategory(category);
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

    async updateategoryPertencil(category) {
        const res = await this.vocabularyService.updateategoryPertencil(this.vocabularySession, category);
        console.log(res);
    }

    async getCategories() {
        const res = await this.vocabularyService.getCategories();
        return res.data.categories;
    }

    async getFamiliesPercentils(family) {
        const categories = await this.getCategories();
        console.log(categories);
        const families = [
            { name: "maison et vie quotidienne", data: ["house", "bedroom", "kitchen", "tools", "clothing"] },
            { name: "nature et environnement", data: ["animals", "vegetation", "fruits", "vegetable", "weather"] },
            { name: "culture, arts et divertissements", data: ["arts", "cinema", "entertainment", "education", "sport"] },
            { name: "voyages et lieux", data: ["places", "city", "transport", "travel", "travelTerms"] },
            { name: "corps et émotions", data: ["bodyParts", "internalBodyParts", "emotions", "orientation", "connectives"] },
            { name: "langue et grammaire", data: ["irregularVerbs"] },
            { name: "travail et vie professionnelle", data: ["work", "informatique"] }
        ];

        const myFamily = families.filter((cell)=>cell.name===family);
        const allCategories = myFamily.data;
        

    }

}