
// <<>> User Trips
let currentUserId = 2;
let pastTrips = [];
let upcomingTrips = [];
let pendingTrips = [];

function findUser(travelers) {
    let userInfo = travelers.find(traveler => {
        return traveler.id === currentUserId
    })
    return userInfo
}

function findTrips(trips) {
    let userTrips = trips.filter(trip => {
        return trip.userID === currentUserId
    })
    return userTrips
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
//  <<>> User Expenses
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
   return plusAgentsFee
}

export {
    findUser,
    findTrips,
    findUpcomingTrips,
    findPendingTrips,
    findPastTrips,
    findDestination,
    calculateExpenses,
    findTodaysDate,
    upcomingTrips,
    pastTrips,
    pendingTrips
}

