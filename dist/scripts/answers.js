(function () {
    const Answers = {
        userData: null,
        rightsQuizResult: null,
        quiz: null,
        userQuizResult: [],
        init() {
            checkUserData();
            const testId = sessionStorage.getItem('testId');
            if (testId) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.rightsQuizResult = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = 'index.html';
                    }
                    this.getUserName();
                    this.getQuizTests();
                    this.test();
                } else {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }
        },
        getUserName() {
            const name = sessionStorage.getItem('name');
            const lastName = sessionStorage.getItem('lastName');
            const email = sessionStorage.getItem('email');

            this.userData = document.getElementById('user-data')
            this.userData.innerText = `${name} ${lastName}, ${email}`

        },
        getQuizTests() {
            const url = new URL(location.href);
            const testId = url.searchParams.get('id');
            if (testId) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quiz = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = 'index.html';
                    }
                    this.generateAnswers();

                } else {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }
        },
        backResult() {
            const name = sessionStorage.getItem('name')
            const lastName = sessionStorage.getItem('lastName')
            const email = sessionStorage.getItem('email')
            const id = sessionStorage.getItem('id')
            const score = sessionStorage.getItem('scoreQuestions')
            const total = sessionStorage.getItem('totalQuestions')
            location.href = 'result.html?name=' + name + '&lastName=' + lastName + '&email=' + email + '&id=' + id + '&score=' + score + '&total=' + total;
        },
        generateAnswers() {
            const wrapper = document.getElementById('answers-wrapper');
            const levelTitle = document.getElementById('test-level');
            levelTitle.innerText = this.quiz.name
            this.quiz.questions.forEach((item, index) => {
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
        },
        test() {


            // for (let i = 0; i < questionOption.length; i++) {
            //     if ((this.userQuizResult[i] === this.rightsQuizResult[i])) {
            //
            //         questionOption[i].classList.add('try');
            //         questionOption[i].classList.remove('false');
            //     } else {
            //         questionOption[i].classList.add('false');
            //         questionOption[i].classList.remove('try');
            //     }
            // }
            // console.log(questionOption.attributes)
            // for (let i = 0; i < answersWrapper.length; i++) {
            //
            // }

            // for (let i = 0; i < answersWrapper.length; i++) {
            //     let test = this.quiz.questions[i].id === Number(answersWrapper[i].getAttribute('questionid'))
            //     // if (this.quiz.questions[i].id === Number(answersWrapper[i].getAttribute('questionid'))) {
            //     //     console.log(1)
            //     // }
            //     console.log(test)
            // }

            // for (let i = 0; i < questionOption.length; i++) {
            //     if ((this.rightsQuizResult[i] === this.userQuizResult[i]) || (this.rightsQuizResult[i] === Number(questionOption[i].getAttribute('value')))) {
            //         questionOption[i].classList.add('try');
            //         questionOption[i].classList.remove('false');
            //     } else {
            //         questionOption[i].classList.add('false');
            //         questionOption[i].classList.remove('try');
            //     }
            // }

            // questionOption.filter(item => {
            //      return item.value
            //  })

            // console.log(this.userQuizResult[i])
            // if ((test === this.rightsQuizResult[i]) || (this.rightsQuizResult[i] !== undefined)) {
            //     questionOption[i].classList.add('try');
            //     // console.log(1)
            // }


            // for (let i = 0; i < questionOption.length; i++) {
            //     console.log([i])
            // }

            // this.userQuizResult.filter(resItem => {
            //       return this.quiz.questions.filter(question => {
            //           return question.answers.filter(answer => {
            //               if (answer.id === resItem) {
            //                   const answers = answer;
            //                   this.rightsQuizResult.filter(rightItem => {
            //                       if (rightItem === answers.id) {
            //                           answers.test = 'try'
            //                           console.log(answers.id)
            //                       } else if (answers.id !== rightItem) {
            //                           answers.test = 'false'
            //                       }
            //                   });
            //                   console.log(answers)
            //               }
            //           });
            //       });
            //   });

            // this.quiz.questions.forEach(item => {
            //     const krisa = item.answers.filter(answer => {
            //         for (let i = 0; i < this.rightsQuizResult.length; i++) {
            //             if (this.userQuizResult[i] === this.rightsQuizResult[i] || (Number(questionOption[i].getAttribute('value') === this.userQuizResult[i]))) {
            //                 return answer.id === this.userQuizResult[i]
            //             }
            //         }
            //     });
            //     console.log(krisa)
            // });
            //
            //


            for (let i = 0; i < sessionStorage.length; i++) {
                let key = sessionStorage.key(i);
                if (key.includes('questionAnswer-')) {
                    this.userQuizResult.push(Number(sessionStorage.getItem(key)));
                    this.userQuizResult.sort((a, b) => a - b);
                }
            }

            console.log(sessionStorage)
            console.log(`Верные ответы ${this.rightsQuizResult}`)
            console.log(`Ответы юзера ${this.userQuizResult}`)

            console.log(this.userQuizResult)
            console.log(this.rightsQuizResult)
            console.log(this.quiz)


            const questionOption = document.querySelectorAll('.answers__question-option');

            for (let i = 0; i < questionOption.length; i++) {
               const userResult = this.userQuizResult.filter(item => {
                    if (Number(questionOption[i].getAttribute('value')) === item) {
                        return questionOption
                    }
                });
                const rightResult = this.rightsQuizResult.filter(item => {
                    if (Number(questionOption[i].getAttribute('value')) === item) {
                        return questionOption
                    }
                 });

                if((userResult[0] === rightResult[0]) && Number(questionOption[i].getAttribute('value')) === userResult[0]) {
                    questionOption[i].classList.add('try')
                } else if ((userResult[0] !== rightResult[0]) && Number(questionOption[i].getAttribute('value')) !== userResult[0]) {
                    questionOption[i].classList.add('false')
                }
            }

            // console.log(questionOption[1].getAttribute('value'))
            // if (+questionOption[1].getAttribute('value') === 2) {
            //     questionOption[1].classList.add('try')
            // }
        }
    }
    Answers.init();

})
();