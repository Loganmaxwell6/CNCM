//main solver function
function solveCube(){
    handleStartOrientation(findBestFace());
    console.log(findCrossEdges());
}

//pre-solve preparation

function findBestFace(){
    let max = [-1, -1]
    for (let i = 0; i < entity.faces.length; i++){
        let count = 0;
        let checkColour = entity.cubes[entity.faces[i][4]].squares[i].colour.levels
        for (let j = 1; j < entity.faces[i].length; j+=2){
            if (arraysEqual(entity.cubes[entity.faces[i][j]].squares[i].colour.levels, checkColour)){
                count++;
            }
        }
        if (count > max[0]){
            max = [count, i];
        }
    }
    return max[1];
}

function handleStartOrientation(face){
    switch(face){
        case(0):
            moveFullCube(2, false, false);
            break;
        case(1):
            moveFullCube(2, false, true);
            break;
        case(2):
            moveFullCube(0, false, false);
            break;
        case(3):
            moveFullCube(1, true, false);
            break;
        case(4):
            break;
        case(5):
            moveFullCube(2, true, false);
            break;
    }

}

//first side cross

function findCrossEdges(){
    let pieces = []
    let checkColour = entity.cubes[12].squares[4].colour.levels;
    for (let i = 0; i < entity.faces.length; i++){
        for (let j = 1; j < entity.faces[i].length; j+=2){
            let checkPiece = entity.cubes[entity.faces[i][j]].squares[i];
            if (arraysEqual(checkColour, checkPiece.colour.levels)){
                pieces.push([i, j])
            }
        }
    }
    return pieces;
}

//first side corners

function solveBottomCorners(){

}