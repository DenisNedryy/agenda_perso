import { HOST } from "../../host.js";

export class VocabularyView {

    render() {
        const el = document.getElementById("root");
        if (el) {
            el.innerHTML = ` 
            <div class="vocabulary">
                <h2>Vocabulary page</h2>
                <div class="vocabulary__content box">
                    <div class="select-vocabulary">
                       
                    </div>
                    <div class="display-vocabulary">
                        <p>sdfsdf</p>
                            <p>sdfsdf</p>

                                <p>sdfsdf</p>

                                    <p>sdfsdf</p>
                                        <p>sdfsdf</p>
                                            <p>sdfsdf</p>
                                                        <p>sdfsdf</p>

                                    <p>sdfsdf</p>
                                        <p>sdfsdf</p>
                                            <p>sdfsdf</p>
                                                        <p>sdfsdf</p>

                                    <p>sdfsdf</p>
                                        <p>sdfsdf</p>
                                            <p>sdfsdf</p>
                    </div>        
                </div>
            </div>
            `;
        }
    }
}

