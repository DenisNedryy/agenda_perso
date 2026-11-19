const connectionForm = {
    id: "form-connection",
    title: "Connexion",
    passwordAutocomplete: "current-password",
    submitClass: "btn-connection",
    submitLabel: "Se connecter",
    switchPrompt: "Pas encore de compte ?",
    switchLabel: "Créer un compte",
    needsMagicWord: false,
};

const registrationForm = {
    id: "form-inscription",
    title: "Créer un compte",
    passwordAutocomplete: "new-password",
    submitClass: "btn-inscription",
    submitLabel: "Créer mon compte",
    switchPrompt: "Déjà un compte ?",
    switchLabel: "Se connecter",
    needsMagicWord: true,
};

export class AuthView {
    constructor() {
        this.isConnectionPage = true;
        this.feedbackTimeout = null;
    }

    render() {
        const root = document.getElementById("root");
        if (!root) return;

        if (this.isConnectionPage) {
            this.renderConnectionPage(root);
        } else {
            this.renderInscriptionPage(root);
        }
    }

    renderConnectionPage(root) {
        this.renderForm(root, connectionForm);
    }

    renderInscriptionPage(root) {
        this.renderForm(root, registrationForm);
    }

    renderForm(root, form) {
        if (!root) return;

        const magicWordField = form.needsMagicWord
            ? `
                <div class="form-group">
                    <label for="auth-magic-word">Mot magique</label>
                    <input id="auth-magic-word" type="text" name="magicWord" autocomplete="off">
                </div>
            `
            : "";

        root.innerHTML = `
            <div class="auth auth--card">
                <section class="auth__card" aria-labelledby="auth-title">
                    <div class="form__header">
                        <p class="auth__brand">NABOO</p>
                        <h1 id="auth-title" class="auth__title">${form.title}</h1>
                    </div>

                    <form id="${form.id}" class="auth__form" method="post">
                        <div class="form__body">
                            <div class="form-group">
                                <label for="auth-name">Identifiant</label>
                                <input
                                    id="auth-name"
                                    type="text"
                                    name="name"
                                    autocomplete="username"
                                    autocapitalize="none"
                                    spellcheck="false"
                                >
                            </div>

                            <div class="form-group">
                                <label for="auth-password">Mot de passe</label>
                                <input
                                    id="auth-password"
                                    type="password"
                                    name="password"
                                    autocomplete="${form.passwordAutocomplete}"
                                >
                            </div>

                            ${magicWordField}
                        </div>

                        <div class="form__footer">
                            <button
                                type="submit"
                                class="btn ${form.submitClass} auth__submit"
                            >${form.submitLabel}</button>

                            <p class="auth__switch">
                                ${form.switchPrompt}
                                <button
                                    type="button"
                                    class="bold toggleSign auth__toggle"
                                >${form.switchLabel}</button>
                            </p>

                            <div class="form__footer__answer" aria-live="polite" aria-atomic="true"></div>
                        </div>
                    </form>
                </section>
            </div>
        `;
    }

    showSuccess(message) {
        this.showFeedback(message, "success", "fa-check");
    }

    showError(message) {
        this.showFeedback(message, "error", "fa-triangle-exclamation");
    }

    showFeedback(message, status, iconClass) {
        const answer = document.querySelector("#root .auth--card .form__footer__answer");
        if (!answer) return;

        clearTimeout(this.feedbackTimeout);
        answer.classList.remove("success", "error");
        answer.classList.add(status);

        const icon = document.createElement("i");
        icon.className = `fa-solid ${iconClass}`;
        icon.setAttribute("aria-hidden", "true");

        const text = document.createElement("p");
        text.textContent = message;
        answer.replaceChildren(icon, text);

        this.feedbackTimeout = setTimeout(() => {
            answer.classList.remove(status);
            answer.replaceChildren();
        }, 2000);
    }
}