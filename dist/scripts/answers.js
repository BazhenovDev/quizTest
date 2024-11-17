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
                    this.showResult();
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
            const id = sessionStorage.getItem('testId')
            const score = sessionStorage.getItem('scoreQuestions')
            const total = sessionStorage.getItem('totalQuestions')
            location.href = 'result.html?name=' + name + '&lastName=' + lastName + '&email=' + email + '&id=' + id + '&score=' + score + '&total=' + total + '&id=' + id;
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
        showResult() {
            // for (let i = 0; i < sessionStorage.length; i++) {
            //     let key = sessionStorage.key(i);
            //     if (key.includes('questionAnswer-')) {
            //         this.userQuizResult.push(Number(sessionStorage.getItem(key)));
            //         this.userQuizResult.sort((a, b) => a - b);
            //     }
            // }
            //
            // const questionOption = document.querySelectorAll('.answers__question-option');
            //
            // for (let i = 0; i < questionOption.length; i++) {
            //    const userResult = this.userQuizResult.filter(item => {
            //         if (Number(questionOption[i].getAttribute('value')) === item) {
            //             return questionOption
            //         }
            //     });
            //     const rightResult = this.rightsQuizResult.filter(item => {
            //         if (Number(questionOption[i].getAttribute('value')) === item) {
            //             return questionOption
            //         }
            //      });
            //
            //     if((userResult[0] === rightResult[0]) && Number(questionOption[i].getAttribute('value')) === userResult[0]) {
            //         questionOption[i].classList.add('try')
            //     } else if ((userResult[0] !== rightResult[0]) && Number(questionOption[i].getAttribute('value')) !== userResult[0]) {
            //         questionOption[i].classList.add('false')
            //     }
            // }

            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key.startsWith(`questionAnswer-`)) {
                    this.userQuizResult.push(Number(sessionStorage.getItem(key)));
                }
            }
            // Сортировка ответов пользователя для корректного отображения
            this.userQuizResult.sort((a,b) => a - b);

            //Получаем все элементы с классом answers__question-option
            const questionOptions = document.querySelectorAll('.answers__question-option');
            //Преобразуем ответы в set для быстрого доступа
            const userAnswerSet = new Set(this.userQuizResult);
            const correctAnswerSet = new Set(this.rightsQuizResult);
            // Обрабатываем каждую опцию
            questionOptions.forEach(option => {
                const optionValue = Number(option.getAttribute('value'));
                //Проверяем ответ
                if(userAnswerSet.has(optionValue)) {
                        correctAnswerSet.has(optionValue) ?
                        option.classList.add('try') :
                        option.classList.add('false')
                }
            })
        }
    }
    Answers.init();

})
();