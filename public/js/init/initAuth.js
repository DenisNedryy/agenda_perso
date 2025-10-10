import { MiseAJourAuth } from "../classes/components/MiseAJourAuth.js";
import { AuthServices } from "../classes/services/AuthServices.js";
import { AuthModel } from "../classes/models/AuthModel.js";
import { AuthView } from "../classes/views/AuthView.js";
import { AuthCtrl } from "../classes/controllers/AuthCtrl.js";
import { AuthEventBinder } from "../classes/eventBinders/AuthEventBinder.js";
import { UserServices } from "../classes/services/UserServices.js";


export function initAuth(seoManager) {

    const userServices = new UserServices();
    const authServices = new AuthServices(userServices);
    const authModel = new AuthModel(userServices);
    const authView = new AuthView();
    const authEventBinder = new AuthEventBinder(authView);
    const miseAJourAuth = new MiseAJourAuth(authServices);
    miseAJourAuth.init();


    const authCtrl = new AuthCtrl(authView, seoManager, authEventBinder, authModel, authServices, miseAJourAuth);
    return authCtrl;

}