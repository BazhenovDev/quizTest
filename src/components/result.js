
export class Result {

    constructor() {
        // const url = new URL(location.href);
        // document.getElementById('result-score').innerText = url.searchParams.get('score') + '/' + url.searchParams.get('total');
        document.getElementById('result-score').innerText = sessionStorage.getItem('scoreQuestions') + '/' + sessionStorage.getItem('totalQuestions');
        const linkResults = document.querySelector('.result-link');
        linkResults.addEventListener('click', this.showAnswers);
    }
    showAnswers() {
        // const url = new URL(location.href);
        // const id = url.searchParams.get('id');
        const id = sessionStorage.getItem('testId');
        // const name = url.searchParams.get('name');
        const name = sessionStorage.getItem('name');
        // const lastName = url.searchParams.get('lastName');
        const lastName = sessionStorage.getItem('lastName')
        // const email = url.searchParams.get('email');
        const email = sessionStorage.getItem('email')
        // location.href = `answers.html?name=${name}&lastName=${lastName}&email=${email}&id=${id}`
        // location.href = `answers.html?id=${id}`
        location.href = '#/answers'
    }

}
