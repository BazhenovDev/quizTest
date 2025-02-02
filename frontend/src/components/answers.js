import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answers {

    constructor() {
        this.userData = null;
        this.rightsQuizResult = [];
        this.quiz = null;
        this.userQuizResult = [];
        UrlManager.checkUserData();
        // this.testId = sessionStorage.getItem('testId');
        this.userInfo = Auth.getUserInfo();
        this.testId = sessionStorage.getItem('testId');
        this.getUserName();
        this.getQuizTests();
        // this.init();
    }

    // async init() {
    //     const testId = sessionStorage.getItem('testId');
    //     const userInfo = Auth.getUserInfo();
    //     if (testId) {
    //         const result = await CustomHttp.request(config.host + '/tests/' + testId + '/result/details?userId=' + userInfo.userId);
    //
    //         if (result) {
    //             try {
    //                 if (result.error) {
    //                     console.log(result.error)
    //                 }
    //                 this.rightsQuizResult = result;
    //                 console.log(result);
    //                 this.generateAnswers();
    //             } catch (e) {
    //                 location.href = '#/';
    //             }
    //             // this.getUserName();
    //             // this.getQuizTests();
    //             // this.showResult();
    //         } else {
    //             location.href = '#/';
    //         }
    //     } else {
    //         location.href = '#/';
    //     }
    // }

    getUserName() {
        const email = sessionStorage.getItem('email');

        this.userData = document.getElementById('user-data')
        this.userData.innerText = `${this.userInfo.fullName}, ${email}`

    }


    // getQuizTests() {
    //     const url = new URL(location.href);
    //     // const testId = url.searchParams.get('id');
    //     const testId = sessionStorage.getItem('testId')
    //     if (testId) {
    //         const xhr = new XMLHttpRequest();
    //         xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);
    //         xhr.send();
    //         if (xhr.status === 200 && xhr.responseText) {
    //             try {
    //                 this.quiz = JSON.parse(xhr.responseText);
    //             } catch (e) {
    //                 location.href = '#/';
    //             }
    //             this.generateAnswers();
    //
    //         } else {
    //             location.href = '#/';
    //         }
    //     } else {
    //         location.href = '#/';
    //     }
    // }
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
        // const name = sessionStorage.getItem('name')
        // const lastName = sessionStorage.getItem('lastName')
        // const email = sessionStorage.getItem('email')
        // const id = sessionStorage.getItem('testId')
        // const score = sessionStorage.getItem('scoreQuestions')
        // const total = sessionStorage.getItem('totalQuestions')

        // location.href = 'result.html?name=' + name + '&lastName=' + lastName + '&email=' + email + '&id=' + id + '&score=' + score + '&total=' + total + '&id=' + id;
        // location.href = 'result.html?id=' + id + '&score=' + score + '&total=' + total;
        // location.href = `result.html?id=${id}`
        // location.href = `#/result?id=${id}`
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


//   async showResult() {
//       const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result?userId=' + this.userInfo.userId);
//       // console.log(result.chosen_options)
//           this.quiz.test.questions.forEach(item => {
//               item.answers.forEach(answer => {
//                 if (answer.correct) {
//                     this.rightsQuizResult.push(answer.id)
//                 }
//               })
//           })
//       console.log(this.rightsQuizResult)
//
//         for (let i = 0; i < sessionStorage.length; i++) {
//             const key = sessionStorage.key(i);
//             if (key.startsWith(`questionAnswer-`)) {
//                 this.userQuizResult.push(Number(sessionStorage.getItem(key)));
//             }
//         }
//         // Сортировка ответов пользователя для корректного отображения
//         this.userQuizResult.sort((a, b) => a - b);
//
//         //Получаем все элементы с классом answers__question-option
//         const questionOptions = document.querySelectorAll('.answers__question-option');
//         //Преобразуем ответы в set для быстрого доступа
//         // const userAnswerSet = new Set(this.userQuizResult);
//         const userAnswerSet = new Set(result.chosen_options);
//         const correctAnswerSet = new Set(this.rightsQuizResult);
//         console.log(userAnswerSet)
//         // Обрабатываем каждую опцию
//         questionOptions.forEach(option => {
//             const optionValue = Number(option.getAttribute('value'));
//             //Проверяем ответ
//             if (userAnswerSet.has(optionValue)) {
//                 correctAnswerSet.has(optionValue) ?
//                     option.classList.add('try') :
//                     option.classList.add('false')
//             }
//         })
//     }
// }
//     async showResult() {
//         await CustomHttp.request(config.host + '/tests/' + this.testId + '/result?userId=' + this.userInfo.userId);
//         const questionOptions = document.querySelectorAll('.answers__question-option');
//         questionOptions.forEach(question => {
//             this.quiz.test.questions.forEach(item => {
//                 item.answers.forEach(answer => {
//                     if (answer.hasOwnProperty('correct')) {
//                         if (answer.answer.toString() === question.innerText) {
//                         answer.correct ? question.classList.add('try') : question.classList.add('false')
//                         }
//                     }
//                 });
//             });
//         });
//     }
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
