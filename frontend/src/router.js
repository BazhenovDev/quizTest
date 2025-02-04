import {Form} from "./components/form.js";
import {Choice} from "./components/choice.js";
import {Test} from "./components/test.js";
import {Result} from "./components/result.js";
import {Answers} from "./components/answers.js";
import {Auth} from "./services/auth.js";

export class Router {
    constructor() {

        this.contentElemnt =  document.getElementById('content');
        // this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');

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
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/style.min.css',
                load: () => {
                    new Form('signup');
                },
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/style.min.css',
                load: () => {
                    new Form('login');
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
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }


        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
            // return item.route === window.location.hash;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        this.contentElemnt.innerHTML =
            await fetch(newRoute.template).then(response => response.text());

        // this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title

        const currentData = document.querySelector('.footer-date');
        currentData.innerText = new Date().getFullYear();

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey)
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'flex';
            this.profileFullNameElement.innerText = userInfo.fullName
        } else {
            this.profileElement.style.display = 'none';
        }
        newRoute.load();
    }
}