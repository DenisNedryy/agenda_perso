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
            const tags = document.createElement("div");
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
            const families = document.createElement("div");
            const titleFamilies = document.createElement("p");
            titleFamilies.textContent = "families";
            families.appendChild(titleFamilies);
            for (let i = 0; i < data.length; i++) {
                const btn = document.createElement("button");
                btn.className = "btn-mini";
                btn.textContent = data[i];
                families.appendChild(btn);
            }

            el.appendChild(families);
        }
    }


    // render uniquement les familles
    renderVocabulary(data) {
        console.log(data);
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


    // render uniquement les familles
    renderVocabulary0(data) {

        const el = document.querySelector(".vocabulary__content__left");
        if (el) {
            const ficheKeys = document.createElement("div");
            ficheKeys.className = "vocabulary-keys";
            ficheKeys.innerHTML = `
            <p>Check</p>
            <p>Avatar</p>
            <p>Category</p>
            <p>Family</p>
            <p>Rate</p>
            `;
            el.appendChild(ficheKeys);
            let cpt = 0;

            const ul = document.createElement("ul");
            for (let category in data) {
                const li = document.createElement("li");
                li.className = "fade-in";

                const checkContainer = document.createElement("div");
                const check = document.createElement("div");
                check.className = "vocabulary-check";
                checkContainer.appendChild(check);

                const avatarContainer = document.createElement("div");
                const avatar = document.createElement("img");
                avatar.className = "vocabulary-avatar";
                console.log(data[category]);
                avatar.setAttribute("src", `${HOST}/api/images/categories/${data[category][0].img_url ? data[category][0].img_url : "smiley.png"}`);
                avatarContainer.appendChild(avatar);

                const nameContainer = document.createElement("div");
                const name = document.createElement("p");
                name.className = "vocabulary-category";
                name.textContent = category;
                nameContainer.appendChild(name);

                const familyContainer = document.createElement("div");
                const family = document.createElement("p");
                family.className = "vocabulary-family";
                family.textContent = data[category][0].family;
                familyContainer.appendChild(family);

                const rateContainer = document.createElement("div");
                const rate = document.createElement("div");
                rate.className = "vocabulary-rate";
                const rateIco = document.createElement("i");
                rateIco.className = "fa-solid fa-star";
                const ratePercentil = document.createElement("p");
                ratePercentil.textContent = "12 %";
                rate.appendChild(rateIco);
                rate.appendChild(ratePercentil);
                rateContainer.appendChild(rate);

                li.appendChild(checkContainer);
                li.appendChild(avatarContainer);
                li.appendChild(nameContainer);
                li.appendChild(familyContainer);
                li.appendChild(rateContainer);

                setTimeout(() => {
                    ul.appendChild(li);
                }, cpt);
                cpt += 100;
            }
            el.appendChild(ul);

        }
    }
}

