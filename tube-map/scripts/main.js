
var MAX_X, MAX_Y;

var scal = 1;
var offset;

let img;

var heatMapMultiplier = 5;

var radius;

const crowdMap = new Map(Object.entries(crowdData));

const tubeLines = ["bakerloo", "central", "circle", "district","hammersmith-city", "jubilee", "metropolitan",
"northern", "piccadilly", "victoria", "waterloo-city"];

function preload() {
    img = loadImage('tube_map.png');
}

function setup(){

    colorMode(HSL, 360, 100, 50);

    MAX_Y = window.outerHeight;
    
    MAX_X = (2770/1948) * MAX_Y;

    radius = (7/816) * MAX_Y;

    var canvas = createCanvas(MAX_X, MAX_Y);
    canvas.parent("canvasContainer");

    offset = createVector(0, 0);

    window.addEventListener("wheel", e => {
       zoomDetected(e);
    });

    window.addEventListener("gesturechange", e => {
        zoomDetected(e);
    })

    image(img,0,0,MAX_X,MAX_Y);
}

function draw(){

    const mouse = createVector(mouseX, mouseY);
    const relativeMouse = mouse.copy().sub(offset);

    background(220);

    translate(offset.x, offset.y);

    image(img,0,0, MAX_X * scal, MAX_Y * scal);

    for (let i = 0; i < data.length; i++){
        let c = getCrowdData(i);
        if (c == null){
            fill(0, 100, 0)
        }else{
            fill((1 - (c * heatMapMultiplier)) * 200, 100, 25);
        }
        circle(mapPositions[i][0] * MAX_X * scal, mapPositions[i][1] * MAX_Y * scal, radius * scal);
    }

    if (mouseIsPressed) {
        offset.x = Math.max(MAX_X - (MAX_X*scal), Math.min(0, offset.x - (pmouseX - mouseX)));
        offset.y = Math.max(MAX_Y - (MAX_Y*scal), Math.min(0, offset.y - (pmouseY - mouseY)));
        
    }
}

function zoomDetected(e){
    const s = e.deltaY > 0 ? 0.95 : 1.05;
    scal = Math.max(scal * s, 1);

    const mouse = createVector(mouseX, mouseY);
    
    offset
      .sub(mouse)
      .mult(s)
      .add(mouse)

    offset.x = Math.max(MAX_X - (MAX_X*scal), Math.min(0, offset.x - (pmouseX - mouseX)));
    offset.y = Math.max(MAX_Y - (MAX_Y*scal), Math.min(0, offset.y - (pmouseY - mouseY)));
}

function getCrowdData(index){

    const days = ["SUN", "MON", "TUE", "WED","THU","FRI","SAT"];

    const d = new Date();
    let dayNum = d.getDay()
    let day = days[dayNum]

    try{
        let stationID = data[index][2];
        if (stationID == "940GZZLUMMT"){
            stationID = "940GZZLUBNK"
        }else if(stationID == "940GZZLUHSD"){
            stationID = "940GZZLUHSC"
        }
        return crowdMap.get(stationID)[day][d.getHours() * 4 + Math.floor(d.getMinutes()/ 15)];
    }catch{
        return null;
    }
}

function getClosestStation(xClick, yClick){
    let closest = [1000000000, []];
    for (let i = 0; i < data.length; i++){
        let xDist = mapPositions[i][0] * MAX_X * scal + offset.x - xClick;
        let yDist = mapPositions[i][1] * MAX_Y * scal + offset.y - yClick;
        let dist = Math.sqrt(xDist ** 2 + yDist ** 2);

        if (dist < closest[0]){
            closest = [dist, data[i]];
        }
    }
    return closest
}

function mousePressed(){
    let closestStation = getClosestStation(mouseX, mouseY);
    if (closestStation[0] / scal < radius){
        console.log(closestStation[1][0]);
        // fetch("https://tube-map.herokuapp.com/arrivals").then(res => res.json())
        // .then(arrivals => getArrivalsForStation(closestStation[1], JSON.parse(arrivals)));
    }
}

function getArrivalsForStation(station, arrivals){

    let lineIndexes = station[1].split(", ").map(elem => tubeLines.indexOf(elem));

    arrivals = arrivals.filter( (elem, index) => lineIndexes.includes(index));
    
    let stationArrivals = arrivals.map(elem => elem.filter(arrival => arrival.stationId == station[2]));
    
    stationArrivals.forEach(line => {
        console.log(line[0].lineName);
        line.forEach(arrival => {
            console.log("to " + arrival.destinationName + " at " + arrival.expectedArrival);
        })
    });
}