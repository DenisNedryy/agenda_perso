export class HomeView {

    render() {
        const el = document.getElementById("root");
        if (el) {
            el.innerHTML = `
            <div class="home">

                <div class="banner bgImg-blue">
                    <div class="banner__container">
                          <div class="banner__text">
                             <p class="banner__text--title">I'm doing my part</p>
                             <p>They’re doing their part. Are you? Join the Mobile Infantry and save the world. Service guarantees citizenship.</p>
                            <p>Would you like to now more ?</p>                         
                             </div>
                          <div class="banner__container__button">
                            <div class="btn">Join</div>
                          </div>
                    </div>
                </div>

                <div class="home__webSites">
                    <p class="home__webSites--title">Sites webs</p>
                    <div class="home__webSites--container">
                        <a href="https://www.youtube.com/" target="_blank">
                             <div>
                                <img src="/public/assets/images/icons/youtube.png"/>
                                 <p>Youtube</p>
                            </div>
                        </a>

                        <a href="https://chatgpt.com" target="_blank">
                             <div>
                                <img src="/public/assets/images/icons/gpt.webP"/>
                                 <p>Gpt</p>
                            </div>
                        </a>

                        <a href="https://box-revision-jaguar.vercel.app" target="_blank">
                             <div>
                                <img src="/public/assets/images/icons/leiner.png"/>
                                 <p>Box-revision</p>
                            </div>
                        </a>

                        <a href="https://memorywords.netlify.app" target="_blank">
                             <div>
                                <img src="/public/assets/images/icons/english.png"/>
                                 <p>Memo-words</p>
                            </div>
                        </a>

                        <a href="https://codepen.io/pen" target="_blank">
                             <div>
                                <img src="/public/assets/images/icons/codepen.png"/>
                                 <p>Code-pen</p>
                            </div>
                        </a>

                        <a href="https://www.greatfrontend.com" target="_blank">
                             <div>
                                <img src="/public/assets/images/icons/gfe.png"/>
                                 <p>GFE</p>
                            </div>
                        </a>

                        <a href="https://www.gmx.fr" target="_blank">
                             <div>
                                <img src="/public/assets/images/icons/gmx.png"/>
                                 <p>GMX</p>
                            </div>
                        </a>

                        <a href="https://www.wawacity.tokyo" target="_blank">
                             <div>
                                <img src="/public/assets/images/icons/pirate.png"/>
                                 <p>Wawa</p>
                            </div>
                        </a>
                
                    </div>
                </div>

                <div class="home__bodyContainer">
   
                   
                </div>
            </div>
            `;
        }
    }
} 