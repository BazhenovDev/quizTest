(function () {
    const Result = {
        showAnswers() {
            const url = new URL(location.href);
            const id = url.searchParams.get('id');
            const name = url.searchParams.get('name');
            const lastName = url.searchParams.get('lastName');
            const email = url.searchParams.get('email');
            location.href = `answers.html?name=${name}&lastName=${lastName}&email=${email}&id=${id}`
        },
        init() {
            const url = new URL(location.href);
            document.getElementById('result-score').innerText = url.searchParams.get('score') + '/' + url.searchParams.get('total');
            const linkResults = document.querySelector('.result-link');
            linkResults.addEventListener('click', this.showAnswers);
        },
    }
    Result.init()
})();