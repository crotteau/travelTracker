// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
import './domUpdates'
// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

// <<>> Find User Data
let currentUserId = 6;

// 0: id : 1
// name : "Ham Leadbeater"
// travelerType: "relaxer"

function initiateUserFunctions(travelers) {
    findUser(travelers)
}

function initiateTripFunctions(trips) {
    findTrips(trips)
}

function findUser(travelers) {
    let userInfo = travelers.find(traveler => {
        return traveler.id === currentUserId
    })
    console.log('userInfo', userInfo)
    return userInfo
}

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
function findTrips(trips) {    
    let userTrips = trips.filter(trip => {
        return trip.userID === currentUserId
    })
    findUpcomingTrips(userTrips)
    findPendingTrips(userTrips)
    findPastTrips(userTrips)
    console.log('userTrips', userTrips)
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


function findUpcomingTrips(userTrips) {
    let todaysDate = findTodaysDate()
    let upcomingTrips = []
    userTrips.forEach(trip => {
        if (trip.date > todaysDate) {
            upcomingTrips.push(trip)
        }
    })
    return upcomingTrips
}

function findPendingTrips(userTrips) {
    let pendingTrips = []
    userTrips.forEach(trip => {
        if (trip.status === 'pending') {
            pendingTrips.push(trip)
        }
    })
    console.log('pending trips', pendingTrips)
    return pendingTrips
}

function findPastTrips(userTrips) {
    let todaysDate = findTodaysDate()
    let pastTrips = []
    userTrips.forEach(trip => {
        if (trip.date < todaysDate) {
            pastTrips.push(trip)
        }
    })
    console.log('pastTrips', pastTrips)
    return pastTrips
}

export {
    initiateUserFunctions,
    initiateTripFunctions
}

