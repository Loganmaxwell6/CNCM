
  // Initialize the map (make sure you have a Leaflet map set up already)
  var map = L.map('map').setView([51.6000, 0.0000], 13); // Adjust view as needed
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var clickCount = 0

map.on('click', async function (e) {
    console.log(clickCount)
    if (clickCount === 0) {
        route = []
        // Store the first click (start point)
        startClick = e.latlng;
        L.marker([startClick.lat, startClick.lng]).addTo(map).bindPopup('Start').openPopup();
        clickCount++;
    } else if (clickCount === 1) {
        // Store the second click (goal point)
        goalClick = e.latlng;
        L.marker([goalClick.lat, goalClick.lng]).addTo(map).bindPopup('Goal').openPopup();

        // Get the nearest nodes to the start and goal
        
        if (mode == "path"){
            const startNode = getNearestNode(startClick.lat, startClick.lng, graph);
            const goalNode = getNearestNode(goalClick.lat, goalClick.lng, graph);
            route = [startNode, goalNode]
            
            // Perform A* pathfinding
            var path = await aStar(startNode, goalNode, graph)
            
            // Convert the path into a Leaflet polyline and add it to the map
            path = path == null ? [] : path
            const pathCoordinates = path.map(node => {
                const [lat, lng] = node.split(',').map(Number);
                return [lat, lng];
            });
            
            L.polyline(pathCoordinates, { color: 'green', weight: 4 }).addTo(polylineGroup);
        }else{
            bbox = [startClick.lat, startClick.lng, goalClick.lat, goalClick.lng]
            drawBoundingBox(map, bbox)
            waitForDOMUpdate().then(() => {
                solveCPP(bbox)
            });
        }
        
        // Reset the click count for the next pair of clicks
        clickCount = 0;
        startClick = null;
        goalClick = null;
    }
});

var polylineGroup = L.featureGroup().addTo(map);

var penalty = 2

var route = []
var coordinates = []