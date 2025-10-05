export class ModalView {


    renderAlertsLength(alerts) {
        console.log(alerts.length);
        const el = document.querySelector(".header__right__alerts--bells--status");
        if (el) {
            el.textContent = alerts.length === 0 ? "" : alerts.length;
            if (alerts.length > 0) {
                el.classList.add("ball-red");
            } else {
                el.classList.remove("ball-red");
            }
        }
    }

    open() {
        const el = document.querySelector(".popUp");
        if (el) {
            el.classList.remove("unvisible");
        }
    }

    close() {
        const el = document.querySelector(".popUp");
        if (el) {
            el.classList.add("unvisible");
        }
    }

    toggle() {
        const el = document.querySelector(".popUp");
        if (el) {
            el.classList.toggle("unvisible");
        }
    }

    renderAlertsModal(alerts) {
        const el = document.querySelector(".popUp");
        if (el) {
            this.toggle();
            el.innerHTML = `
            <div class="popUp__header">
            <div>
                 <i class="fa-solid fa-bell"></i>
                 <div class="popUp__header__length">${alerts.length}</div>
                 </div>
            </div>
            <div class="popUp__body"></div>
            <idv class="popUp__footer"></div>
            `;
        }
    }
}