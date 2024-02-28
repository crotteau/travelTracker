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
        console.log('allTravelers', allTravelers.travelers)
        console.log('allTrips', allTrips.trips)
        console.log('allDestinations', allDestinations.destinations)
    })
    .catch(error => console.log(error))
}


export {
    getData
}
