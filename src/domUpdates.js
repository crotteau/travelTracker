import { getData } from './apiCalls'

const greeting = document.querySelector('.username')
const pastTripsGrid = document.querySelector('.past-trips-grid')
const pendingTripsGrid = document.querySelector('.pending-trips-grid')
const upcomingTripsGrid = document.querySelector('.upcoming-trips-grid')
const lodgingCostTable = document.querySelector('.lodging-cost')
const flightCostTable = document.querySelector('.flight-cost')
const totalExpensesTable = document.querySelector('.total-expenses')
const agentsFeeTable = document.querySelector('.agents-fee')

window.addEventListener('load', getData)


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

function displayExpenses(totalLodgingCost, totalFlightCost, totalExpenses, plusAgentsFee) {
    lodgingCostTable.innerText = `$${totalLodgingCost.toLocaleString()}`
    flightCostTable.innerText = `$${totalFlightCost.toLocaleString()}`
    totalExpensesTable.innerText = `$${totalExpenses.toLocaleString()}`
    agentsFeeTable.innerText = `$${plusAgentsFee.toLocaleString()}`
}

export {
    displayUserName,
    displayTripInfo,
    displayExpenses,
    pastTripsGrid,
    upcomingTripsGrid,
    pendingTripsGrid
}