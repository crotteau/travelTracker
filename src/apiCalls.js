import { initiateUserFunctions, initiateTripFunctions, initiateDestinationFunctions } from "./scripts"
import { displayPostError } from "./domUpdates"

function getData() {
    const allTravelers = fetch('http://localhost:3001/api/v1/travelers')
        .then(resp => resp.json())
    
    const allTrips = fetch('http://localhost:3001/api/v1/trips')
        .then(resp => resp.json())

    const allDestinations = fetch('http://localhost:3001/api/v1/destinations')
        .then(resp => resp.json())

    Promise.all([allTravelers, allTrips, allDestinations])
    .then(data => {
        let [allTravelers, allTrips, allDestinations] = data
        initiateUserFunctions(allTravelers.travelers)
        initiateTripFunctions(allTrips.trips)
        initiateDestinationFunctions(allDestinations.destinations)
        // console.log('allTravelers', allTravelers.travelers)
        // console.log('allTrips', allTrips.trips)
        // console.log('allDestinations', allDestinations.destinations)
    })
    .catch(error => console.log(error))
}

function postData(newTrip) {
    fetch('http://localhost:3001/api/v1/trips', {
        method: 'POST',
        body: JSON.stringify(newTrip),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json(),
        console.log(resp))
    .catch(error => {
        console.log(error)
        displayPostError()
    })
}


export {
    getData,
    postData
}
