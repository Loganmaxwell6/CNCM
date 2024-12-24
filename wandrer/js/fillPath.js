async function bfs(start, graph, threshold) {
    const queue = [start]; // Queue for BFS
    const visited = new Set(); // Set to track visited nodes
    visited.add(start); // Mark the start node as visited
    
    // Create a polyline layer to hold the polylines
    const polylineLayer = L.layerGroup().addTo(map);
    
    // Get coordinates of the start point
    const startCoords = start.split(',').map(Number);
    
    // Loop through the queue to explore nodes
    while (queue.length > 0) {
        const current = queue.shift(); // Get the next node from the queue
        
        // Get the coordinates for the current node
        const currentCoords = current.split(',').map(Number);
        
        // Check all neighbors of the current node
        for (const neighbor of graph[current]) {
            const { node, weight } = neighbor;
            
            if (!visited.has(node)) {
                // Get coordinates of the neighbor
                const neighborCoords = node.split(',').map(Number);
                
                // Calculate the distance between the current node and the neighbor
                const distance = calculateDistance(startCoords[0], startCoords[1], neighborCoords[0], neighborCoords[1]);
                
                // Only visit this neighbor if it's within the threshold
                if (distance <= threshold) {
                    visited.add(node); // Mark this neighbor as visited
                    queue.push(node); // Add the neighbor to the queue
                    
                    // Add polyline between the current node and the neighbor
                    const polyline = L.polyline([currentCoords, neighborCoords], { color: 'blue', weight: 2 });
                    polyline.addTo(polylineLayer);

                    // Optional: If you want a brief delay to see the lines being drawn
                }
            }
        }
    }
}

function calculatePathDistance(path, graph) {
    let totalDistance = 0;
    
    // Iterate through the path and sum up the distances between consecutive nodes
    for (let i = 0; i < path.length - 1; i++) {
        let currentNode = path[i];
        let nextNode = path[i + 1];
        
        // Find the edge weight between the current node and the next node in the graph
        let edge = graph[currentNode].find(edge => edge.node === nextNode);
        
        // If there's no edge, return infinity (this means the path is invalid)
        if (!edge) {
            return Infinity;  // Path doesn't exist in the graph
        }

        // Add the weight of the edge to the total distance
        totalDistance += edge.weight;
    }

    return totalDistance;
}

function aStar(start, end, graph) {
    const openSet = new MinHeap();
    const gScore = {}; // Stores the cost from start to each node
    const fScore = {}; // Estimated cost from start to goal
    const cameFrom = {}; // Stores the previous node for each node

    // Initialize gScore and fScore for all nodes
    for (const node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }
    gScore[start] = 0;
    fScore[start] = heuristic(start, end);

    openSet.enqueue(start, fScore[start]);

    const path = [];

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();

        // If we have reached the goal, reconstruct the path
        if (current === end) {
            let temp = current;
            while (temp !== start) {
                path.push(temp);
                temp = cameFrom[temp];
            }
            path.push(start);
            coordinates = path.reverse()
            return path.reverse();
        }

        // Check neighbors of the current node
        for (const neighbor of graph[current]) {
            const { node, weight, traveled } = neighbor;

            // Apply penalty to traveled edges
            const edgeWeight = traveled ? weight * penalty : weight;

            // Calculate tentative g-score
            const tentativeGScore = gScore[current] + edgeWeight;

            // If this path is better, update scores and enqueue the neighbor
            if (tentativeGScore < gScore[node]) {
                cameFrom[node] = current;
                gScore[node] = tentativeGScore;
                fScore[node] = gScore[node] + heuristic(node, end);

                openSet.enqueue(node, fScore[node]);

                // L.polyline([current.split(","), neighbor.node.split(",")]).addTo(map)
                // await new Promise(resolve => setTimeout(resolve, 1)); // Adjust delay if needed
            }
        }
    }

    // No path found
    coordinates = []
    return null;
}

// Min-Heap class for A* priority queue
class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    enqueue(element, priority) {
        const node = { element, priority };
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    bubbleUp(index) {
        let currentIndex = index;
        while (currentIndex > 0) {
            let parentIndex = this.getParentIndex(currentIndex);
            if (this.heap[currentIndex].priority < this.heap[parentIndex].priority) {
                this.swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    dequeue() {
        if (this.heap.length === 0) {
            return null;
        }
        if (this.heap.length === 1) {
            return this.heap.pop().element;
        }
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min.element;
    }

    bubbleDown(index) {
        let currentIndex = index;
        const length = this.heap.length;
        while (true) {
            let leftChildIndex = this.getLeftChildIndex(currentIndex);
            let rightChildIndex = this.getRightChildIndex(currentIndex);
            let smallest = currentIndex;

            if (leftChildIndex < length && this.heap[leftChildIndex].priority < this.heap[smallest].priority) {
                smallest = leftChildIndex;
            }
            if (rightChildIndex < length && this.heap[rightChildIndex].priority < this.heap[smallest].priority) {
                smallest = rightChildIndex;
            }
            if (smallest !== currentIndex) {
                this.swap(currentIndex, smallest);
                currentIndex = smallest;
            } else {
                break;
            }
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}