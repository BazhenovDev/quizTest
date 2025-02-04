export class UrlManager {
    static checkUserData() {
        const name = sessionStorage.getItem('name');
        const lastname = sessionStorage.getItem('lastName');
        const email = sessionStorage.getItem('email');

        if (!name || !lastname || !email) {
            location.href = '#/';
        }
    }
}
