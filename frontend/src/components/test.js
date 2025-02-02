import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Test {

    constructor() {
        this.quiz = null;
        this.questionTitleElement = null;
        this.optionsElement = null;
        this.nextButtonElement = null;
        this.prevButtonElement = null;
        this.passButtonElement = null;
        this.progressBarElement = null;
        this.currentQuestionIndex = 1;
        this.userResult = [];
        // UrlManager.checkUserData();
        // const url = new URL(location.href)
        // const testId = url.searchParams.get('id');
        this.testId = sessionStorage.getItem('testId');
        this.init();
    }

    async init() {
        if (this.testId) {
            try {
                const result = await CustomHttp.request(config.host + `/tests/${this.testId}`);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error)
                    }
                    this.quiz = result;
                    this.startQuiz();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    startQuiz() {
        this.questionTitleElement = document.getElementById('title');
        this.optionsElement = document.getElementById('options');
        this.nextButtonElement = document.getElementById('next');
        this.nextButtonElement.onclick = this.move.bind(this, 'next');
        this.passButtonElement = document.getElementById('pass');
        this.prevButtonElement = document.getElementById('prev');
        this.prevButtonElement.onclick = this.move.bind(this, 'prev');
        this.progressBarElement = document.getElementById('progress-bar');
        document.getElementById('pre-title').innerText = this.quiz.name;

        this.prepareProgressBar();
        this.showQuestion();


        const timerElement = document.getElementById('timer');
        let seconds = 59;
        timerElement.innerText = seconds;
       this.interval = setInterval(function () {
            seconds--
            timerElement.innerText = seconds;
            if (seconds === 0) {
                clearInterval(this.interval);
                this.complete();
            }
        }.bind(this), 1000);
    }


    prepareProgressBar() {
        for (let i = 0; i < this.quiz.questions.length; i++) {

            const itemElement = document.createElement('div');
            itemElement.className = 'test__progress-bar-item ' + (i === 0 ? 'active' : '');

            const itemCircleElement = document.createElement('div');
            itemCircleElement.className = 'test__progress-bar-item-circle';

            const itemTextElement = document.createElement('p');
            itemTextElement.className = 'test__progress-bar-item-text';
            itemTextElement.innerText = 'Вопрос ' + (i + 1);

            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);

            this.progressBarElement.appendChild(itemElement);
        }
    }

    showQuestion() {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        this.questionTitleElement.innerHTML = `<span> Вопрос ${this.currentQuestionIndex}:</span> ${activeQuestion.question}`;

        this.optionsElement.innerHTML = '';

        const that = this;

        const chosenOption = this.userResult.find(item => {
            return item.questionId === activeQuestion.id
        });

        activeQuestion.answers.forEach(answer => {
            const optionElement = document.createElement('div');
            optionElement.className = 'test__question-option';

            const inputId = `answer-${answer.id}`
            const inputElement = document.createElement('input');
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', 'answer');
            inputElement.setAttribute('value', answer.id);
            inputElement.className = 'option-answer'

            if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
                inputElement.setAttribute('checked', 'checked');
            }

            inputElement.onchange = function () {
                that.chooseAnswer();
            }

            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);
            this.optionsElement.appendChild(optionElement);
        });

        const arrowImage = document.getElementById('link-arrow-img');

        if (chosenOption && chosenOption.chosenAnswerId) {
            this.nextButtonElement.removeAttribute('disabled');
        } else {
            this.nextButtonElement.setAttribute('disabled', 'disabled');
            this.passButtonElement.classList.remove('disabled-link');
            this.passButtonElement.onclick = this.move.bind(this, 'pass');
            arrowImage.src = 'static/images/arrow-question.png'
        }

        if (this.currentQuestionIndex === this.quiz.questions.length) {
            this.nextButtonElement.innerText = 'Завершить';
        } else {
            this.nextButtonElement.innerText = 'Дальше'
        }

        if (this.currentQuestionIndex > 1) {
            this.prevButtonElement.removeAttribute('disabled');
        } else {
            this.prevButtonElement.setAttribute('disabled', 'disabled');
        }
    }

    chooseAnswer() {
        this.nextButtonElement.removeAttribute('disabled');
        this.passButtonElement.classList.add('disabled-link');
        this.passButtonElement.onclick = null;
        const arrowImage = document.getElementById('link-arrow-img');
        arrowImage.src = 'static/images/arrow-question-grey.png'
    }

    move(action) {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1]
        const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => {
            return element.checked;
        });

        let chosenAnswerId = null;
        if (chosenAnswer && chosenAnswer.value) {
            chosenAnswerId = Number(chosenAnswer.value);
        }

        const existingResult = this.userResult.find(item => {
            return item.questionId === activeQuestion.id
        });

        if (existingResult) {
            existingResult.chosenAnswerId = chosenAnswerId
        } else {
            this.userResult.push({
                questionId: activeQuestion.id,
                chosenAnswerId: chosenAnswerId,
            });
            sessionStorage.setItem(`questionAnswer-${activeQuestion.id}`, chosenAnswerId);
        }

        if (action === 'next' || action === 'pass') {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex--;
        }

        if (this.currentQuestionIndex > this.quiz.questions.length) {
            clearInterval(this.interval);
            this.complete();
            return;
        }

        Array.from(this.progressBarElement.children).forEach((item, index) => {
            const currentItemIndex = index + 1
            item.classList.remove('complete');
            item.classList.remove('active');

            if (this.currentQuestionIndex === currentItemIndex) {
                item.classList.add('active');
            } else if (currentItemIndex < this.currentQuestionIndex) {
                item.classList.add('complete')
            }
        });
        this.showQuestion();
    }

    async complete() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/pass', 'POST', {
                userId: userInfo.userId,
                results: this.userResult
            })

            if (result) {
                if (result.error) {
                    throw new Error(result.error)
                }
                location.href = `#/result?id=${this.testId}`;
            }
        } catch (e) {
            console.log(e)
        }

        // const url = new URL(location.href)
        // const id = url.searchParams.get('id');
        // const name = url.searchParams.get('name');
        // const name = sessionStorage.getItem('name');
        // const lastName = url.searchParams.get('lastName');
        // const lastName = sessionStorage.getItem('lastName');
        // const email = url.searchParams.get('email');
        // const email = sessionStorage.getItem('email')

        // if (xhr.status === 200 && xhr.responseText) {
        //     let result = null;
        //     try {
        //         result = JSON.parse(xhr.responseText);
        //     } catch (e) {
        //         location.href = '#/';
        //     }
        //     if (result) {
        //         // location.href = 'result.html?name=' + name + '&lastName=' + lastName + '&email=' + email + '&id=' + id + '&score=' + result.score + '&total=' + result.total;
        //         // location.href = 'result.html?id=' + id + '&score=' + result.score + '&total=' + result.total;
        //         // location.href = `result.html?id=${id}`
        //         // location.href = `#/result?id=${id}`
        //
        //         sessionStorage.setItem('scoreQuestions', result.score);
        //         sessionStorage.setItem('totalQuestions', result.total);
        //         location.href = `#/result`;
        //     }
        // } else {
        //     location.href = '#/';
        // }
    }
}
