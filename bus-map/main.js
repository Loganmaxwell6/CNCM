
var mainMap;

var bus = "";

var search;
var searchList;

window.onload = () => {
    document.getElementById('map').style.height = window.innerHeight + "px"

    mainMap = L.map('map').setView([51.505, -0.09], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mainMap);

    initialiseSearch()
}

function addBuses(busRoute){
    if(bus != "")bus.remove(mainMap)
    bus = L.polyline(buses[routes.indexOf(busRoute)], {color: 'rgb(255,0,0)'}).addTo(mainMap)
    document.getElementById("current").innerHTML = "Current Route: " + busRoute
}

function initialiseSearch(){
    search = document.getElementById("searchInput")
    searchList = document.getElementById("searchList")
    search.addEventListener("input", () => filterSearch())
}

function filterSearch(){
    let val = search.value.toLocaleUpperCase()
    var searchedRoutes = val == "" ? [] : routes.filter(route => route.slice(0, val.length) == val)
    displaySearches(searchedRoutes.slice(0,5))
}

function displaySearches(routes){
    while( searchList.firstChild ){
        searchList.removeChild(searchList.firstChild );
      }
    routes.forEach(route => {
        var li = document.createElement("li");
        li.addEventListener("click", (e) => addBuses(e.target.innerHTML))
        li.style = "color:#000;width:100%;padding-bottom:5%;"
        li.appendChild(document.createTextNode(route));
        searchList.appendChild(li);
    })
}