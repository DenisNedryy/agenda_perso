export class HomeView {

    render() {
        const el = document.getElementById("root");

        if (el) {
            el.innerHTML = `
                <div class="home">



                    <div class="home__bodyContainer">
                        <h2>Tableau de bord</h2>
                        <div class="home__bodyContainer__left box"> 
                            <h2> <i class="fa-solid fa-layer-group"></i> Mes projets</h2>

                            <div class="home__bodyContainer__left__projets">
                                <div class="home__bodyContainer__left__projets__projetsContainer"> 
                                </div> 
                            </div>


                        </div>

                        <div class="home__bodyContainer__right box"> 

                            <div class="home__bodyContainer__right__findTasks">
                                <div class="home__bodyContainer__right__findTasks__header">
                                    <div class="home__bodyContainer__right__findTasks__header__left">
                                        <h2> <i class="fa-solid fa-list"></i> Mes tâches</h2>
                                    </div>
                                    <div class="home__bodyContainer__right__findTasks__header__right">
                                    <div class="findTasksSearch">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                        <input class="findTasksSearchInput" type="search" placeholder="Rechercher une tâche..." />
                                    </div>

                                        <select class="findTasksType">
                                            <option value="all">Tous les types</option> 
                                            <option value="tasks">Tâches</option>
                                            <option value="movies">Films</option>
                                            <option value="courses">Courses</option>
                                            <option value="rdvs">RDVs</option>
                                            <option value="events">Events</option>
                                            <option value="projets">Projets</option>
                                            <option value="alert">Alerts</option>
                                            <option value="dayOff">Day Off</option>
                                        </select>

                                        <select class="findTasksSort">
                                            <option value="recent">Plus récentes</option>
                                            <option value="oldest">Plus anciennes</option>
                                        </select>
                                    </div>
    

                                    
                    
                                </div>
                                <div class="home__bodyContainer__right__findTasks__body">
                                <div class="home__bodyContainer__right__findTasks__body__inputs">

                                    <div class="findTasksFilters">


                                    </div>
                                </div>
                                    <div class="home__bodyContainer__right__findTasks__body__content"></div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            `;
        }
    }
}