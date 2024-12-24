var graph = {}

// Function to process the KML text and create a graph
function findOrInsertNode(lat, lng, graph) {
    const coord = getRoundedKey(lat, lng);

    const offsets = [
        [-0.00001, -0.00001], [-0.00001, 0], [-0.00001, 0.00001],
        [0, -0.00001], [0, 0], [0, 0.00001],
        [0.00001, -0.00001], [0.00001, 0], [0.00001, 0.00001]
    ];

    let checkKey = '';
    for (const offset of offsets) {
        const adjustedLat = roundCoordinate(coord[0] + offset[0]);
        const adjustedLng = roundCoordinate(coord[1] + offset[1]);
        checkKey = `${adjustedLat.toFixed(5)},${adjustedLng.toFixed(5)}`;
        if (graph[checkKey]) {
            return checkKey;
        }
    }

    // Create a new key for the node
    const key = `${coord[0].toFixed(5)},${coord[1].toFixed(5)}`;
    graph[key] = [];
    return key;
}

function roundCoordinate(value, precision = 5) {
    return parseFloat(value.toFixed(precision));
}

function getRoundedKey(lat, lng) {
    const roundedLat = roundCoordinate(lat);
    const roundedLng = roundCoordinate(lng);
    return [roundedLat, roundedLng];
}

function processKMLToGraph(kmlText) {
    var parser = new DOMParser();
    var kmlDoc = parser.parseFromString(kmlText, 'application/xml');
    var namespace = "http://www.opengis.net/kml/2.2";

    var placemarks = kmlDoc.getElementsByTagNameNS(namespace, 'Placemark');
        
    for (var i = 0; i < placemarks.length; i++) {
        var placemark = placemarks[i];
        var lineStrings = [];
        var styleUrl = placemark.getElementsByTagNameNS(namespace, 'styleUrl')[0]?.textContent.trim();
        var isTraveled = styleUrl === "#Traveled"; // True for 'Traveled', False for 'Untraveled'

        // Check if the placemark has a MultiGeometry
        var multiGeometry = placemark.getElementsByTagNameNS(namespace, 'MultiGeometry')[0];
        if (multiGeometry) {
            // Collect all LineStrings within the MultiGeometry
            var lineStringElements = multiGeometry.getElementsByTagNameNS(namespace, 'LineString');
            for (var j = 0; j < lineStringElements.length; j++) {
                lineStrings.push(lineStringElements[j]);
            }
        } else {
            // Otherwise, check if the placemark contains a single LineString
            var lineString = placemark.getElementsByTagNameNS(namespace, 'LineString')[0];
            if (lineString) {
                lineStrings.push(lineString);
            }
        }

        // Process all LineStrings found
        for (var lineString of lineStrings) {
            var coordinatesElement = lineString.getElementsByTagNameNS(namespace, 'coordinates')[0];

            if (coordinatesElement) {
                var coordinates = coordinatesElement.textContent.trim().split(' ').map(coord => {
                    var [lng, lat] = coord.split(',').map(Number);
                    return { lat, lng };
                });

                // Create nodes and edges in the graph
                for (var j = 0; j < coordinates.length - 1; j++) {
                    // Use rounded coordinates for node keys
                    const node1Key = findOrInsertNode(coordinates[j].lat, coordinates[j].lng, graph);
                    const node2Key = findOrInsertNode(coordinates[j + 1].lat, coordinates[j + 1].lng, graph);

                    const distance = calculateDistance(
                        coordinates[j].lat,
                        coordinates[j].lng,
                        coordinates[j + 1].lat,
                        coordinates[j + 1].lng
                    );

                    // Add edges in both directions (bidirectional graph)
                    graph[node1Key].push({
                        node: node2Key,
                        weight: distance,
                        traveled: isTraveled,
                    });

                    graph[node2Key].push({
                        node: node1Key,
                        weight: distance,
                        traveled: isTraveled,
                    });
                }
            }
        }
    }

    finishUpload()
    console.log("done")

    return graph;
}