LIVE_TRAIN_ARRIVALS = {};
LIVE_TRAIN_MARKERS = {};

var trainRadius = 40

var liveTrains = false;

var busLines = [];

mainMap = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mainMap);


function addMarkers(){
    Object.values(data).forEach(station => L.marker(station[2]).addTo(mainMap));
}

function addBoundaries(){
    L.polygon(boundaries, {color: 'red', fillOpacity: 0.1, opacity: 0.5}).addTo(mainMap)
}

function addElizabeth(){
    elizabeth.forEach(branch => branch.map(coord => coord.reverse()));
    elizabeth.forEach(branch => L.polyline(branch, {color: 'rgb(147, 100, 205)'}).addTo(mainMap));
}

function addTram(){
    tram.forEach(branch => branch.map(coord => coord.reverse()));
    tram.forEach(branch => L.polyline(branch, {color: 'rgb(133, 184, 23)'}).addTo(mainMap));
}

function addBuses(){
    buses.map(route => route.map(stop => stop.reverse()));
    buses.forEach(route => busLines.push(L.polyline(route, {color: randomColour()}).addTo(mainMap)))
}

function addDlr(){
    dlr.forEach(branch => L.polyline(branch.map(elem => data[elem][2]), {color: 'rgb(0, 164, 167)'}).addTo(mainMap));
}

function addOverground(){
    overground.forEach(branch => L.polyline(branch.map(elem => data[elem][2]), {color: 'rgb(237, 121, 14)'}).addTo(mainMap));
}

function addTube(){
    tube.forEach((line, index) => line.forEach(branch => L.polyline(branch.map(elem => data[elem][2]), {color: tubeColours[index]}).addTo(mainMap)));
}

function addLiveTrains(){
    liveTrains = true;
}

addTube();
addElizabeth();
addDlr();
addOverground();
addTram();
addLiveTrains();

mainMap.on('click', handleClick);

function handleClick(e){
    // buses.forEach((route, index) => {
        //     for (let i of route){
    //         if (getDistance(i, [e.latlng.lat, e.latlng.lng]) < 1000){
    //             //console.log(L.polyline(route, {color: randomColour()}))
    //             //L.polyline(route, {color: randomColour()}).addTo(map);
    //             return;
    //         }
    //     }
    //     busLines[index].remove(map);
    // })
}

//live train movement stuff

function createPopupText(arrival, index){
    let time = ((new Date(arrival[index].expectedArrival) - new Date())/60000).toFixed(1);
    return arrival[0].lineName +" to " + arrival[0].destinationName+ ". Arriving at " + arrival[index].stationName + " in "
    + (time >0 ? time : 0) + " minutes.";
}

function drawLiveTrains(){
    let currentTrains = [];
    for (let arrival in LIVE_TRAIN_ARRIVALS){
        currentTrains.push(arrival)

        let route = LIVE_TRAIN_ARRIVALS[arrival];
        let currentIndex = route.findIndex(stop => !stop.passed);
        let pos = -1;

        if (currentIndex > 0){
            pos = getPointBetweenPoints(data[route[currentIndex].naptanId][2], data[route[currentIndex - 1].naptanId][2],
                getPercentBetweenTimes(route[currentIndex].expectedArrival, route[currentIndex - 1].expectedArrival))
        }else{
            pos = data[route[currentIndex].naptanId][2];
        }
        if(liveTrains){
            if (arrival in LIVE_TRAIN_MARKERS){
                LIVE_TRAIN_MARKERS[arrival]._popup.setContent(createPopupText(route, currentIndex));
                LIVE_TRAIN_MARKERS[arrival].setLatLng(pos);
            }else{
                LIVE_TRAIN_MARKERS[arrival] = L.circleMarker(pos, {color: tubeColours[tubeLines.indexOf(route[0].lineId)]}).addTo(mainMap);
                LIVE_TRAIN_MARKERS[arrival].bindPopup(createPopupText(route, currentIndex));
            }
        }
    }
    for (let train in LIVE_TRAIN_MARKERS){
        if (!(currentTrains.includes(train))){
            delete LIVE_TRAIN_MARKERS[train]
        }
    }
}

function getLiveArrivals(){
    fetch("https://tube-map.herokuapp.com/arrivals").then(res => res.text())
    .then(text => LIVE_TRAIN_ARRIVALS = JSON.parse(text))
}

getLiveArrivals()
drawLiveTrains();
var arrivals_timer = setInterval(getLiveArrivals, 10 * 1000);
var update_time = setInterval(drawLiveTrains, 500)

function getPointBetweenPoints(point1, point2, percent){
    let latDif = point1[0] - point2[0];
    let lonDif = point1[1] - point2[1];
    return [point1[0] - latDif * percent, point1[1] - lonDif * percent]
}