// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
import { displayUserName, displayTripInfo, pastTripsGrid, upcomingTripsGrid, pendingTripsGrid, displayExpenses, displayDestinationOptions, destinationContainer, displayTripEstimate, username, password, displayLogin, loginError, removeAllChildren } from './domUpdates'
import { postData, getUserInfo } from './apiCalls'
// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

// <<<>>> Find User Data
let currentUserId;
let pastTrips = [];
let upcomingTrips = [];
let pendingTrips = [];

// <<>> User Login

function verifyLogin() {
    if (password.value === 'travel' && username.value.includes('traveler') && username.value.length < 11) {
        checkUsername()
    } else {
        loginError.innerText = 'Incorrect username or password. Please try again'
    }
}

function checkUsername() {
    let checkName = username.value.split('')
    let userID;

    if (checkName.length === 9) {
        userID = Number(checkName[8]) 
        getUserInfo(userID)
    } else if (checkName.length === 10) {
        userID = Number(checkName[8] + checkName[9]) 
        getUserInfo(userID)
    }
}

function loadUserLogin(user) {
    currentUserId = user[0].id
    displayLogin()
    return currentUserId
}

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

// <<>> Find user info
function findUser(travelers) {
    let userInfo = travelers.find(traveler => {
        return traveler.id === currentUserId
    })
    displayUserName(userInfo)
    return userInfo
}

function findTrips(trips) {
    let userTrips = trips.filter(trip => {
        return trip.userID === currentUserId
    }).sort((a, b) => {
        return b.date.localeCompare(a.date)
    })
    findUpcomingTrips(userTrips)
    findPendingTrips(userTrips)
    findPastTrips(userTrips)
    console.log('userTrips', userTrips)
    return userTrips
}

function findTodaysDate() {
    let currentDate;
    let date = new Date()
    let day = String(date.getDate())
    let month = String(date.getMonth() + 1)
    let year = String(date.getFullYear())
    if(month.length == 1) month = '0' + month;
    if(day.length == 1) day = '0' + day;
    currentDate = `${year}/${month}/${day}`
    return currentDate
}


function findUpcomingTrips(userTrips) {
    upcomingTrips = []
    let todaysDate = findTodaysDate()
    userTrips.forEach(trip => {
        if (trip.date > todaysDate && trip.status !== 'pending') {
            upcomingTrips.push(trip)
        }
    })
    return upcomingTrips
}

function findPendingTrips(userTrips) {
    pendingTrips = []
    userTrips.forEach(trip => {
        if (trip.status === 'pending') {
            pendingTrips.push(trip)
        }
    })
    return pendingTrips
}

function findPastTrips(userTrips) {
    pastTrips = []
    let todaysDate = findTodaysDate()
    userTrips.forEach(trip => {
        console.log(todaysDate, trip.date)
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
        if (!currentDestinations.includes(destination)) {
            currentDestinations.push(destination)
        }
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
    findDestinationCosts,
    verifyLogin,
    loadUserLogin,
    findPendingTrips,
    pendingTrips
}

