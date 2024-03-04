// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
import { displayUserName, displayTripInfo, pastTripsGrid, upcomingTripsGrid, pendingTripsGrid, displayExpenses, displayDestinationOptions, destinationContainer, displayTripEstimate } from './domUpdates'
import { postData } from './apiCalls'
// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

// <<<>>> Find User Data
let currentUserId = 45;
let pastTrips = [];
let upcomingTrips = [];
let pendingTrips = [];

function initiateUserFunctions(travelers) {
    findUser(travelers)
}

function initiateTripFunctions(trips) {
    findTrips(trips)
}

function initiateDestinationFunctions(destinations) {
    calculateExpenses(destinations, pastTrips),
        findDestination(destinations, pastTrips),
        findDestination(destinations, upcomingTrips),
        findDestination(destinations, pendingTrips),
        displayTripInfo(pastTrips, pastTripsGrid),
        displayTripInfo(upcomingTrips, upcomingTripsGrid),
        displayTripInfo(pendingTrips, pendingTripsGrid),
        displayDestinationOptions(destinations),
        storeCurrentDestinations(destinations)
}

function findUser(travelers) {
    let userInfo = travelers.find(traveler => {
        return traveler.id === currentUserId
    })
    displayUserName(userInfo)
    return userInfo
}
// 0: id : 1
// name : "Ham Leadbeater"
// travelerType: "relaxer"

// trip object{
//     "id": 1,
//     "userID": 44,
//     "destinationID": 49,
//     "travelers": 1,
//     "date": "2022/09/16",
//     "duration": 8,
//     "status": "approved",
//     "suggestedActivities": []
// }

// upcoming trips{
//     "id": 3,
//     "userID": 3,
//     "destinationID": 22,
//     "travelers": 4,
//     "date": "2022/05/22",
//     "duration": 17,
//     "status": "approved",
//     "suggestedActivities": []
// }
// destinations object {
//     "id": 1,
//     "destination": "Lima, Peru",
//     "estimatedLodgingCostPerDay": 70,
//     "estimatedFlightCostPerPerson": 400,
//     "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
//     "alt": "overview of city buildings with a clear sky"
// }

function findTrips(trips) {
    let userTrips = trips.filter(trip => {
        return trip.userID === currentUserId
    }).sort((a, b) => {
        return a.date.localeCompare(b.date)
    })
    findUpcomingTrips(userTrips)
    findPendingTrips(userTrips)
    findPastTrips(userTrips)
}

function findTodaysDate() {
    let currentDate;
    let date = new Date()
    let day = String(date.getDate())
    let month = String(date.getMonth() + 1)
    let year = String(date.getFullYear())
    if (month < 10) {
        currentDate = `${year}/0${month}/${day}`
    } else {
        currentDate = `${year}/${month}/${day}`
    }
    return currentDate
}


function findUpcomingTrips(userTrips) {
    let todaysDate = findTodaysDate()
    userTrips.forEach(trip => {
        if (trip.date > todaysDate) {
            upcomingTrips.push(trip)
        }
    })
    return upcomingTrips
}

function findPendingTrips(userTrips) {
    userTrips.forEach(trip => {
        if (trip.status === 'pending') {
            pendingTrips.push(trip)
        }
    })
    return pendingTrips
}

function findPastTrips(userTrips) {
    let todaysDate = findTodaysDate()
    userTrips.forEach(trip => {
        if (trip.date < todaysDate) {
            pastTrips.push(trip)
        }
    })
    return pastTrips
}

function findDestination(destinations, tripType) {
    for (var i = 0; i < tripType.length; i++) {
        destinations.forEach(destination => {
            if (tripType[i].destinationID === destination.id) {
                tripType[i].destinationID = destination.destination
                tripType[i].image = destination.image
                tripType[i].alt = destination.alt
            }
        })
    }
    return tripType
}

// <<<>>> User Expenses
function calculateExpenses(destinations, pastTrips) {
    let totalExpenses = 0;
    let totalLodgingCost = 0;
    let totalFlightCost = 0;
    for (var i = 0; i < pastTrips.length; i++) {
        destinations.forEach(destination => {
            if (pastTrips[i].destinationID === destination.id) {
                let lodgingCost = destination.estimatedLodgingCostPerDay
                let flightCost = destination.estimatedFlightCostPerPerson
                totalLodgingCost += (lodgingCost * pastTrips[i].duration)
                totalFlightCost += (flightCost * pastTrips[i].travelers)
                totalExpenses += (lodgingCost * pastTrips[i].duration)
                totalExpenses += (flightCost * pastTrips[i].travelers)
            }
        })
    }
    let plusAgentsFee = Math.round(totalExpenses * 1.1)
    displayExpenses(totalLodgingCost, totalFlightCost, totalExpenses, plusAgentsFee)
}

// <<>> Trip Request
let destinationCosts;
let currentDestinations = [];

function submitTripRequest(tripDate, tripDuration, travelerNum, destination) {
    let dateParsed = tripDate.replace('-', '/').replace('-', '/')
    let tripRequest = {
        id: Date.now(),
        userID: currentUserId,
        destinationID: parseFloat(destination),
        travelers: parseFloat(travelerNum),
        date: dateParsed,
        duration: parseFloat(tripDuration),
        status: 'pending',
        suggestedActivities: []
    }
    postData(tripRequest)
}

function storeCurrentDestinations(destinations) {
    destinations.forEach(destination => {
        currentDestinations.push(destination)
    })
    return currentDestinations
}

function findDestinationCosts() {
    destinationCosts = {
        lodging: 0,
        flight: 0
    }
    currentDestinations.forEach(destination => {
        if (destination.id === parseFloat(destinationContainer.value)) {
            destinationCosts.lodging = destination.estimatedLodgingCostPerDay
            destinationCosts.flight = destination.estimatedFlightCostPerPerson
        }
    })
    return destinationCosts
}

function estimateTripCost(duration, travelers) {
    let tripEstimate = {
        lodgingCost: destinationCosts.lodging,
        flightCost: destinationCosts.flight,
        duration: parseFloat(duration),
        travelers: parseFloat(travelers),
        total: 0
    }
    tripEstimate.total = Math.round(((destinationCosts.lodging * parseFloat(duration)) + (destinationCosts.flight * parseFloat(travelers))) * 1.1)
    displayTripEstimate(tripEstimate)
}

export {
    initiateUserFunctions,
    initiateTripFunctions,
    initiateDestinationFunctions,
    submitTripRequest,
    estimateTripCost,
    findDestinationCosts
}

