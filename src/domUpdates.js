import { getData } from './apiCalls'

window.addEventListener('load', getData)

const greeting = document.querySelector('.username')

function displayUserName(userInfo) {
    greeting.innerText = `Welcome, ${userInfo.name}!`
}

function displayTripInfo() {

}

export {
    displayUserName,
    displayTripInfo
}