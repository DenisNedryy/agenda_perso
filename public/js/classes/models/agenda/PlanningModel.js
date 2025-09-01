export class PlanningModel {

    constructor(dateModel) {
        this.dateModel = dateModel;
    }


    async getPlanning(tasks) {
        return this.dateModel.sortTasksByDate(tasks);
    }

    async getPlanningTasks(tasks) {
        return this.dateModel.sortTasksByDate(tasks.filter((task) => task.type === "tasks"));
    }

    async getPlanningCourses(tasks) {
        return this.dateModel.sortTasksByDate(tasks.filter((task) => task.type === "courses"));
    }

    async getPlanningRdvs(tasks) {
        return this.dateModel.sortTasksByDate(tasks.filter((task) => task.type === "rdvs"));
    }

    async getPlanningEvents(tasks) {
        return this.dateModel.sortTasksByDate(tasks.filter((task) => task.type === "events"));
    }
    
    async getPlanningProjets(tasks) {
        return this.dateModel.sortTasksByDate(tasks.filter((task) => task.type === "projets"));
    }
}