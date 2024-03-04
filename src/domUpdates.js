import { getData } from './apiCalls'
import { submitTripRequest, estimateTripCost, findDestinationCosts} from './scripts'

const greeting = document.querySelector('.username')
const pastTripsGrid = document.querySelector('.past-trips-grid')
const pendingTripsGrid = document.querySelector('.pending-trips-grid')
const upcomingTripsGrid = document.querySelector('.upcoming-trips-grid')
const lodgingCostTable = document.querySelector('.lodging-cost')
const flightCostTable = document.querySelector('.flight-cost')
const totalExpensesTable = document.querySelector('.total-expenses')
const agentsFeeTable = document.querySelector('.agents-fee')
const destinationContainer = document.querySelector('select')
const tripDate = document.querySelector('#tripDate')
const tripDuration = document.querySelector('#tripDuration')
const travelerNum = document.querySelector('#travelerNum')
const requestTripButton = document.querySelector('.request-trip-button')
const requestError = document.querySelector('.request-error')
const lodgingEst = document.querySelector('.lodging-est')
const lodgingDaysEst = document.querySelector('.lodging-days-est')
const flightEst = document.querySelector('.flight-est')
const flightQuantityEst = document.querySelector('.flight-quantity-est')
const totalEst = document.querySelector('.total-est')

window.addEventListener('load', getData)
destinationContainer.addEventListener('mouseout', () => {
    findDestinationCosts()
})

requestTripButton.addEventListener('click', () => {
    checkForCompletion(tripDate.value, tripDuration.value, travelerNum.value, destinationContainer.value)
})


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

function displayDestinationOptions(destinations) {
    let travelOptions = destinations.sort((a, b) => {
        return b.destination.localeCompare(a.destination)
    })
    for (var i = 0; i < travelOptions.length; i++) {
        destinationContainer.insertAdjacentHTML('afterbegin', 
        `<option class="select-destination" value="${travelOptions[i].id}">${travelOptions[i].destination}</option>`)
    }
}

function checkForCompletion(tripDate, tripDuration, travelerNum, destination) {
    if (!tripDate) {
        requestError.innerText = 'Please choose a trip date'
    } else if (!tripDuration) {
        requestError.innerText = 'Please choose trip duration'
    } else if (!travelerNum) {
        requestError.innerText = 'Please indicate traveler number'
    } else if (destination === 'Click to Select Destination') {
        requestError.innerText = 'Please choose a destination'
    } else {
        estimateTripCost(tripDuration, travelerNum)
        submitTripRequest(tripDate, tripDuration, travelerNum, destination)
        resetError()
    }
}

function displayPostError() {
    requestError.innerText = 'We\'re sorry! An unexpected error occurred. Please try again later.'
}

function resetError() {
    requestError.innerText = ''
}

function displayTripEstimate(estimate) {
    lodgingEst.innerText = `$${estimate.lodgingCost}`
    lodgingDaysEst.innerText = `x ${estimate.duration} days`
    flightEst.innerText = `$${estimate.flightCost}`
    flightQuantityEst.innerText = `x ${estimate.travelers} travelers`
    totalEst.innerText = `$${estimate.total}`

}

export {
    displayUserName,
    displayTripInfo,
    displayExpenses,
    displayDestinationOptions,
    displayPostError,
    displayTripEstimate,
    pastTripsGrid,
    upcomingTripsGrid,
    pendingTripsGrid,
    destinationContainer
}