const tubeLines = ["bakerloo", "central", "circle", "district","hammersmith-city", "jubilee", "metropolitan",
"northern", "piccadilly", "victoria", "waterloo-city"];

var tubeColours = ['rgb(179, 98, 5)', 'rgb(227, 33, 23)', 'rgb(255, 211, 0)', 'rgb(0, 120, 42)', 'rgb(243, 169, 187)', 
    'rgb(160, 165, 169)', 'rgb(155, 0, 85)', 'black', 'rgb(0, 54, 136)', 'rgb(0, 152, 212)', 'rgb(149, 205, 186)'];

function getPercentBetweenTimes(time1, time2){
    let d1 = new Date(time1);
    let d2 = new Date(time2);

    let cur = new Date();
    let diff = d2 - d1;
    return Math.min(1, Math.max(0, (cur - d1) / diff));
}

function getDistance(loc1, loc2){
    
    let lat1 = loc1[0];
    let lon1 = loc1[1];
    let lat2 = loc2[0];
    let lon2 = loc2[1];

    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
}

function findClosestStation(coord){
    let closest = [null, 100000000];
    for (let station in data) {
        let d = getDistance(coord, data[station][2]);
        if (d < closest[1]){
            closest = [station, d];
        }
    }
    return closest[0];
}

function randomColour(){
    return 'rgb('+Math.random()*256+","+Math.random()*256+","+Math.random()*256+")";
}

function codeToName(code){
    return data[code][0]
}

function nameToCode(name){
    return Object.keys(data).find(k => data[k][0] == name);
}