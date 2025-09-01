import { HOST } from "../../host.js";

export class ProfilView {

    render(data) {
        const el = document.getElementById("root");
        if (el) {
            el.innerHTML = ` 
            <div class="profil">
            <div class="profil__header">
                <div><p class="profilActive profilUpdate-name">Name</p></div>
                <div><p class="profilUpdate-role">Role</p></div>
                <div><p class="profilUpdate-password">Password</p></div>
                <div><p class="profilCreateBirthDays">BirthDays-Add</p></div>
                <div><p class="profilUpdate-birthdays">BirthDays-delete</p></div>
            </div>
            <div class="profil__body">
                <div class="profil_form"></div>
                  <div class="profil_avatar box">
                <label for="img-avatar">  
                            <div class="btn profilUpdate-img">Update</div>
                        </label>
                        <input id="img-avatar" type="file"/>
                        <img  class="avatar-preview" src="${HOST}/api/images/avatars/${data.img_url}"/> 
                   </div>
                </div>
            </div>
            `;
        }
    }
}

