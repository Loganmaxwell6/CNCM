console.log(tube.length)

graph = {}

tube.forEach(line => {
    line.forEach(segment => {
        segment.forEach((station, i) =>  {
            if (!(station in graph)){
                graph[station] = []
            }
            if (i != 0 && !(graph[station].includes(segment[i - 1]))){
                graph[station].push(segment[i - 1])
            }
            if (i != segment.length - 1 && !(graph[station].includes(segment[i + 1]))){
                graph[station].push(segment[i + 1])
            }
        })
    })
})

function reconstruct_path(cameFrom, current){
    total_path = [current]
    while (Object.keys(cameFrom).includes(current)){
        current = cameFrom[current]
        total_path.push(codeToName(current))
    }
    return total_path.reverse()
}

function aStar(start, end){
    function h(a, b){
        return getDistance(data[a][2], data[b][2])
    }    

    queue = graph[start]
    cameFrom = {}

    gScore = {}
    Object.keys(graph).forEach(key => gScore[key] = Infinity);
    gScore[start] = 0
        
    fScore = {}
    Object.keys(graph).forEach(key => fScore[key] = Infinity);
    fScore[start] = h(start, end)
    
    graph[start].forEach(n => gScore[n] = h(start, n))
    graph[start].forEach(n => fScore[n] = h(end, n))
    graph[start].forEach(n => cameFrom[n] = start)

    console.log(graph[start], gScore)

    while(queue.length != 0){
        queue.sort((a, b) => fScore[a] - fScore[b])
        current = queue[0]

        if (current == end){
            return reconstruct_path(cameFrom, current)
        }

        queue.shift()

        for(neighbour of graph[current]){
            newScore = gScore[current] + h(current, neighbour)

            if (newScore < gScore[neighbour]){
                cameFrom[neighbour] = current
                gScore[neighbour] = newScore
                fScore[neighbour] = newScore + h(neighbour, end)
                if (!queue.includes(neighbour)){
                    queue.push(neighbour)
                }
            }
        }
    }
    return null
}

console.log(aStar('940GZZLUTCR', '940GZZLULVT'))