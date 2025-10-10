// core
import { NavHighLighter } from "./classes/core/NavHighLighter.js";
import { NavigationManager } from "./classes/core/NavigationManager.js";
import { NavigationEventBinder } from "./classes/core/NavigationEventBinder.js";
import { SEOManager } from "./classes/core/SEOManager.js";
import { initHome } from "./init/initHome.js";
import { initAuth } from "./init/initAuth.js";
import { initAgenda } from "./init/initAgenda.js";
import { initVocabulary } from "./init/initVocabulary.js";
import { initProfil } from "./init/initProfil.js";

const seoManager = new SEOManager();

const routes = {
    "home": initHome(seoManager),
    "auth": initAuth(seoManager),
    "agenda": initAgenda(seoManager),
    "vocabulary": initVocabulary(seoManager),
    "profil": initProfil(seoManager),
};

const navHighLighter = new NavHighLighter();
const navigationManager = new NavigationManager(routes, navHighLighter);
navigationManager.init();

const navigationEventBinder = new NavigationEventBinder(navigationManager);
navigationEventBinder.bindClickLinks();



