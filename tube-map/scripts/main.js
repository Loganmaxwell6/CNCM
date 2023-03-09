var MAX_X, MAX_Y;
let img;

var radius;

var crowdData = Array(data.length).fill(null);

var comp = false;

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

    image(img,0,0,MAX_X,MAX_Y);

    for (let i = 0; i < data.length; i++){
        updateCrowdData(i)
    }
    console.log("done", crowdData)
}

function draw(){

    background(220);

    image(img,0,0,MAX_X,MAX_Y);

    for (let i = 0; i < data.length; i++){
        if (crowdData[i] == null){
            fill(0,100,50)
        }else{
            let c = crowdData[i] * 5;
            fill((1 - c) * 120, 100, 25)
        }
        circle(mapPositions[i][0] * MAX_X, mapPositions[i][1] * MAX_Y, radius);
    }
}

async function updateCrowdData(index){
    fetch("https://api.tfl.gov.uk/Crowding/"+data[index][2]+"/Live?app_key=a9f08fafd4b2480bb559b986c7b06acb").then(res => {
        if (res.status == 200){
            return res.text();
        }else{
            return JSON.stringify({'percentageOfBaseline' : null})
        }
    })
    .then(text => {
        let value = JSON.parse(text).percentageOfBaseline;
        crowdData[index] = value
    });
}
