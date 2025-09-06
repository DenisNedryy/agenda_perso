import { HOST } from "../../host.js";

export class VocabularyView {

    render() {
        const el = document.getElementById("root");
        if (el) {
            el.innerHTML = ` 
            <div class="vocabulary">
                <h2>Vocabulary page</h2>
                <div class="vocabulary__content box">
                    <div class="select-vocabulary"></div>
                    <div class="display-vocabulary"></div>   
                </div>
            </div>
            `;
        }
    }

    renderVocabulary(data){
        console.log(data);
        const el = document.querySelector(".select-vocabulary");
        if(el){
            const ul = document.createElement("ul");
            for(let category in data){
                console.log(category);
            }
        }
    }
}

