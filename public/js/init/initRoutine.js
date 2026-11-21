import { RoutineView } from "../classes/views/RoutineView.js";
import { RoutineCtrl } from "../classes/controllers/RoutineCtrl.js";
import { RoutineEventBinder } from "../classes/eventBinders/RoutineEventBinder.js";

export function initRoutine(seoManager) {
    const routineView = new RoutineView();
    const routineEventBinder = new RoutineEventBinder();

    return new RoutineCtrl(
        routineView,
        seoManager,
        routineEventBinder,
        window.localStorage
    );
}