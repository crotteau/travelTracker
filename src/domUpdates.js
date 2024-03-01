import { getData } from './apiCalls'


window.addEventListener('load', getData)

const greeting = document.querySelector('.username')
const pastTripsGrid = document.querySelector('.past-trips-grid')

function displayUserName(userInfo) {
    greeting.innerText = `Welcome, ${userInfo.name}!`
}

function displayTripInfo(trips) {
    for (var i = 0; i <trips.length; i++) {
        pastTripsGrid.insertAdjacentHTML('afterbegin',
        `<ul class="past-trip">
        <h3>${trips[i].destinationID}</h3>
        <li>Date: ${trips[i].date}</li>
        <li>Duration: ${trips[i].duration}</li>
        <li>Travelers: ${trips[i].travelers}</li>
       </ul>`)
       console.log('!!!!',trips[i].destinationID)
    }
    
}
//     "destinationID": 22,
//     "travelers": 4,
//     "date": "2022/05/22",
//     "duration": 17,

export {
    displayUserName,
    displayTripInfo
}