import {Form} from "./components/form.js";
import {Choice} from "./components/choice.js";
import {Test} from "./components/test.js";
import {Result} from "./components/result.js";
import {Answers} from "./components/answers.js";

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная АйтилогияQuiz',
                template: 'templates/index.html',
                styles: 'styles/style.min.css',
                load: () => {
                },
            },
            {
                route: '#/form',
                title: 'Регистрация',
                template: 'templates/form.html',
                styles: 'styles/style.min.css',
                load: () => {
                    new Form();
                },
            },
            {
                route: '#/choice',
                title: 'Выбор теста',
                template: 'templates/choice.html',
                styles: 'styles/style.min.css',
                load: () => {
                    new Choice();
                },
            },
            {
                route: '#/test',
                title: 'Прохождение теста',
                template: 'templates/test.html',
                styles: 'styles/style.min.css',
                load: () => {
                    new Test();
                },
            },
            {
                route: '#/result',
                title: 'Результат теста',
                template: 'templates/result.html',
                styles: 'styles/style.min.css',
                load: () => {
                    new Result();
                },
            },
            {
                route: '#/answers',
                title: 'Результат теста',
                template: 'templates/answers.html',
                styles: 'styles/style.min.css',
                load: () => {
                    new Answers();
                },
            },
        ]
    }

    async openRoute() {
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash.split('?')[0];
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());

        // document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title

        const currentData = document.querySelector('.footer-date');
        currentData.innerText = new Date().getFullYear();

        newRoute.load();
    }
}