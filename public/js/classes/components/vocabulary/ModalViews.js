export class ModalViews {

    renderModalContainer() {
        const el = document.querySelector(".vocabulary__content");
        if (el) {
            el.innerHTML = `
            <div class="modalViewContainer">
                <div class="modalViewContainer__header"></div>
                <div class="modalViewContainer__body">
                    <div class="modalViewContainer__body__family"></div>
                    <div class="modalViewContainer__body__category"></div>
                    <div class="modalViewContainer__body__vocabulary"></div>
                </div>
                <div class="modalViewContainer__footer"></div>
            </div>
            `;
        }
    }

    renderSelectFamilies(families) {
        const el = document.querySelector(".modalViewContainer__body__family");
        if (el) {
            el.innerHTML = "";
            const form = document.createElement("form");
            form.id = "form-family";
            const familyLabel = document.createElement("label");
            familyLabel.textContent = "Family";
            form.appendChild(familyLabel);
            const familySelect = document.createElement("select");
            familySelect.id = "familySelect";
            familySelect.name = "family";
            families.forEach((family) => {
                const option = document.createElement("option");
                option.value = family;
                option.textContent = family;
                familySelect.appendChild(option);
            });
            form.appendChild(familySelect);
            const familyLink = document.createElement("p");
            familyLink.className = "familyLink";
            familyLink.textContent = "+ new family";
            form.appendChild(familyLink);
            const familyInput = document.createElement("input");
            familyInput.className = "familyInput unvisible";
            form.appendChild(familyInput);
            // const btnSubmit = document.createElement("button");
            // btnSubmit.type="submit";
            // btnSubmit.textContent = "Suivant";
            // form.appendChild(btnSubmit);
            el.appendChild(form);
        }
    }

    renderSelectCategories(categories) {
        const el = document.querySelector(".modalViewContainer__body__category");
        if (el) {
            el.innerHTML = "";
            const form = document.createElement("form");
            form.id = "form-category";
            const categoryLabel = document.createElement("label");
            categoryLabel.textContent = "Category";
            form.appendChild(categoryLabel);
            const cateorySelect = document.createElement("datalist");
            cateorySelect.id = "old-categories";
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                cateorySelect.appendChild(option);
            });
            form.appendChild(cateorySelect);
            const categoryInput = document.createElement("input");
            categoryInput.name = "category";
            categoryInput.setAttribute("list", "old-categories");
            form.appendChild(categoryInput);
            el.appendChild(form);

        }
    }

}