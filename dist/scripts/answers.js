(function () {
    const Answers = {
        userData: null,
        quizResult: null,
        quiz: null,
        userResult: null,
        init() {
            checkUserData();
            const url = new URL(location.href)
            const testId = url.searchParams.get('id');
            if (testId) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quizResult = JSON.parse(xhr.responseText);
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
            const url = new URL(location.href);
            const name = url.searchParams.get('name');
            const lastName = url.searchParams.get('lastName');
            const email = url.searchParams.get('email');

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
        },
        test() {
            console.log(this.quizResult)
        }
    }
    Answers.init();
})();