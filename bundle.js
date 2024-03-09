/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   estimateTripCost: () => (/* binding */ estimateTripCost),
/* harmony export */   findDestinationCosts: () => (/* binding */ findDestinationCosts),
/* harmony export */   findPendingTrips: () => (/* binding */ findPendingTrips),
/* harmony export */   initiateDestinationFunctions: () => (/* binding */ initiateDestinationFunctions),
/* harmony export */   initiateTripFunctions: () => (/* binding */ initiateTripFunctions),
/* harmony export */   initiateUserFunctions: () => (/* binding */ initiateUserFunctions),
/* harmony export */   loadUserLogin: () => (/* binding */ loadUserLogin),
/* harmony export */   pendingTrips: () => (/* binding */ pendingTrips),
/* harmony export */   submitTripRequest: () => (/* binding */ submitTripRequest),
/* harmony export */   verifyLogin: () => (/* binding */ verifyLogin)
/* harmony export */ });
/* harmony import */ var _domUpdates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _apiCalls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);






// import './images/airplane2.png'

// <<<>>> Global Variables
let currentUserId;
let pastTrips = [];
let upcomingTrips = [];
let pendingTrips = [];

// <<>> User Login
function verifyLogin() {
    if (_domUpdates__WEBPACK_IMPORTED_MODULE_0__.password.value === 'travel' && _domUpdates__WEBPACK_IMPORTED_MODULE_0__.username.value.includes('traveler') && _domUpdates__WEBPACK_IMPORTED_MODULE_0__.username.value.length < 11) {
        checkUsername()
    } else {
        _domUpdates__WEBPACK_IMPORTED_MODULE_0__.loginError.innerText = 'Incorrect username or password. Please try again'
    }
}

function checkUsername() {
    let checkName = _domUpdates__WEBPACK_IMPORTED_MODULE_0__.username.value.split('')
    let userID;

    if (checkName.length === 9) {
        userID = Number(checkName[8])
        ;(0,_apiCalls__WEBPACK_IMPORTED_MODULE_1__.getUserInfo)(userID)
    } else if (checkName.length === 10) {
        userID = Number(checkName[8] + checkName[9])
        ;(0,_apiCalls__WEBPACK_IMPORTED_MODULE_1__.getUserInfo)(userID)
    }
}

function loadUserLogin(user) {
    currentUserId = user[0].id
    ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_0__.displayLogin)()
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
        (0,_domUpdates__WEBPACK_IMPORTED_MODULE_0__.displayTripInfo)(pastTrips, _domUpdates__WEBPACK_IMPORTED_MODULE_0__.pastTripsGrid),
        (0,_domUpdates__WEBPACK_IMPORTED_MODULE_0__.displayTripInfo)(upcomingTrips, _domUpdates__WEBPACK_IMPORTED_MODULE_0__.upcomingTripsGrid),
        (0,_domUpdates__WEBPACK_IMPORTED_MODULE_0__.displayTripInfo)(pendingTrips, _domUpdates__WEBPACK_IMPORTED_MODULE_0__.pendingTripsGrid),
        (0,_domUpdates__WEBPACK_IMPORTED_MODULE_0__.displayDestinationOptions)(destinations),
        storeCurrentDestinations(destinations)
}

// <<>> Find user info
function findUser(travelers) {
    let userInfo = travelers.find(traveler => {
        return traveler.id === currentUserId
    })
    ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_0__.displayUserName)(userInfo)
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
}

function findTodaysDate() {
    let currentDate;
    let date = new Date()
    let day = String(date.getDate())
    let month = String(date.getMonth() + 1)
    let year = String(date.getFullYear())
    if (month.length === 1) { month = '0' + month }
    if (day.length === 1) { day = '0' + day }
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
    ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_0__.displayExpenses)(totalLodgingCost, totalFlightCost, totalExpenses, plusAgentsFee)
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
    ;(0,_apiCalls__WEBPACK_IMPORTED_MODULE_1__.postData)(tripRequest)
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
        if (destination.id === parseFloat(_domUpdates__WEBPACK_IMPORTED_MODULE_0__.destinationContainer.value)) {
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
    ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_0__.displayTripEstimate)(tripEstimate)
}






/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   destinationContainer: () => (/* binding */ destinationContainer),
/* harmony export */   displayDestinationOptions: () => (/* binding */ displayDestinationOptions),
/* harmony export */   displayExpenses: () => (/* binding */ displayExpenses),
/* harmony export */   displayLogin: () => (/* binding */ displayLogin),
/* harmony export */   displayPostError: () => (/* binding */ displayPostError),
/* harmony export */   displayTripEstimate: () => (/* binding */ displayTripEstimate),
/* harmony export */   displayTripInfo: () => (/* binding */ displayTripInfo),
/* harmony export */   displayUserName: () => (/* binding */ displayUserName),
/* harmony export */   loginError: () => (/* binding */ loginError),
/* harmony export */   password: () => (/* binding */ password),
/* harmony export */   pastTripsGrid: () => (/* binding */ pastTripsGrid),
/* harmony export */   pendingTripsGrid: () => (/* binding */ pendingTripsGrid),
/* harmony export */   removePast: () => (/* binding */ removePast),
/* harmony export */   removePending: () => (/* binding */ removePending),
/* harmony export */   removeUpcoming: () => (/* binding */ removeUpcoming),
/* harmony export */   resetTripDisplay: () => (/* binding */ resetTripDisplay),
/* harmony export */   upcomingTripsGrid: () => (/* binding */ upcomingTripsGrid),
/* harmony export */   username: () => (/* binding */ username)
/* harmony export */ });
/* harmony import */ var _apiCalls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _scripts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);



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
const username = document.querySelector('#username')
const password = document.querySelector('#userPassword')
const loginButton = document.querySelector('.login-button')
const main = document.querySelector('main')
const userLogin = document.querySelector('.user-login-page')
const loginError = document.querySelector('.login-error')
const removePending = document.getElementById('pendingTrips')
const removeUpcoming = document.getElementById('upcomingTrips');
const removePast = document.getElementById('pastTrips');


loginButton.addEventListener('click', (event) => {
    event.preventDefault()
    ;(0,_scripts__WEBPACK_IMPORTED_MODULE_1__.verifyLogin)()
})

destinationContainer.addEventListener('mouseout', () => {
    ;(0,_scripts__WEBPACK_IMPORTED_MODULE_1__.findDestinationCosts)()
})

requestTripButton.addEventListener('click', (event) => {
    event.preventDefault()
    ;(0,_scripts__WEBPACK_IMPORTED_MODULE_1__.findDestinationCosts)()
    checkForCompletion(tripDate.value, tripDuration.value, travelerNum.value, destinationContainer.value)
})

function displayLogin() {
    ;(0,_apiCalls__WEBPACK_IMPORTED_MODULE_0__.getData)()
    main.classList.remove('hidden')
    userLogin.classList.add('hidden')
}

function displayUserName(userInfo) {
    greeting.innerText = `Welcome, ${userInfo.name}!`
}

function resetTripDisplay(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function displayTripInfo(trips, grid) {
    resetTripDisplay(grid)
    for (var i = 0; i < trips.length; i++) {
        grid.insertAdjacentHTML('beforeend',
            `<div class="trip" tabindex="0" style="background-image: url(${trips[i].image}); background-size: cover">
                <h4 class="destination-name">${trips[i].destinationID}</h4>
                <ul class="trip-list"> 
                    <li>Date: ${trips[i].date}</li>
                    <li>Duration: ${trips[i].duration} days</li>
                    <li>Travelers: ${trips[i].travelers}</li>
                </ul>
            </div>`)
    }
    if (trips.length === 0) {
        grid.insertAdjacentHTML('beforeend',
            `<div class="trip" tabindex="0" style="background-color: rgba(230, 236, 206, 1)">
                <h4 class="destination-name">No trips to display!</h4>
            </div>`)
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
        (0,_scripts__WEBPACK_IMPORTED_MODULE_1__.estimateTripCost)(tripDuration, travelerNum)
        resetTripDisplay(removePast)
        resetTripDisplay(removePending)
        resetTripDisplay(removeUpcoming)
        ;(0,_scripts__WEBPACK_IMPORTED_MODULE_1__.submitTripRequest)(tripDate, tripDuration, travelerNum, destination)
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
    lodgingEst.innerText = `$${estimate.lodgingCost.toLocaleString()}`
    lodgingDaysEst.innerText = `x ${estimate.duration} days`
    flightEst.innerText = `$${estimate.flightCost.toLocaleString()}`
    flightQuantityEst.innerText = `x ${estimate.travelers} travelers`
    totalEst.innerText = `$${estimate.total.toLocaleString()}`

}



/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getData: () => (/* binding */ getData),
/* harmony export */   getUserInfo: () => (/* binding */ getUserInfo),
/* harmony export */   postData: () => (/* binding */ postData)
/* harmony export */ });
/* harmony import */ var _scripts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _domUpdates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);



function getUserInfo(userID) {
    const loginUser = fetch(`http://localhost:3001/api/v1/travelers/${userID}`)
        .then(resp => resp.json())

    Promise.all([loginUser])
        .then(data => {
            ;(0,_scripts__WEBPACK_IMPORTED_MODULE_0__.loadUserLogin)(data)
        })
        .catch(error => console.log(error))
}


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
            ;(0,_scripts__WEBPACK_IMPORTED_MODULE_0__.initiateUserFunctions)(allTravelers.travelers)
            ;(0,_scripts__WEBPACK_IMPORTED_MODULE_0__.initiateTripFunctions)(allTrips.trips)
            ;(0,_scripts__WEBPACK_IMPORTED_MODULE_0__.initiateDestinationFunctions)(allDestinations.destinations)
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
        .then(resp => {
            resp.json()
            getData()
        })
        .catch(error => {
            console.log(error)
            ;(0,_domUpdates__WEBPACK_IMPORTED_MODULE_1__.displayPostError)()
        })
}





/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(10);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),
/* 4 */
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 5 */
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),
/* 6 */
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),
/* 8 */
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),
/* 9 */
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),
/* 10 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\n  background: rgba(207, 201, 188, 1);\n}\n\n.hidden {\n  display: none;\n}\n\nmain {\n  display: flex;\n  font-family: \"Phudu\", sans-serif;\n  font-optical-sizing: auto;\n  font-weight: regular 400;\n  font-style: normal;\n}\n\n.user-login-page {\n  font-family: \"Phudu\", sans-serif;\n  font-size: 1.5em;\n  font-weight: 500;\n  background-color: whitesmoke;\n  border-style: solid;\n  border-radius: 20px;\n  border-color: orange;\n  border-width: 8px;\n  height: 50vh;\n  width: 50vw;\n  margin: auto;\n  margin-top: 15vh;\n  box-shadow: 1px 1px 10px rgb(0, 0, 0);\n}\n\n.user-login {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin-left: 20%;\n  margin-top: 12%;\n  width: 60%;\n}\n\n.login-input {\n  margin-top: 0.5em;\n}\n\n.login-error {\n  font-size: 0.9em;\n  color: red;\n  margin-top: 0.25em;\n}\n\n.login-button {\n  width: 6em;\n  height: 2em;\n  font-family: \"Phudu\", sans-serif;\n  font-size: 1em;\n  align-self: center;\n  border-radius: 15px;\n  margin-top: 1em;\n\n  &:hover {\n    background-color: rgb(214, 235, 156);\n    cursor: pointer;\n  }\n}\n\nh1 {\n  height: 8vh;\n  font-family: \"Faster One\", system-ui;\n  font-weight: 400;\n  font-style: normal;\n  font-size: 4.5em;\n  margin: 0.3em 0.5em;\n}\n\nheader {\n  display: flex;\n}\n\n.leftside-trips {\n  background: whitesmoke;\n  width: 60%;\n  height: 155vh;\n  border-radius: 20px;\n  border-style: solid;\n  border-color: rgba(107, 221, 207, 1);\n  border-width: 8px;\n  margin-left: 3em;\n  margin-top: 1em;\n}\n\n.username {\n  margin-top: 0px;\n  padding-top: 1.75em;\n  padding-left: 1.5em;\n  padding-bottom: 1em;\n  font-size: 2em;\n}\n\n.user-trips {\n  margin-top: 1.5em;\n  margin-left: 1.5em;\n  font-size: 1.6em;\n}\n\n.sub-header {\n  font-size: 1.5em;\n  margin-top: 0.4em;\n}\n\n.past-trips-grid,\n.pending-trips-grid,\n.upcoming-trips-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 15px;\n  height: 27vh;\n  overflow-y: scroll;\n}\n\n.past-trips-grid {\n  height: 30vh;\n}\n\nh3 {\n  margin-left: 0.5em;\n}\n\n.trip {\n  border-radius: 20px;\n  margin-left: 0px;\n  height: 20vh;\n  box-shadow: 1px 1px 5px #a5a5a5;\n\n  &:hover {\n    border-style: solid;\n    border-color: rgba(249, 198, 66, 1);\n    border-width: 4px;\n  }\n\n  &:focus {\n    border-style: solid;\n    border-color: rgba(249, 198, 66, 1);\n    border-width: 5px;\n  }\n}\n\n.destination-name {\n  margin-left: 1.5em;\n  margin-top: 0.8em;\n  background-color: whitesmoke;\n  box-shadow: 1px 1px 5px black;\n  opacity: 0.9;\n  width: fit-content;\n  padding: 0.25em;\n  border-radius: 5px;\n  font-size: 1.1em;\n}\n\nli {\n  margin: 0.5em;\n  margin-left: 1.5em;\n  width: 8em;\n  opacity: 100;\n}\n\n.trip-list {\n  background: whitesmoke;\n  box-shadow: 1px 1px 5px black;\n  width: fit-content;\n  opacity: 0.95;\n  padding: 0.3em;\n  margin-left: 1.5em;\n  border-radius: 15px;\n}\n\n.pending-trips {\n  background: rgba(227, 235, 176, 1);\n  height: 34vh;\n  width: 90%;\n  padding: 1em;\n  margin: 1em;\n  margin-left: 2em;\n  border-radius: 15px;\n  box-shadow: 1px 1px 12px grey;\n}\n\n.upcoming-trips {\n  background: rgba(211, 200, 147, 1);\n  height: 34vh;\n  width: 90%;\n  padding: 1em;\n  margin-top: 2em;\n  margin-left: 2em;\n  border-radius: 15px;\n  box-shadow: 1px 1px 12px grey;\n}\n\n.past-trips {\n  background: rgba(170, 207, 169, 1);\n  height: 38vh;\n  width: 90%;\n  padding: 1em;\n  margin-top: 2em;\n  margin-left: 2em;\n  border-radius: 15px;\n  box-shadow: 1px 1px 12px grey;\n}\n\n.rightside-trips {\n  width: 35%;\n  border-radius: 20px;\n  margin-left: 2em;\n  display: flex;\n  flex-direction: column;\n}\n\n\n.trip-expenses {\n  background: whitesmoke;\n  border-style: solid;\n  border-width: 5px;\n  border-radius: 20px;\n  border-color: rgba(220, 255, 78, 1);\n  height: 40vh;\n  margin-right: 2em;\n  display: flex;\n  flex-direction: column;\n  margin-top: 1em;\n}\n\n.expenses-header {\n  background-color: rgba(212, 189, 129, 1);\n  border-radius: 10px;\n  font-size: 2em;\n  width: fit-content;\n  margin: 1em 0.5em;\n  padding: 0.5em;\n  box-shadow: 1px 1px 10px purple;\n}\n\n.expenses-table {\n  margin-left: 2em;\n  text-align: left;\n  background-color: (220, 255, 78, 1);\n}\n\n.column-header {\n  font-size: 1.5em;\n  width: 5em;\n}\n\nth {\n  font-size: 1.3em;\n}\n\ntr:hover {\n  background-color: rgb(237, 225, 192);\n}\n\ncaption {\n  caption-side: bottom;\n  text-align: left;\n}\n\n.request-trips {\n  background: whitesmoke;\n  border-style: solid;\n  border-width: 5px;\n  border-radius: 20px;\n  border-color: rgba(249, 198, 66, 1);\n  margin-right: 2em;\n  margin-top: 3em;\n  height: 90vh;\n  display: flex;\n  flex-direction: column;\n  align-items: left;\n}\n\n.request {\n  font-size: 2em;\n  background-color: rgba(212, 189, 129, 1);\n  border-radius: 10px;\n  font-size: 2em;\n  width: fit-content;\n  margin: 1em 0.75em;\n  padding: 0.35em;\n  box-shadow: 1px 1px 10px purple;\n}\n\n.request-input {\n  display: flex;\n  flex-direction: column;\n  align-items: left;\n  width: 70%;\n  margin-left: 2em;\n  font-size: 1.25em;\n  border-style: solid;\n  border-width: 5px;\n  border-radius: 15px;\n  border-color: rgb(112, 206, 183);\n  box-shadow: 1px 1px 20px greenyellow;\n  padding: 0.8em;\n}\n\nlabel {\n  margin-bottom: 5px;\n  margin-top: 10px;\n}\n\ninput {\n  height: 1.5em;\n  font-size: 0.9em;\n\n  &:hover {\n    cursor: pointer;\n    border-color: orange;\n  }\n}\n\nselect {\n  height: 2em;\n  font-size: 0.9em;\n\n  &:hover {\n    cursor: pointer;\n    border-color: orange;\n  }\n}\n\n.request-error {\n  font-size: 1.2em;\n  color: red;\n  margin-top: 0.25em;\n}\n\n.request-trip-button {\n  width: 35%;\n  border-radius: 15px;\n  height: 2.5em;\n  align-self: center;\n  margin-top: 1em;\n  font-family: \"Phudu\", sans-serif;\n  font-weight: 500;\n  font-size: 1em;\n  border-color: rgba(107, 221, 207, 1);\n  border-width: 4px;\n\n  &:hover {\n    background-color: rgb(221, 235, 164);\n    cursor: pointer;\n  }\n}\n\n.cost-est {\n  list-style-type: none;\n}\n\nh4 {\n  font-size: 1.5em;\n  margin-bottom: 0em;\n  margin-left: 1em;\n  margin-top: 0.4em;\n}\n\n.trip-request-table {\n  text-align: left;\n  margin-left: 2em;\n  width: 95%;\n}\n\n.projected-expenses {\n  width: 82%;\n  border-style: dashed;\n  border-width: 5px;\n  border-color: rgb(64, 183, 183);\n  border-radius: 15px;\n  margin: 2em;\n  padding-bottom: 1.25em;\n}", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"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","sourcesContent":["body {\n  background: rgba(207, 201, 188, 1);\n}\n\n.hidden {\n  display: none;\n}\n\nmain {\n  display: flex;\n  font-family: \"Phudu\", sans-serif;\n  font-optical-sizing: auto;\n  font-weight: regular 400;\n  font-style: normal;\n}\n\n.user-login-page {\n  font-family: \"Phudu\", sans-serif;\n  font-size: 1.5em;\n  font-weight: 500;\n  background-color: whitesmoke;\n  border-style: solid;\n  border-radius: 20px;\n  border-color: orange;\n  border-width: 8px;\n  height: 50vh;\n  width: 50vw;\n  margin: auto;\n  margin-top: 15vh;\n  box-shadow: 1px 1px 10px rgb(0, 0, 0);\n}\n\n.user-login {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin-left: 20%;\n  margin-top: 12%;\n  width: 60%;\n}\n\n.login-input {\n  margin-top: 0.5em;\n}\n\n.login-error {\n  font-size: 0.9em;\n  color: red;\n  margin-top: 0.25em;\n}\n\n.login-button {\n  width: 6em;\n  height: 2em;\n  font-family: \"Phudu\", sans-serif;\n  font-size: 1em;\n  align-self: center;\n  border-radius: 15px;\n  margin-top: 1em;\n\n  &:hover {\n    background-color: rgb(214, 235, 156);\n    cursor: pointer;\n  }\n}\n\nh1 {\n  height: 8vh;\n  font-family: \"Faster One\", system-ui;\n  font-weight: 400;\n  font-style: normal;\n  font-size: 4.5em;\n  margin: 0.3em 0.5em;\n}\n\nheader {\n  display: flex;\n}\n\n.leftside-trips {\n  background: whitesmoke;\n  width: 60%;\n  height: 155vh;\n  border-radius: 20px;\n  border-style: solid;\n  border-color: rgba(107, 221, 207, 1);\n  border-width: 8px;\n  margin-left: 3em;\n  margin-top: 1em;\n}\n\n.username {\n  margin-top: 0px;\n  padding-top: 1.75em;\n  padding-left: 1.5em;\n  padding-bottom: 1em;\n  font-size: 2em;\n}\n\n.user-trips {\n  margin-top: 1.5em;\n  margin-left: 1.5em;\n  font-size: 1.6em;\n}\n\n.sub-header {\n  font-size: 1.5em;\n  margin-top: 0.4em;\n}\n\n.past-trips-grid,\n.pending-trips-grid,\n.upcoming-trips-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 15px;\n  height: 27vh;\n  overflow-y: scroll;\n}\n\n.past-trips-grid {\n  height: 30vh;\n}\n\nh3 {\n  margin-left: 0.5em;\n}\n\n.trip {\n  border-radius: 20px;\n  margin-left: 0px;\n  height: 20vh;\n  box-shadow: 1px 1px 5px #a5a5a5;\n\n  &:hover {\n    border-style: solid;\n    border-color: rgba(249, 198, 66, 1);\n    border-width: 4px;\n  }\n\n  &:focus {\n    border-style: solid;\n    border-color: rgba(249, 198, 66, 1);\n    border-width: 5px;\n  }\n}\n\n.destination-name {\n  margin-left: 1.5em;\n  margin-top: 0.8em;\n  background-color: whitesmoke;\n  box-shadow: 1px 1px 5px black;\n  opacity: 0.9;\n  width: fit-content;\n  padding: 0.25em;\n  border-radius: 5px;\n  font-size: 1.1em;\n}\n\nli {\n  margin: 0.5em;\n  margin-left: 1.5em;\n  width: 8em;\n  opacity: 100;\n}\n\n.trip-list {\n  background: whitesmoke;\n  box-shadow: 1px 1px 5px black;\n  width: fit-content;\n  opacity: 0.95;\n  padding: 0.3em;\n  margin-left: 1.5em;\n  border-radius: 15px;\n}\n\n.pending-trips {\n  background: rgba(227, 235, 176, 1);\n  height: 34vh;\n  width: 90%;\n  padding: 1em;\n  margin: 1em;\n  margin-left: 2em;\n  border-radius: 15px;\n  box-shadow: 1px 1px 12px grey;\n}\n\n.upcoming-trips {\n  background: rgba(211, 200, 147, 1);\n  height: 34vh;\n  width: 90%;\n  padding: 1em;\n  margin-top: 2em;\n  margin-left: 2em;\n  border-radius: 15px;\n  box-shadow: 1px 1px 12px grey;\n}\n\n.past-trips {\n  background: rgba(170, 207, 169, 1);\n  height: 38vh;\n  width: 90%;\n  padding: 1em;\n  margin-top: 2em;\n  margin-left: 2em;\n  border-radius: 15px;\n  box-shadow: 1px 1px 12px grey;\n}\n\n.rightside-trips {\n  width: 35%;\n  border-radius: 20px;\n  margin-left: 2em;\n  display: flex;\n  flex-direction: column;\n}\n\n\n.trip-expenses {\n  background: whitesmoke;\n  border-style: solid;\n  border-width: 5px;\n  border-radius: 20px;\n  border-color: rgba(220, 255, 78, 1);\n  height: 40vh;\n  margin-right: 2em;\n  display: flex;\n  flex-direction: column;\n  margin-top: 1em;\n}\n\n.expenses-header {\n  background-color: rgba(212, 189, 129, 1);\n  border-radius: 10px;\n  font-size: 2em;\n  width: fit-content;\n  margin: 1em 0.5em;\n  padding: 0.5em;\n  box-shadow: 1px 1px 10px purple;\n}\n\n.expenses-table {\n  margin-left: 2em;\n  text-align: left;\n  background-color: (220, 255, 78, 1);\n}\n\n.column-header {\n  font-size: 1.5em;\n  width: 5em;\n}\n\nth {\n  font-size: 1.3em;\n}\n\ntr:hover {\n  background-color: rgb(237, 225, 192);\n}\n\ncaption {\n  caption-side: bottom;\n  text-align: left;\n}\n\n.request-trips {\n  background: whitesmoke;\n  border-style: solid;\n  border-width: 5px;\n  border-radius: 20px;\n  border-color: rgba(249, 198, 66, 1);\n  margin-right: 2em;\n  margin-top: 3em;\n  height: 90vh;\n  display: flex;\n  flex-direction: column;\n  align-items: left;\n}\n\n.request {\n  font-size: 2em;\n  background-color: rgba(212, 189, 129, 1);\n  border-radius: 10px;\n  font-size: 2em;\n  width: fit-content;\n  margin: 1em 0.75em;\n  padding: 0.35em;\n  box-shadow: 1px 1px 10px purple;\n}\n\n.request-input {\n  display: flex;\n  flex-direction: column;\n  align-items: left;\n  width: 70%;\n  margin-left: 2em;\n  font-size: 1.25em;\n  border-style: solid;\n  border-width: 5px;\n  border-radius: 15px;\n  border-color: rgb(112, 206, 183);\n  box-shadow: 1px 1px 20px greenyellow;\n  padding: 0.8em;\n}\n\nlabel {\n  margin-bottom: 5px;\n  margin-top: 10px;\n}\n\ninput {\n  height: 1.5em;\n  font-size: 0.9em;\n\n  &:hover {\n    cursor: pointer;\n    border-color: orange;\n  }\n}\n\nselect {\n  height: 2em;\n  font-size: 0.9em;\n\n  &:hover {\n    cursor: pointer;\n    border-color: orange;\n  }\n}\n\n.request-error {\n  font-size: 1.2em;\n  color: red;\n  margin-top: 0.25em;\n}\n\n.request-trip-button {\n  width: 35%;\n  border-radius: 15px;\n  height: 2.5em;\n  align-self: center;\n  margin-top: 1em;\n  font-family: \"Phudu\", sans-serif;\n  font-weight: 500;\n  font-size: 1em;\n  border-color: rgba(107, 221, 207, 1);\n  border-width: 4px;\n\n  &:hover {\n    background-color: rgb(221, 235, 164);\n    cursor: pointer;\n  }\n}\n\n.cost-est {\n  list-style-type: none;\n}\n\nh4 {\n  font-size: 1.5em;\n  margin-bottom: 0em;\n  margin-left: 1em;\n  margin-top: 0.4em;\n}\n\n.trip-request-table {\n  text-align: left;\n  margin-left: 2em;\n  width: 95%;\n}\n\n.projected-expenses {\n  width: 82%;\n  border-style: dashed;\n  border-width: 5px;\n  border-color: rgb(64, 183, 183);\n  border-radius: 15px;\n  margin: 2em;\n  padding-bottom: 1.25em;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 11 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 12 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map