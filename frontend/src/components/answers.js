import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answers {

    constructor() {
        this.userData = null;
        this.quiz = null;
        this.userInfo = Auth.getUserInfo();
        this.testId = sessionStorage.getItem('testId');
        this.getUserName();
        this.getQuizTests();
    }
    getUserName() {
        const email = sessionStorage.getItem('email');

        this.userData = document.getElementById('user-data')
        this.userData.innerText = `${this.userInfo.fullName}, ${email}`

    }


    async getQuizTests() {
        if (this.testId) {
            const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result/details?userId=' + this.userInfo.userId);
            if (result) {
                try {
                    this.quiz = result;
                } catch (e) {
                    console.log(e.error)
                    location.href = '#/';
                }
                this.generateAnswers();

            } else {
                location.href = '#/';
            }
        } else {
            location.href = '#/';
        }
        this.showResult();
    }

    backResult() {
        location.href = `#/result`
    }


    generateAnswers() {
        const wrapper = document.getElementById('answers-wrapper');
        const levelTitle = document.getElementById('test-level');
        levelTitle.innerText = this.quiz.test.name
        this.quiz.test.questions.forEach((item, index) => {
            // Обёртка целого ответа внутри которой будет заголовок и обёртка с ответами
            const answerQuestionsWrapper = document.createElement('div');
            answerQuestionsWrapper.className = 'answers__questions';
            // Заголовок
            const answerQuestionTitle = document.createElement('h2');
            answerQuestionTitle.className = 'answers__questions-title title';
            const titleIndex = index + 1;
            answerQuestionTitle.innerHTML = `<span> Вопрос ${titleIndex}:</span> ${item.question}`

            // Обёртка с ответами, внутри будет лежать инпут ответа
            const answersWrapper = document.createElement('div');
            answersWrapper.className = 'answers__question';
            //Инпут ответ внутри лежит ответ
            const questionAnswer = document.createElement('div');
            questionAnswer.className = 'answers__question-option'
            //Устанавливаем элементу с вопросом id вопроса
            const questionId = item.id
            answersWrapper.setAttribute('questionId', questionId);
            //Ответ
            const answer = document.createElement('span');

            item.answers.forEach(item => {
                const answerId = item.id
                const questionAnswer = document.createElement('div');
                questionAnswer.className = 'answers__question-option'
                questionAnswer.appendChild(answer);
                questionAnswer.setAttribute('value', `${answerId}`);
                answersWrapper.appendChild(questionAnswer);
                const divId = +questionAnswer.getAttribute('value');
                if (item.id === divId) {
                    return questionAnswer.innerHTML = `<span>${item.answer}</span>`
                }

            });
            answerQuestionsWrapper.append(answerQuestionTitle, answersWrapper);

            //Общая обёртка
            wrapper.appendChild(answerQuestionsWrapper)
        });

        const linkResultsBack = document.querySelector('.answers__link');
        linkResultsBack.addEventListener('click', this.backResult);
    }
    async showResult() {
        await CustomHttp.request(config.host + '/tests/' + this.testId + '/result?userId=' + this.userInfo.userId);
        const questionOptions = document.querySelectorAll('.answers__question-option');
        questionOptions.forEach(question => {
            const questionValue = Number(question.getAttribute('value'));
            this.quiz.test.questions.forEach(item => {
                item.answers.forEach(answer => {
                    if (answer.hasOwnProperty('correct')) {
                        if (answer.id === questionValue) {
                        answer.correct ? question.classList.add('try') : question.classList.add('false')
                        }
                    }
                });
            });
        });
    }
}
