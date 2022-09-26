var scaleVal = 0.1
var MAX_X, MAX_Y;
var MIN_SIZE = 500;
var entity;
var initialX = 0;
var initalY = 0;
var mouseSens = 2;
var justPressed = null;

var primeMove = false;
var wideMove = false;
var doubleMove = false;

const constMoveFaces = [[6, 8, 7, 0, 2, 0, 5, 1, 3, 1, 3, 4, 2], [19, 2, 11, 1, 8, 25, 5, 16, 22, 0, 2, 5, 3], [23, 25, 24, 2, 8, 6, 16, 7, 14, 1, 0, 4, 5],
 [0, 2, 1, 3, 19, 17, 11, 18, 9, 1, 5, 4, 0], [0, 17, 9, 4, 23, 6, 20, 14, 3, 5, 2, 0, 3], [17, 19, 18, 5, 25, 23, 22, 24, 20, 1, 2, 4, 3],
 [9, 11, 10, -1, 16, 14, 13, 15, 12, 1, 2, 4, 3], [18, 1, 10, -1, 7, 24, 4, 15, 21, 0, 2, 5, 3], [20, 22, 21, -1, 5, 3, 13, 4, 12, 1, 0, 4, 5]]
var moveFaces = constMoveFaces.slice(0);

function setup(){
    handleWindowResize()

    var canvas = createCanvas(MAX_X, MAX_Y);
    canvas.parent("canvasContainer");
  
    frameRate(60);
    entity = new Entity(100);
}

function draw(){
    handleCubeRotation();
    handleMoves();
    handleMoveEdits();

    justPressed = null;
    clear();
    entity.draw(scaleVal)
}

function handleCubeRotation(){
    if (mouseIsPressed){
        let xDif = mouseX - initialX;
        let yDif = mouseY - initialY;
        if (keyIsDown(SHIFT)){
            entity.rotate([0,0,0], true, -xDif/mouseSens, 0, 0);
        }else{
            entity.rotate([0,0,0], true, 0, -yDif/mouseSens, -xDif/mouseSens);
        }
    }
    initialX = mouseX;
    initialY = mouseY;
}

function handleMoves(){
    handleRotatedCube();
    switch(justPressed){
        case(66)://B
            moveEdgeFace(0, primeMove, wideMove, doubleMove);
            break;
        case(85)://U
            moveEdgeFace(1, primeMove, wideMove, doubleMove);
            break;
        case(82)://R
            moveEdgeFace(2, primeMove, wideMove, doubleMove);
            break;
        case(76)://L
            moveEdgeFace(3, primeMove, wideMove, doubleMove);
            break;
        case(68)://D
            moveEdgeFace(4, primeMove, wideMove, doubleMove);
            break;
        case(70)://F
            moveEdgeFace(5, primeMove, wideMove, doubleMove);
            break;
        case(83)://S
            moveEdgeFace(6, primeMove, wideMove, doubleMove);
            break;
        case(69)://E
            moveEdgeFace(7, primeMove, wideMove, doubleMove);
            break;
        case(77)://M
            moveEdgeFace(8, primeMove, wideMove, doubleMove);
            break;
    }
    if (keyIsDown(RIGHT_ARROW)){
        entity.rotate([0,0,0], false, 0, 0, 2)
    }else if(keyIsDown(LEFT_ARROW)){
        entity.rotate([0,0,0], true, 0, 0, 2)
    }else if(keyIsDown(UP_ARROW)){
        entity.rotate([0,0,0], true, 0, 2, 0)
    }else if(keyIsDown(DOWN_ARROW)){
        entity.rotate([0,0,0], false, 0, 2, 0)
    }
}

function handleMoveEdits(){
    if (justPressed == 16){primeMove = !primeMove};
    if (justPressed == 17){wideMove = !wideMove};
    if (justPressed == 81){doubleMove = !doubleMove};
}

function keyPressed(){
    justPressed = keyCode;
}

window.addEventListener("resize", handleWindowResize);
function handleWindowResize(){
    MAX_X = window.outerWidth * 0.75;
    MAX_Y = window.outerHeight * 0.75;
    if (MAX_X < MIN_SIZE || MAX_Y < MIN_SIZE){
        scaleVal = Math.min(MAX_X/MIN_SIZE, MAX_Y/MIN_SIZE)
    }else{
        scaleVal = 1;
    }
    document.getElementById("zoomSlider").value = scaleVal * 100;
}

//stuff for options dropdown
function closeCubeDropdown(){
    document.getElementById("cubeDropdownMenu").classList.remove("show");
}

function openCubeDropdown(){
    let d = document.getElementById("cubeDropdownMenu");
    if (d.classList.contains("show")){
        d.classList.remove("show");
    }
    else{
        d.classList.add("show");
    }
}

function updateOptions(id){
    switch(id){
        case("reset"):
            entity = new Entity(100);
            break;
        case("zoom"):
            scaleVal = document.getElementById("zoomSlider").value / 100;
    }
}

//move faces

function moveEdgeFace(faceNum, prime, wide, double){
    for (let i = 0; i < (double? 2: (prime? 3: 1)); i++){
        moveSide(moveFaces[faceNum], true);
    }
    if (wide && faceNum < 6){
        moveEdgeFace(6 + (faceNum > 2? 5-faceNum:faceNum), prime, false, double)
    }
}


function moveSide(s, sliceMove) {
    swapFaces(s[0], s[12], s[1], s[9]);
    swapFaces(s[0], s[12], s[4], s[10]);
    swapFaces(s[0], s[12], s[5], s[11]);
    
    swapFaces(s[1], s[12], s[4], s[9]);
    swapFaces(s[1], s[12], s[5], s[10]);
    swapFaces(s[1], s[12], s[0], s[11]);
    
    swapFaces(s[2], s[12], s[6], s[9]);
    swapFaces(s[2], s[12], s[7], s[10]);
    swapFaces(s[2], s[12], s[8], s[11]);
    if (!(sliceMove)) {
        swapFaces(s[10], s[3], s[1], s[3]);
        swapFaces(s[10], s[3], s[4], s[3]);
        swapFaces(s[10], s[3], s[5], s[3]);
        
        swapFaces(s[2], s[3], s[6], s[3]);
        swapFaces(s[2], s[3], s[7], s[3]);
        swapFaces(s[2], s[3], s[8], s[3]);
    }
}

function swapFaces(piece1, face1, piece2, face2){
    let tempColour = entity.cubes[piece1].squares[face1].colour;
    entity.cubes[piece1].squares[face1].colour = entity.cubes[piece2].squares[face2].colour
    entity.cubes[piece2].squares[face2].colour = tempColour
}

function handleRotatedCube(){
    let trackX = [0, -1];
    let trackY = [0, -1];
    let trackZ = [0, -1];
    for (let i = 0; i < 6; i++){
        let x = entity.cubes[entity.faces[i][4]].getAverageX();
        let y = entity.cubes[entity.faces[i][4]].getAverageY();
        let z = entity.cubes[entity.faces[i][4]].getAverageZ();

        if(x > trackX[0]){trackX = [x, i]}
        if(y > trackY[0]){trackY = [y, i]}
        if(z > trackZ[0]){trackZ = [z, i]}
    }
    moveFaces[0] = constMoveFaces[5-trackX[1]];
    moveFaces[1] = constMoveFaces[trackZ[1]];
    moveFaces[2] = constMoveFaces[trackY[1]];
    moveFaces[3] = constMoveFaces[5-trackY[1]];
    moveFaces[4] = constMoveFaces[5-trackZ[1]];
    moveFaces[5] = constMoveFaces[trackX[1]];

}

//util functions
function copyI(original) {
    var copied = Object.assign(
      Object.create(
        Object.getPrototypeOf(original)
      ),
      original
    );
    return copied;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }