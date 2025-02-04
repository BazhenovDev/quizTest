import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {

    constructor() {
        const linkResults = document.querySelector('.result-link');
        linkResults.addEventListener('click', this.showAnswers);
        this.init();
    }

    showAnswers() {
        location.href = '#/answers'
    }

    async init() {
        const id = sessionStorage.getItem('testId');
        const userInfo = Auth.getUserInfo();
        if (!userInfo && !id) {
            location.href = '#/';
        }

        try {
            const result = await CustomHttp.request(config.host + '/tests/' + id + '/result?userId=' + userInfo.userId);

            if (result) {
                if (result.error) {
                    throw new Error(result.error)
                }
                document.getElementById('result-score').innerText = result.score + '/' + result.total;
                return;
            }
        } catch (e) {
            console.log(e)
        }
        location.href = '#/';
    }
}
