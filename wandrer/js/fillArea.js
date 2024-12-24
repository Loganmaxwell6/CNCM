// Check if the point is inside the bounding box
function isPointInBBox(lat, lng, bbox) {
    const lat1 = bbox[0], lng1 = bbox[1], lat2 = bbox[2], lng2 = bbox[3];
    return lat <= lat1 && lat >= lat2 && lng >= lng1 && lng <= lng2;
}

// Create the subgraph with edges that go beyond the bounding box
function createSubgraph(graph, bbox, removeTraveled) {
    let subgraph = {};
    
    // Filter out nodes in the bbox and initialize empty edges for them
    for (let node in graph) {
        let coords = node.split(",");  // Assuming node format is "lat,lng"
        let lat = parseFloat(coords[0]);
        let lng = parseFloat(coords[1]);


        // Check if node is within the bounding box
        if (isPointInBBox(lat, lng, bbox) && (graph[node].find(o => !o.traveled || !removeTraveled))) {
            subgraph[node] = [];  // Initialize empty edges for this node
        }
    }

    // Add edges between nodes within the bounding box
    for (let node in subgraph) {
        if (node == '51.50841,-0.10591')console.log(graph[node])
        for (let edge of graph[node]) {
            // Ensure that both nodes connected by an edge are in the subgraph
            let targetNode = edge.node;
            if (subgraph[targetNode] && (!edge.traveled || !removeTraveled)) {
                subgraph[node].push({ node: targetNode, weight: edge.weight, virtual: false });
                subgraph[targetNode].push({ node: node, weight: edge.weight, virtual: false });  // Add reverse edge
            }
        }
    }

    return subgraph;
}
            
function getDisconnectedComponents(subgraph) {
    let visited = new Set();
    let components = [];

    // Helper function to perform DFS traversal
    function dfs(node, component) {
        if (visited.has(node)) return;
        visited.add(node);
        component.push(node);
        
        if (subgraph[node]) {
            subgraph[node].forEach(edge => {
                dfs(edge.node, component);
            });
        }
    }
    
    // Find all disconnected components
    for (let node in subgraph) {
        if (!visited.has(node)) {
            let component = [];
            dfs(node, component);
            components.push(component);
        }
    }
    
    return components;
}

function removeFullyDisconnectedComponents(components, fullGraph, subgraph, radius) {
    const mainComponent = components.reduce((longest, current) => current.length > longest.length ? current : longest, []);

    let newComponents = [];
    // Radius-constrained DFS to check reachability
    function isReachableWithinRadius(startNode, targetNode, graph, radius) {
        const queue = [startNode];
        const visited = new Set();
    
        while (queue.length > 0) {
            const current = queue.shift();
            if (current === targetNode) return true;
    
            visited.add(current);
    
            for (let neighbor of graph[current] || []) {
                const [lat1, lng1] = current.split(',').map(parseFloat);
                const [lat2, lng2] = neighbor.node.split(',').map(parseFloat);
    
                const distance = calculateDistance(lat1, lng1, lat2, lng2);
                if (distance <= radius && !visited.has(neighbor.node)) {
                    queue.push(neighbor.node);
                }
            }
        }
    
        return false; // No path found within radius
    }

    for (let component of components) {
        if (isReachableWithinRadius(component[0], mainComponent[0], fullGraph, radius)) {
            // If reachable within the radius, keep this component
            newComponents.push(component);
        } else {
            // If not reachable, delete its nodes from the subgraph
            component.forEach(key => delete subgraph[key]);
        }
    }

    return newComponents;
}

function connectComponentsWithCycle(subgraph, fullGraph, components) {
    // Step 1: Calculate distances between components
    let distances = [];
    for (let i = 0; i < components.length; i++) {
        for (let j = i + 1; j < components.length; j++) {
            let component1 = components[i];
            let component2 = components[j];
            
            let closestDistance = Infinity;
            let closestEdge = null;
            
            for (let node1 of component1) {
                for (let node2 of component2) {
                    let distance = calculateDistance(
                        parseFloat(node1.split(",")[0]),
                        parseFloat(node1.split(",")[1]),
                        parseFloat(node2.split(",")[0]),
                        parseFloat(node2.split(",")[1])
                    );
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestEdge = { from: node1, to: node2, weight: closestDistance };
                    }
                }
            }
            
            distances.push({
                component1: i,
                component2: j,
                edge: closestEdge,
                weight: closestDistance
            });
        }
    }

    // Step 2: Approximate TSP to find a cycle
    let cycle = approximateTSP(components.length, distances);

    // Step 3: Add the connecting edges for the cycle
    for (let i = 0; i < cycle.length; i++) {
        let from = cycle[i];
        let to = cycle[(i + 1) % cycle.length]; // Wrap around to form a cycle

        let edge = distances.find(
            d => (d.component1 === from && d.component2 === to) ||
                 (d.component1 === to && d.component2 === from)
        ).edge;

        // Ensure nodes exist in subgraph
        if (!subgraph[edge.from]) subgraph[edge.from] = [];
        if (!subgraph[edge.to]) subgraph[edge.to] = [];
        
        // Add the edge to the subgraph
        subgraph[edge.from].push({ node: edge.to, weight: edge.weight, virtual: true });
        subgraph[edge.to].push({ node: edge.from, weight: edge.weight, virtual: true });
    }
}

// Example of an approximate TSP using Nearest Neighbor
function approximateTSP(numComponents, distances) {
    let visited = new Set();
    let cycle = [];
    let current = 0; // Start at component 0

    while (visited.size < numComponents) {
        cycle.push(current);
        visited.add(current);

        // Find the closest unvisited component
        let closest = null;
        let closestDistance = Infinity;

        for (let d of distances) {
            if (d.component1 === current && !visited.has(d.component2) && d.weight < closestDistance) {
                closest = d.component2;
                closestDistance = d.weight;
            } else if (d.component2 === current && !visited.has(d.component1) && d.weight < closestDistance) {
                closest = d.component1;
                closestDistance = d.weight;
            }
        }

        current = closest;
    }

    return cycle;
}

function floydWarshall(graph) {
    const nodes = Object.keys(graph); // List of node IDs
    const dist = {}; // Distance dictionary
    const next = {}; // Path reconstruction dictionary

    // Initialize distance and next dictionaries
    nodes.forEach((u) => {
        dist[u] = {};
        next[u] = {};
        nodes.forEach((v) => {
            if (u === v) {
                dist[u][v] = 0; // Distance to itself is 0
                next[u][v] = null; // No predecessor needed for self-loop
            } else {
                dist[u][v] = Infinity; // Initially set to Infinity
                next[u][v] = null; // No known path initially
            }
        });
    });

    // Set distances and predecessors for direct edges
    for (let u in graph) {
        for (let edge of graph[u]) {
            dist[u][edge.node] = edge.weight; // Weight of the edge from u to edge.node
            next[u][edge.node] = edge.node; // Direct edge, so the next node is the neighbor
        }
    }

    // Floyd-Warshall main algorithm
    for (let k of nodes) {
        for (let i of nodes) {
            for (let j of nodes) {
                if (dist[i][j] > dist[i][k] + dist[k][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k]; // Update the path to go through k
                }
            }
        }
    }

    return { dist, next }; // Return both distance and path reconstruction matrices
}


// Greedy matching for odd degree nodes
function greedyMatching(oddNodes, dist) {
    const matched = new Set();
    const pairs = [];

    while (oddNodes.length > 1) {
        let minDist = Infinity;
        let pair = [];
        for (let i = 0; i < oddNodes.length; i++) {
            for (let j = i + 1; j < oddNodes.length; j++) {
                let nodeA = oddNodes[i];
                let nodeB = oddNodes[j];
                if (!matched.has(nodeA) && !matched.has(nodeB)) {
                    let distance = dist[nodeA][nodeB];
                    if (distance < minDist) {
                        minDist = distance;
                        pair = [nodeA, nodeB];
                    }
                }
            }
        }
        matched.add(pair[0]);
        matched.add(pair[1]);
        pairs.push(pair);
        oddNodes = oddNodes.filter(node => !matched.has(node)); // Remove paired nodes
    }

    return pairs;
}

// Add virtual edges based on the matching of odd-degree nodes
function addVirtualEdges(subgraph, matching) {
    console.log(matching, subgraph)
    for (let pair of matching) {
        subgraph[pair[0]].push({ node: pair[1], weight: 0, virtual: true });
        subgraph[pair[1]].push({ node: pair[0], weight: 0, virtual: true });
    }
}

function findEulerianCircuit(subgraph) {
    let circuit = [];
    let adjCopy = JSON.parse(JSON.stringify(subgraph)); // Deep copy to avoid modifying the original graph
    let currentNode = Object.keys(adjCopy)[0];  // Start with an arbitrary node
    let usedEdges = new Set();  // To track used edges

    function dfs(node) {
        while (adjCopy[node] && adjCopy[node].length > 0) {
            let edge = adjCopy[node].pop();  // Get the next edge
            let edgeKey = `${node}-${edge.node}`;  // Unique edge key
            let reverseEdgeKey = `${edge.node}-${node}`;  // For undirected graph

            // Check if this edge has already been used
            if (!usedEdges.has(edgeKey) && !usedEdges.has(reverseEdgeKey)) {
                usedEdges.add(edgeKey);  // Mark edge as used
                usedEdges.add(reverseEdgeKey);  // Mark reverse edge as used
                dfs(edge.node);  // Recursively visit the neighbor
            }
        }
        circuit.push(node);  // Add node to circuit after exploring all edges
    }

    dfs(currentNode);  // Start the DFS traversal
    return circuit.reverse();  // Reverse the circuit since we add nodes post-traversal
}

function replaceVirtualEdgesWithRealPaths(eulerianCircuit, subgraph, fullGraph, radius, next) {
    let realPath = [];
    
    for (let i = 0; i < eulerianCircuit.length - 1; i++) {
        console.log(i, eulerianCircuit.length)
        const from = eulerianCircuit[i];
        const to = eulerianCircuit[i + 1];

        // Check if the edge is virtual
        const node = (subgraph[from].find(o => o.node == to));

        
        if (node){
            console.log("node")
            if (node.virtual) {
                console.log("virtual")
                // Replace virtual edge with real path using aStar
                var realSubPath = reconstructPath(next, from, to)
                realSubPath = realSubPath || aStarRadius(from, to, fullGraph, radius);
                if (realSubPath) {
                    // Add the real path (omit the first node to avoid duplication)
                    realPath.push(...realSubPath.slice(0, realSubPath.length - 1));
                } else {
                    console.error("Failed to find real path for virtual edge: ${from} -> ${to}");
                    realPath.push(from)
                }
            } else {
                // Add direct edge for non-virtual connections
                console.log("real")
                realPath.push(from);
            }
        }else{
            console.log("no node", fullGraph[from].find(o => o.node == to))
            var realSubPath = reconstructPath(next, from, to)
            realSubPath = realSubPath || aStarRadius(from, to, fullGraph, radius);
            if (realSubPath){
                realPath.push(...realSubPath.slice(0, realSubPath.length - 1));
            }else {
                console.error("Failed to find replacement path: ${from} -> ${to}");
                realPath.push(from)
            }
        }
    }

    // Add the last node to complete the circuit
    realPath.push(eulerianCircuit[eulerianCircuit.length - 1]);

    return realPath;
}

function drawBoundingBox(map, bbox) {
    const [topLeftLat, topLeftLng, bottomRightLat, bottomRightLng] = bbox;

    // Define the bounds for the rectangle
    const bounds = [
        [topLeftLat, topLeftLng], // Top-left corner
        [bottomRightLat, bottomRightLng] // Bottom-right corner
    ];

    // Draw the rectangle on the map
    const rectangle = L.rectangle(bounds, {
        color: "blue", // Border color
        weight: 2,     // Border width
        fillOpacity: 0 // Transparency for the fill
    }).addTo(map);

    // Optionally, fit the map to the rectangle's bounds
    map.fitBounds(bounds);
}
    
// Main function to solve the CPP on the subgraph
function solveCPP(bbox) {
    console.log("Starting CPP")

    const radius = calculateBBoxMaxLength(bbox) * 2
    let subgraph = createSubgraph(graph, bbox, true);
    console.log(subgraph['51.50841,-0.10591'], graph['51.50841,-0.10591'])
    console.log(subgraph)
    const {next} = floydWarshall(subgraph);

    
    // 6. If the subgraph is disconnected, connect it using the full graph
    const s = structuredClone(subgraph)
    let components = getDisconnectedComponents(subgraph);
    if (components.length > 1) {
        console.log("Subgraph is disconnected, connecting components using full graph");
        components = removeFullyDisconnectedComponents(components, graph, subgraph, radius)
        console.log(components)
        console.log("Finding component cycle")
        connectComponentsWithCycle(subgraph, graph, components);
    }    
    // 1. Extract odd-degree nodes
    let oddNodes = [];
    for (let node in subgraph) {
        if (subgraph[node].length % 2 === 1) {
            oddNodes.push(node);
        }
    }
    console.log("odd noes", oddNodes)
    
    // 2. If there are odd-degree nodes, we need to pair them up using shortest paths
    if (oddNodes.length > 0) {
        // Use Floyd-Warshall or Dijkstra to compute shortest paths between all nodes
        console.log("Floyd Warshall");
        const {dist} = floydWarshall(subgraph);

        // 3. Use greedy matching to pair the odd-degree nodes
        console.log("Greedy Matching");
        let matching = greedyMatching(oddNodes, dist);

        // 4. Add "virtual edges" to make degrees even
        console.log("Virtual Edges");
        addVirtualEdges(subgraph, matching);
        

    }
    
    //5. Find the Eulerian Circuit on the modified subgraph
    console.log("Eulerian Circuit");
    circuit = findEulerianCircuit(structuredClone(subgraph));
    console.log(circuit, subgraph)

    console.log("Replace Virtual edges")
    circuit = replaceVirtualEdgesWithRealPaths(circuit, subgraph, graph, radius, next)
    convertToPolyline(circuit, subgraph)
    console.log(circuit)
}

function convertToPolyline(circuit, s) {
    const polylinePoints = [];
    
    // Iterate through the circuit and add the coordinates of each node
    for (let i = 0; i < circuit.length ; i++) {
        let node = circuit[i];
        let coords = node.split(","); // Assuming the node is in the form "lat,lng"
        polylinePoints.push([parseFloat(coords[0]), parseFloat(coords[1])]);
    }
    
    // Create a polyline using Leaflet
    const polyline = L.polyline(polylinePoints, { color: 'green' }).addTo(map);
    
    return polyline;
}

function calculateBBoxMaxLength(bbox) {
    const [minLat, minLng, maxLat, maxLng] = bbox;
    const R = 6371000;
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const northSouthDistance = Math.abs(maxLat - minLat) * (Math.PI / 180) * R;
    const avgLat = (minLat + maxLat) / 2;
    const eastWestDistance =
        Math.abs(maxLng - minLng) * (Math.PI / 180) * R * Math.cos(toRadians(avgLat));
    return Math.max(northSouthDistance, eastWestDistance);
}

function visualiseGraph(graph, filter = []){
    for (let node in graph){
        if (filter.length > 0 && filter.includes(node)){
            for (let to of graph[node]){
                convertToPolyline([node, to.node])
            }
        }
    }
}

function reconstructPath(next, start, end) {
    if (next[start][end] === null) {
        return null; // No path exists
    }

    const path = [start];
    let current = start;

    while (current !== end) {
        current = next[current][end];
        if (current === null) return null; // Path breaks, return null
        path.push(current);
    }

    return path;
}