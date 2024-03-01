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
            `<ul class="trip" style="background-image: url(${trips[i].image}); background-size: cover")>
                <h3 class="destination-name">${trips[i].destinationID}</h3>
                <div class="trip-list"> 
                    <li>Date: ${trips[i].date}</li>
                    <li>Duration: ${trips[i].duration} days</li>
                    <li>Travelers: ${trips[i].travelers}</li>
                </div>
            </ul>`)
    }
}
// <img class="destination-image" src="${trips[i].image}" alt="${trips[i].alt}">
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