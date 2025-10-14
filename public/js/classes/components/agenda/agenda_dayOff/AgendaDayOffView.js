export class AgendaDayOffView {

    render() {
        const el = document.querySelector(".agendaContent");
        if (el) {
            el.innerHTML = "";

            const daysWeek = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

            const ul = document.createElement("ul");
            ul.className = "agendaContent__weekDays";
            daysWeek.forEach((day) => {
                const li = document.createElement("li");
                const box = document.createElement("div");
                box.className = "blueCheckBox";
                const icon = document.createElement("i");
                icon.className = "fa-solid fa-check";
                box.appendChild(icon);
                const dayPara = document.createElement("p");
                dayPara.textContent = day;
                li.appendChild(box);
                li.appendChild(dayPara);
                ul.appendChild(li); 
            });
            el.appendChild(ul);

        }
    }
}