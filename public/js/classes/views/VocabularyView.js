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

    // render uniquement les familles
    renderVocabulary(data) {

        const el = document.querySelector(".select-vocabulary");
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

            const ul = document.createElement("ul");
            for (let category in data) {
                console.log(category);
                const li = document.createElement("li");

                const checkContainer = document.createElement("div");
                const check = document.createElement("div");
                check.className = "vocabulary-check";
                checkContainer.appendChild(check);

                const avatarContainer = document.createElement("div");
                const avatar = document.createElement("img");
                avatar.className = "vocabulary-avatar";
                avatar.setAttribute("src", `${HOST}/api/images/categories/${data[category][0].img_url ? data[category][0].img_url : "smiley"}.png`);
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

                ul.appendChild(li);
            }
            el.appendChild(ul);

        }
    }
}

