import { HOST } from "../../host.js";

export class VocabularyView {

    render() {
        const el = document.getElementById("root");
        if (el) {
            el.innerHTML = ` 
            <div class="vocabulary">
                <div class="vocabulary__content box">
                    <div class="vocabulary__content__left">
                    <div class="circleProgressBar">
                    
                    </div>
                    </div>
                </div>
                         <div class="vocabulary__content__right box">
                        <div class="vocabulary__content__right__header">
                            <p class="">Filter</p>
                            <p class="">Display</p>
                        </div>
                        <div class="vocabulary__content__right__body"></div>
                    </div>   
            </div>
            `;
        }
    }

    renderFilter(data) {
        const el = document.querySelector(".vocabulary__content__right__body");
        if (el) {
            // tags
            const tags = document.createElement("div");
            tags.className = "vocabulary__tags";
            const titleTags = document.createElement("p");
            titleTags.textContent = "tags";
            tags.appendChild(titleTags);
            const sorted = document.createElement("button");
            sorted.className = "btn-mini";
            sorted.textContent = "sorted";
            tags.appendChild(sorted);
            const frToUk = document.createElement("button");
            frToUk.className = "btn-mini";
            frToUk.textContent = "fr to uk";
            tags.appendChild(frToUk);
            el.appendChild(tags);
            // families
            const families = document.createElement("div");
            families.className = "vocabulary__families";
            const titleFamilies = document.createElement("p");
            titleFamilies.textContent = "families";
            families.appendChild(titleFamilies);
            for (let i = 0; i < data.length; i++) {
                const btn = document.createElement("button");
                btn.className = "btn-mini";
                btn.setAttribute("data-name", data[i]);
                btn.textContent = data[i];
                families.appendChild(btn);
            }

            el.appendChild(families);
        }
    }


    // render uniquement les familles
    renderVocabulary(data) {
        const percentage = 50;

        const el = document.querySelector(".vocabulary__content__left");
        if (el) {
            let cpt = 0;
            const keys = Object.keys(data);
            //header
            const vocHeader = document.createElement("div");
            vocHeader.className = "vocabulary__content__left__header";
            const title = document.createElement("p");
            title.textContent = data[keys[0]][0].family;
            vocHeader.appendChild(title);
            el.appendChild(vocHeader);
            //body
            const vocBody = document.createElement("div");
            vocBody.className = "vocabulary__content__left__body";

            const vocBodyLeft = document.createElement("div");
            vocBodyLeft.className = "vocabulary__content__left__body__left";

            // progress circle bar
            const progressCircle = document.createElement("div");
            progressCircle.className = "progress-circle";
            const circle = document.createElement("div");
            circle.className = "circle";
            circle.style.background = `conic-gradient(rgb(0, 95, 242) 0 ${percentage}%, #e0e0e0 ${percentage}%)`;
            const insideCircle = document.createElement("div");
            insideCircle.className = "inside-circle";
            insideCircle.textContent = `${percentage} %`;
            circle.appendChild(insideCircle);
            progressCircle.appendChild(circle);
            vocBodyLeft.appendChild(progressCircle);

            const cpbComment = document.createElement("p");
            cpbComment.textContent = "Words learnt";
            vocBodyLeft.appendChild(cpbComment);

            vocBody.appendChild(vocBodyLeft);

            const vocBodyRight = document.createElement("div");
            vocBodyRight.className = "vocabulary__content__left__body__right";
            for (let i = 0; i < keys.length; i++) {
                const fiche = document.createElement("div");
                fiche.setAttribute("data-name", keys[i]);
                fiche.className = "vocFiche";
                const ficheTop = document.createElement("div");
                ficheTop.className = "vocFiche__top";
                const img = document.createElement("img");
                img.setAttribute("src", `${HOST}/api/images/categories/${data[keys[i]][0].img_url}`);
                ficheTop.appendChild(img);
                const category = document.createElement("p");
                category.textContent = keys[i];
                ficheTop.appendChild(category);
                fiche.appendChild(ficheTop);

                const ficheBottom = document.createElement("div");
                ficheBottom.className = "vocFiche__bottom";
                const progressBar = document.createElement("div");
                progressBar.className = "progress-bar";
                const rectangle = document.createElement("div");
                rectangle.className = "rectangle";
                progressBar.appendChild(rectangle);
                ficheBottom.appendChild(progressBar);
                const percentage = document.createElement("p");
                percentage.textContent = "24 %";
                ficheBottom.appendChild(percentage);
                fiche.appendChild(ficheBottom);

                vocBodyRight.appendChild(fiche);


            }

            vocBody.appendChild(vocBodyRight);

            el.appendChild(vocBody);

        }
    }

    renderCategory(data, index, isStarted = false, isVerso = false, isFrToUk = true) {
        console.log(data);
        const el = document.querySelector(".vocabulary__content");
        if (el) {
            el.innerHTML = "";
            // header
            const header = document.createElement("div");
            header.className = "category__header";
            // header - left
            const headerLeft = document.createElement("div");
            headerLeft.className = "category__header__left";
            const img = document.createElement("img");
            img.setAttribute("src", `${HOST}/api/images/categories/${data[0].img_url}`);
            headerLeft.appendChild(img);
            const category = document.createElement("p");
            category.textContent = data[0].category;
            headerLeft.appendChild(category);
            header.appendChild(headerLeft);
            // header right
            const headerRight = document.createElement("p");
            headerRight.textContent = `1/50`;
            header.appendChild(headerRight)

            el.appendChild(header);
            // body
            const body = document.createElement("div");
            body.className = "category__body";
            if (!isStarted) {
                const start = document.createElement("button");
                start.className = "btn-vocabulary-start btn";
                start.textContent = "Start";
                body.appendChild(start);
            }
            if (isStarted) {
                const name = document.createElement("p");
                name.className = "flashCard__title";
                body.appendChild(name);

                if (isVerso) {
                    const traduction = document.createElement("p");
                    traduction.className = "flashCard__traduction";
                    traduction.textContent = `${isFrToUk ? data[index].frName : data[index].ukName}`;
                    body.appendChild(traduction);
                }
            }
            el.appendChild(body);
            // footer
            const footer = document.createElement("div");
            footer.className = "category__footer";

            const vocabularyMsg = document.createElement("p");
            vocabularyMsg.className = "category__footer__msg";
            vocabularyMsg.textContent = "did you got the right answer ? ";
            footer.appendChild(vocabularyMsg);
            const btnContainer = document.createElement("div");
            btnContainer.className = "category__footer__buttons";
            const btnNo = document.createElement("button");
            btnNo.className = "btn btn-no";
            btnNo.textContent = "No";
            btnContainer.appendChild(btnNo);
            const btnYes = document.createElement("button");
            btnYes.className = "btn btn-yes";
            btnYes.textContent = "Yes";
            btnContainer.appendChild(btnYes);
            footer.appendChild(btnContainer);

            el.appendChild(footer);
        }
    }



}

