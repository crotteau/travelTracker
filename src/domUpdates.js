import { getData } from './apiCalls'


window.addEventListener('load', getData)

const greeting = document.querySelector('.username')
const pastTripsGrid = document.querySelector('.past-trips-grid')
const pendingTripsGrid = document.querySelector('.pending-trips-grid')
const upcomingTripsGrid = document.querySelector('.upcoming-trips-grid')

function displayUserName(userInfo) {
    greeting.innerText = `Welcome, ${userInfo.name}!`
}

function displayTripInfo(trips, grid) {
    for (var i = 0; i < trips.length; i++) {
        grid.insertAdjacentHTML('afterbegin',
            `<ul class="trip">
        <h3>${trips[i].destinationID}</h3>
        <li>Date: ${trips[i].date}</li>
        <li>Duration: ${trips[i].duration}</li>
        <li>Travelers: ${trips[i].travelers}</li>
       </ul>`)
    }
}
//     "destinationID": 22,
//     "travelers": 4,
//     "date": "2022/05/22",
//     "duration": 17,

export {
    displayUserName,
    displayTripInfo,
    pastTripsGrid,
    upcomingTripsGrid,
    pendingTripsGrid
}