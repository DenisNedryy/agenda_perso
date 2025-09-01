export class FocusModalView {

    constructor(dateModel) {
        this.dateModel = dateModel;
    }

    render(task) {
        const el = document.querySelector(".modalFocus");
        if (el) {
            const date = new Date(task.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const dayNum = date.getDay();
            el.innerHTML = `
                <div class="modalContent" data-id=${task.id}>
                    <div class="modalContent__header">
                        <i class="fa-solid fa-pencil task-update"></i>
                        <i class="fa-solid fa-trash-can task-delete"></i>
                        <i class="fa-solid fa-xmark task-leave"></i>
                    </div>
                    <div class="modalContent__body">
                    <div class="modalContent__body__name">
                            <div class="boxTitle"> </div>
                                <div>
                                  <p>${task.name} [${task.type}]</p>
                                  <p> ${day} ${this.dateModel.yearMonth[month - 1]} ${year}</p>             
                                </div>
                     </div>

                  ${task.description ? `<div class="modalContent__body__description">
    <i class="fa-solid fa-bars"></i>
    <p>${task.description}</p>
</div>` : ''}

                     
                    </div>
                    <div class="modalContent__footer hidden">
                        <form>
                            <div>
                                <label>Name</label>
                                <input type="text" name="name"/>
                            </div>
                            <div>
                                <label for="description">Description</label>
                                <textarea name="description" id="description"></textarea>
                            </div>
                            <div>
                              <label for="typeSelect">Type</label>
                             <select id="typeSelect" name="type">
                                 <option value="tasks">Tasks</option>
                                 <option value="courses">Courses</option>
                                 <option value="rdvs">Rdvs</option>
                                 <option value="events">Events</option>
                                 <option value="projets">Projets</option>
                              </select>
                         </div>
                           <button type="submit" class="btn btn-updateTask">Update</button>
                        </form>
                    </div>
                </div>
              `;
        }
    }
}