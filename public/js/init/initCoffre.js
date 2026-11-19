import { CoffreCtrl } from "../classes/controllers/CoffreCtrl.js";
import { CoffreView } from "../classes/views/CoffreView.js";
import { CoffreDetailsView } from "../classes/components/coffre/CoffreDetailsView.js";
import { CoffreEventBinder } from "../classes/eventBinders/CoffreEventBinder.js";
import { CoffreServices } from "../classes/services/CoffreServices.js";
import { TaskServices } from "../classes/services/TaskServices.js";
import { UserServices } from "../classes/services/UserServices.js";

export function initCoffre(seoManager) {
    return new CoffreCtrl(
        new CoffreView(),
        seoManager,
        new CoffreEventBinder(),
        new CoffreServices(),
        new CoffreDetailsView(),
        new TaskServices(),
        new UserServices(),
    );
}
