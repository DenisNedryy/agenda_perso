export class ProjetsView {

    render(data) {
        const el = document.querySelector(".home__bodyContainer__left__projets__projetsContainer");
        if (el) {
            const ul = document.createElement("ul");
            ul.id = "todo";
            ul.className = "list";
            for (let i = 0; i < data.length; i++) {
                const li = document.createElement("li");
                li.setAttribute("data-id", data[i].id);
         const number = document.createElement("span");
number.className = "project-number";
number.textContent = String(data[i].sort_order).padStart(2, "0");

const name = document.createElement("span");
name.textContent = data[i].name;

li.append(number, name);
                ul.appendChild(li);
            }
            el.appendChild(ul);
        }
    }

}