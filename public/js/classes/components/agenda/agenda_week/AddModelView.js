export class AddModelView {


    renderModel() {
        const el = document.querySelector(".modalAddContainer");
        if (el) {
            el.innerHTML = `
            <div class="modal hidden">
  <div class="modalContent">
    <div class="modal__content__header">
      <h3>Nouvelle tâche</h3>
      <i class="fa-solid fa-square-xmark leaveModal"></i>
    </div>

    <form class="formTask-add">
      <!-- Name -->
      <div>
        <label for="name">Name</label>
        <input type="text" name="name" id="name">
      </div>

      <!-- Description -->
      <div>
        <label for="description">Description</label>
        <textarea name="description" id="description"></textarea>
      </div>

      <!-- Type -->
      <div>
        <label for="typeSelect">Type</label>
        <select id="typeSelect" name="type">
          <option value="tasks">Tasks</option>
          <option value="courses">Courses</option>
          <option value="rdvs">Rdvs</option>
          <option value="events">Events</option>
          <option value="projets">Projets</option>
          <option value="dayOff">DayOff</option>
          <option value="alert">Alert</option>
        </select>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-submit-addTask">Enregistrer</button>
    </form>
  </div>
</div>

            `;
        }
    }
}