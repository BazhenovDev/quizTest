import {Router} from "./router.js";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteCHanging.bind(this));
        window.addEventListener('popstate', this.handleRouteCHanging.bind(this));
    }
    handleRouteCHanging() {
        this.router.openRoute();
    }
}

(new App());