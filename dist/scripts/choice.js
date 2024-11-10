(function () {
    const Choice = {
        quizzes: [],
        init() {
            checkUserData();

            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quizzes', false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quizzes = JSON.parse(xhr.responseText)
                } catch (e) {
                    location.href = 'index.html'
                }
                this.processQuizzes();
            } else {
                location.href = 'index.html'
            }
        },
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

                    const choiceOptionImageElement = document.createElement('img');
                    choiceOptionImageElement.setAttribute('src', 'dist/images/arrow-icon.png');
                    choiceOptionImageElement.setAttribute('alt', 'arrow');


                    choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                    choiceOptionElement.appendChild(choiceOptionTextElement);
                    choiceOptionElement.appendChild(choiceOptionArrowElement);
                    choiceOptions.appendChild(choiceOptionElement);
                });
            }
        },
        choiceQuiz(element) {
            const dataId = element.getAttribute('data-id');
            if (dataId) {
                location.href = 'test.html' + location.search + '&id=' + dataId;
            }
        }
    }

    Choice.init()
})();