function checkUserData() {
    // const url = new URL(location.href);
    // const name = url.searchParams.get('name');
    // const lastName = url.searchParams.get('lastName');
    // const email = url.searchParams.get('email');

    const name = sessionStorage.getItem('name')
    const lastName = sessionStorage.getItem('lastName')
    const email = sessionStorage.getItem('email')

    if (!name || !lastName || !email) {
        location.href = 'index.html';
    }
}


const currentData = document.querySelector('.footer-date');
currentData.innerText = new Date().getFullYear();