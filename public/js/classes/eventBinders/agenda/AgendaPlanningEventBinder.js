export class AgendaPlanningEventBinder {

    constructor() {
        this.boundHandleClickTask = this.handleClickTask.bind(this);
    }

    setController(controller) {
        this.controller = controller;
    }

    addEventListeners() {
        document.removeEventListener('click', this.boundHandleClickTask);
        document.addEventListener('click', this.boundHandleClickTask);
    }

    async handleClickTask(e) {

        if (e.target.classList.contains("taskFilter--tasks")) {
            const auth = await this.controller.authServices.getAuth();
            const userSelectedRes = await this.controller.authServices.getUserById(this.controller.authServices.userIdSelected);
            const userSelected = userSelectedRes.data.user;
            const tasksRes = await this.controller.taskServices.getTasks();
            const tasks = tasksRes.data.tasks;
            const tasksByUser = await this.controller.agendaWeekModel.getTasksFiltered(auth, userSelected, tasks);
            const tasksByUserSorted = await this.controller.agendaPlanning.getPlanningTasks(tasksByUser);
            this.controller.planningView.render(tasksByUserSorted);
            this.controller.planningView.renderAll(tasksByUserSorted);
            this.addEventListeners();
        }

        else if (e.target.classList.contains("taskFilter--all")) {
            const auth = await this.controller.authServices.getAuth();
            const userSelectedRes = await this.controller.authServices.getUserById(this.controller.authServices.userIdSelected);
            const userSelected = userSelectedRes.data.user;
            const tasksRes = await this.controller.taskServices.getTasks();
            const tasks = tasksRes.data.tasks;
            const tasksByUser = await this.controller.agendaWeekModel.getTasksFiltered(auth, userSelected, tasks);
            const tasksByUserSorted = await this.controller.agendaPlanning.getPlanning(tasksByUser);
            this.controller.planningView.render(tasksByUserSorted);
            this.controller.planningView.renderAll(tasksByUserSorted);
            this.addEventListeners();
        }

        else if (e.target.classList.contains("taskFilter--courses")) {
            const auth = await this.controller.authServices.getAuth();
            const userSelectedRes = await this.controller.authServices.getUserById(this.controller.authServices.userIdSelected);
            const userSelected = userSelectedRes.data.user;
            const tasksRes = await this.controller.taskServices.getTasks();
            const tasks = tasksRes.data.tasks;
            const tasksByUser = await this.controller.agendaWeekModel.getTasksFiltered(auth, userSelected, tasks);
            const tasksByUserSorted = await this.controller.agendaPlanning.getPlanningCourses(tasksByUser);
            this.controller.planningView.render(tasksByUserSorted);
            this.controller.planningView.renderAll(tasksByUserSorted);
            this.addEventListeners();
        }

        else if (e.target.classList.contains("taskFilter--rdvs")) {
            const auth = await this.controller.authServices.getAuth();
            const userSelectedRes = await this.controller.authServices.getUserById(this.controller.authServices.userIdSelected);
            const userSelected = userSelectedRes.data.user;
            const tasksRes = await this.controller.taskServices.getTasks();
            const tasks = tasksRes.data.tasks;
            const tasksByUser = await this.controller.agendaWeekModel.getTasksFiltered(auth, userSelected, tasks);
            const tasksByUserSorted = await this.controller.agendaPlanning.getPlanningRdvs(tasksByUser);
            this.controller.planningView.render(tasksByUserSorted);
            this.controller.planningView.renderAll(tasksByUserSorted);
            this.addEventListeners();
        }

        else if (e.target.classList.contains("taskFilter--events")) {
            const auth = await this.controller.authServices.getAuth();
            const userSelectedRes = await this.controller.authServices.getUserById(this.controller.authServices.userIdSelected);
            const userSelected = userSelectedRes.data.user;
            const tasksRes = await this.controller.taskServices.getTasks();
            const tasks = tasksRes.data.tasks;
            const tasksByUser = await this.controller.agendaWeekModel.getTasksFiltered(auth, userSelected, tasks);
            const tasksByUserSorted = await this.controller.agendaPlanning.getPlanningEvents(tasksByUser);
            this.controller.planningView.render(tasksByUserSorted);
            this.controller.planningView.renderAll(tasksByUserSorted);
            this.addEventListeners();
        }

        else if (e.target.classList.contains("taskFilter--projects")) {
            const auth = await this.controller.authServices.getAuth();
            const userSelectedRes = await this.controller.authServices.getUserById(this.controller.authServices.userIdSelected);
            const userSelected = userSelectedRes.data.user;
            const tasksRes = await this.controller.taskServices.getTasks();
            const tasks = tasksRes.data.tasks;
            const tasksByUser = await this.controller.agendaWeekModel.getTasksFiltered(auth, userSelected, tasks);
            const tasksByUserSorted = await this.controller.agendaPlanning.getPlanningProjets(tasksByUser);
            this.controller.planningView.render(tasksByUserSorted);
            this.controller.planningView.renderAll(tasksByUserSorted); 
            this.addEventListeners();
        }

        // spaced_Repetition
        if(e.target.classList.contains("btn-nextStep")){
            const taskId = e.target.closest(".modalContent").getAttribute("data-id");
            const res = await this.controller.spaceRepService.updateSpaceRepetition(taskId);
            console.log(res);
        }
    }


}