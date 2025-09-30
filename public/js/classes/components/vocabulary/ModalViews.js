export class ModalViews {

    renderModalContainer() {
        const el = document.querySelector(".vocabulary__content");
        if (el) {
            el.innerHTML = `
            <div class="modalViewContainer">
                <div class="modalViewContainer__header"></div>
                <div class="modalViewContainer__body">
                    <div class="modalViewContainer__body__family"></div>
                </div>
                <div class="modalViewContainer__footer"></div>
            </div>
            `;
        }
    }

    renderBodyFamilyForm() {
        const el = document.querySelector(".modalViewContainer__body__family");
        if (el) {
            el.innerHTML = `
                    <form id="vocabularyAddModal">
                         <div class="vocabularyAddModal__family"></div>
                        <div class="vocabularyAddModal__category"></div>
                        <button type="submit">Submit</button>
                    </form>
            `;
        }
    }

    renderVocabularyForm(options) {
        const el = document.querySelector(".modalViewContainer__body__family");
        if (el) {
            console.log(options.img.name);
        }
    }

    renderSelectFamilies(families, isNewFamily) {
        const el = document.querySelector(".vocabularyAddModal__family");
        if (el) {
            el.innerHTML = "";
            const fieldset = document.createElement("fieldset");
            fieldset.id = "fieldset-family";
            const familyLabel = document.createElement("label");
            familyLabel.textContent = "Family";
            fieldset.appendChild(familyLabel);
            if (!isNewFamily) {
                const familySelect = document.createElement("select");
                familySelect.id = "familySelect";
                familySelect.name = "family";
                families.forEach((family) => {
                    const option = document.createElement("option");
                    option.value = family;
                    option.textContent = family;
                    familySelect.appendChild(option);
                });
                fieldset.appendChild(familySelect);
            } else {
                const familyInput = document.createElement("input");
                familyInput.name = "family";
                familyInput.className = "familyInput";
                fieldset.appendChild(familyInput);
            }
            const familyLink = document.createElement("p");
            familyLink.className = "familyLink";
            familyLink.textContent = `${isNewFamily ? "+ Old families" : "+ New family"}`;
            fieldset.appendChild(familyLink);

            // const btnSubmit = document.createElement("button");
            // btnSubmit.type="submit";
            // btnSubmit.textContent = "Suivant";
            // form.appendChild(btnSubmit);
            el.appendChild(fieldset);
        }
    }

    renderSelectCategories(categories) {
        const el = document.querySelector(".vocabularyAddModal__category");
        if (el) {
            el.innerHTML = "";
            const fieldset = document.createElement("fieldset");
            fieldset.id = "fieldset-category";
            const categoryLabel = document.createElement("label");
            categoryLabel.textContent = "Category";
            fieldset.appendChild(categoryLabel);


            const cateoryDataList = document.createElement("datalist");
            cateoryDataList.id = "old-categories";
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                cateoryDataList.appendChild(option);
            });
            fieldset.appendChild(cateoryDataList);

            const categoryInput = document.createElement("input");
            categoryInput.name = "category";
            categoryInput.setAttribute("list", "old-categories");
            fieldset.appendChild(categoryInput);

            const img = document.createElement("input");
            img.type = "file";
            img.name = "img";
            fieldset.appendChild(img);

            el.appendChild(fieldset);

        }
    }

}