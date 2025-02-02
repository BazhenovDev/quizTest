import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth";

export class Choice {
    constructor() {
        this.quizzes = [];
        // this.routeParams = UrlManager.getQueryParams();
        // UrlManager.checkUserData(this.routeParams);
        UrlManager.checkUserData();
        this.testResult = null;

        this.init()
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/tests');
            if (result) {
                if (result.error) {
                    throw new Error(result.error)
                }
                this.quizzes = result;
            }
        } catch (error) {
            return console.log(error);
        }

        const userInfo = Auth.getUserInfo();
        if (userInfo) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error)
                    }
                    this.testResult = result;
                }
            } catch (error) {
                return console.log(error);
            }
        }

        this.processQuizzes();
    }


    processQuizzes() {
        const choiceOptions = document.getElementById('choiceOptions');
        if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
                const that = this;
                const choiceOptionElement = document.createElement('div');
                choiceOptionElement.className = 'choice__option';
                choiceOptionElement.setAttribute('data-id', quiz.id);
                choiceOptionElement.onclick = function () {
                    that.choiceQuiz(this)
                    sessionStorage.setItem('testId', quiz.id);
                }


                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice__option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice__option-arrow';

                const result = this.testResult.find(item => item.testId === quiz.id)
                if (result) {
                    const choiceOptionResultElement = document.createElement('div');
                    choiceOptionResultElement.className = 'choice__option-result';
                    choiceOptionResultElement.innerHTML = '<div>Результат</div><div>' + result.score + '/' + result.total + '</div>';
                    choiceOptionElement.appendChild(choiceOptionResultElement);
                }

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', 'static/images/arrow-icon.png');
                choiceOptionImageElement.setAttribute('alt', 'arrow');


                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);
                choiceOptions.appendChild(choiceOptionElement);
            });
        }
    }

    // choiceQuiz(element) {
    choiceQuiz() {
        // const dataId = element.getAttribute('data-id');
        const testId = sessionStorage.getItem('testId');
        if (testId) {
            // location.href = 'test.html' + location.search + '&id=' + dataId;
            // location.href = `#/test?id=${testId}`
            location.href = `#/test`
        }
    }
}