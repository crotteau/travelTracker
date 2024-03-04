import allTravelers from './traveler-test-data';
import allTrips from './trip-test-data';
import allDestinations from './destination-test-data';
import { upcomingTrips, pastTrips, pendingTrips } from './functions-test';

import {
  findUser,
  findTrips,
  findUpcomingTrips,
  findPendingTrips,
  findPastTrips,
  findDestination,
  calculateExpenses,
  submitTripRequest,
  findDestinationCosts,
  estimateTripCost
} from './functions-test'

import chai from 'chai';
const expect = chai.expect;


describe('find user info', () => {
  let travelers;
  let trips;
  let userTrips;
  let destinations;

  beforeEach(() => {
    travelers = allTravelers.allTravelers
    trips = allTrips.allTrips
    destinations = allDestinations.allDestinations
    userTrips = findTrips(trips)
  });

  describe('Find traveler info based off of ID', () => {
    it('should return an object', () => {
      const travelerInfo = findUser(travelers)

      expect(travelerInfo).to.be.a('object')
      expect(travelerInfo).to.deep.equal({
        "id": 2,
        "name": "Rachael Vaughten",
        "travelerType": "thrill-seeker"
      })
    })
  });

  describe('Find trips based off of ID', () => {
    it('should return an array of objects', () => {
      const travelerTrips = findTrips(trips)

      expect(travelerTrips).to.be.a(('array'))
      expect(travelerTrips).to.deep.equal([
        {
          "id": 5,
          "userID": 2,
          "destinationID": 3,
          "travelers": 3,
          "date": "2024/04/30",
          "duration": 18,
          "status": "pending",
          "suggestedActivities": []
        },
        {
          "id": 10,
          "userID": 2,
          "destinationID": 4,
          "travelers": 3,
          "date": "2022/04/30",
          "duration": 18,
          "status": "approved",
          "suggestedActivities": []
        }
      ])
    })
  });

  describe('Finding user trips based on status', () => {
    it('Should find any upcoming trips', () => {
      const upcomingTrips = findUpcomingTrips(userTrips)

      expect(upcomingTrips).to.be.a('array')
      expect(upcomingTrips).to.deep.equal([
        {
          "id": 5,
          "userID": 2,
          "destinationID": 3,
          "travelers": 3,
          "date": "2024/04/30",
          "duration": 18,
          "status": "pending",
          "suggestedActivities": []
        }])
    }),
      it('Should find any pending trips', () => {
        const pendingTrips = findPendingTrips(userTrips)

        expect(pendingTrips).to.be.a('array')
        expect(pendingTrips).to.deep.equal([
          {
            "id": 5,
            "userID": 2,
            "destinationID": 3,
            "travelers": 3,
            "date": "2024/04/30",
            "duration": 18,
            "status": "pending",
            "suggestedActivities": []
          }
        ])
      })
    it('Should find any past trips', () => {
      const pastTrips = findPastTrips(userTrips)

      expect(pastTrips).to.be.a('array')
      expect(pastTrips).to.deep.equal([
        {
          "id": 10,
          "userID": 2,
          "destinationID": 4,
          "travelers": 3,
          "date": "2022/04/30",
          "duration": 18,
          "status": "approved",
          "suggestedActivities": []
        }
      ])
    })
  });

  describe('Annual expenses', () => {
    it('should calculate annual expenses', () => {
      const annualExpenses = calculateExpenses(destinations, pastTrips)

      expect(annualExpenses).to.deep.equal(2442)
    })
  });

  describe('Destination name', () => {
    it('Should find destination name using an ID', () => {
      const upcomingDestinations = findDestination(destinations, upcomingTrips)
      const pendingDestinations = findDestination(destinations, pendingTrips)
      const pastDestinations = findDestination(destinations, pastTrips)

      expect(upcomingDestinations[0].destinationID).to.deep.equal('Sydney, Australia')
      expect(pendingDestinations[0].destinationID).to.deep.equal('Sydney, Australia')
      expect(pastDestinations[0].destinationID).to.deep.equal('Cartagena, Colombia')
    })
  })
});

describe('Trip requests', () => {
  it('should return an object', () => {
    const newRequest = submitTripRequest('2024-05-23', '5', '3', '1')

    expect(newRequest).to.be.a('object')
  }),

    it('should return required properties for POST request', () => {
      const newRequest = submitTripRequest('2024-05-23', '5', '3', '1')

      expect(newRequest.id).to.be.a('number')
      expect(newRequest.destinationID).to.be.a('number')
      expect(newRequest.travelers).to.be.a('number')
      expect(newRequest.date).to.be.a('string')
      expect(newRequest.duration).to.be.a('number')
      expect(newRequest).to.deep.equal({
        id: 50,
        userID: 2,
        destinationID: 1,
        travelers: 3,
        date: '2024/05/23',
        duration: 5,
        status: 'pending',
        suggestedActivities: []
      })
    })
});

describe('Calculating trip costs', () => {
  let destinationEst;
  let tripCosts;
  beforeEach(() => {
    destinationEst = findDestinationCosts()
    tripCosts = estimateTripCost('7', '4', destinationEst)
  });

  it('should find lodging and flight costs for a specified destination', () => {
    expect(destinationEst).to.be.a('object')
    expect(destinationEst).to.deep.equal({ lodging: 70, flight: 400 })
  }),

    it('should store nightly lodging cost and duration', () => {
      expect(tripCosts.lodgingCost).to.deep.equal(70)
      expect(tripCosts.duration).to.deep.equal(7)
    }),

    it('should store flight cost and traveler number', () => {
      expect(tripCosts.flightCost).to.deep.equal(400)
      expect(tripCosts.travelers).to.deep.equal(4)
    }),

    it('should calculate total trip estimate including 10% fee', () => {
      const lodgingExpense = tripCosts.lodgingCost * tripCosts.duration
      const flightExpense = tripCosts.flightCost * tripCosts.travelers

      expect((lodgingExpense + flightExpense) * 1.1).to.deep.equal(tripCosts.total)
      expect(tripCosts.total).to.deep.equal(2299)
    })

});

