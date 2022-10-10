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

var animationTime = 50;
var animationSteps = 5;
var animatedCube = null;
var animating = false;

var scrambleMoveNum = 0;
var scrambleMoves = [];
var scrambleLength = 2000;

var timer = 0;
var randMoveNum = 0;

const constMoveFaces = [[6, 8, 7, 0, 2, 0, 5, 1, 3, 1, 3, 4, 2], [19, 2, 11, 1, 8, 25, 5, 16, 22, 0, 2, 5, 3], [23, 25, 24, 2, 8, 6, 16, 7, 14, 1, 0, 4, 5],
 [0, 2, 1, 3, 19, 17, 11, 18, 9, 1, 5, 4, 0], [0, 17, 9, 4, 23, 6, 20, 14, 3, 5, 2, 0, 3], [17, 19, 18, 5, 25, 23, 22, 24, 20, 1, 2, 4, 3],
 [9, 11, 10, -1, 16, 14, 13, 15, 12, 1, 2, 4, 3], [18, 1, 10, -1, 7, 24, 4, 15, 21, 0, 2, 5, 3], [20, 22, 21, -1, 5, 3, 13, 4, 12, 1, 0, 4, 5]]
var moveFaces = constMoveFaces.slice(0);

const moves = ["B", "U", "R", "L", "D", "F", "S", "E", "M"]

function setup(){
    handleWindowResize()

    var canvas = createCanvas(MAX_X, MAX_Y);
    canvas.parent("canvasContainer");
  
    frameRate(60);
    entity = new Entity(100, arraysEqual);
}

function draw(){
    handleCubeRotation();
    handleMoves();
    handleMoveEdits();
    handleMoveEditLabels();

    justPressed = null;
    clear();

    if (!(animatedCube == null)){
        animatedCube.draw(scaleVal);
    }else{
        entity.draw(scaleVal);
    }
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
    if (!animating){
        switch(justPressed){
            case(66)://B
                startAnimatedMove(0);
                break;
            case(85)://U
                startAnimatedMove(1);
                break;
            case(82)://R
                startAnimatedMove(2);                
                break;
            case(76)://L
                startAnimatedMove(3);
                break;
            case(68)://D
                startAnimatedMove(4);
                break;
            case(70)://F
                startAnimatedMove(5);
                break;
            case(83)://S
                startAnimatedMove(6);
                break;
            case(69)://E
                startAnimatedMove(7);
                break;
            case(77)://M
                startAnimatedMove(8);
                break;
            case(90)://Z
                moveFullCube(0, primeMove, wideMove, doubleMove);
                break;
            case(89)://Y
                moveFullCube(1, primeMove, wideMove, doubleMove);
                break;
            case(88)://X
                moveFullCube(2, primeMove, wideMove, doubleMove);
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
}

function handleMoveEdits(){
    if (justPressed == 16){primeMove = !primeMove};
    if (justPressed == 17){wideMove = !wideMove};
    if (justPressed == 81){doubleMove = !doubleMove};
}

function handleMoveEditLabels(){
    document.getElementById("prime").style.visibility = primeMove ? "visible": "hidden";
    document.getElementById("wide").style.visibility = wideMove ? "visible": "hidden";
    document.getElementById("double").style.visibility = doubleMove ? "visible": "hidden";
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
            entity = new Entity(100, arraysEqual);
            break;
        case("scramble"):
            scrambleCube();
            break;
        case("zoom"):
            scaleVal = document.getElementById("zoomSlider").value / 100;
            break;
        case("solve"):
            solveCube();
            break;
    }
}

//move faces

function moveFace(faceNum, prime, wide, double){
    for (let i = 0; i < (double? 2: (prime? 3: 1)); i++){
        moveSide(moveFaces[faceNum], faceNum > 5);
    }
    if (wide && faceNum < 6){
        moveFace(6 + (faceNum > 2? 5-faceNum:faceNum), prime, false, double)
    }
}

function moveFullCube(moveNum, prime, double){
    let moves;
    switch(moveNum){
        case(0)://S
            moves = [5, 6, 0];
            break;
        case(1)://E
            moves = [1, 7, 4]
            break;
        case(2)://M
            moves = [2, 8, 3]
            break;
    }
    moveFace(moves[0], prime, false, double)
    moveFace(moves[1], prime, false, double)
    moveFace(moves[2], !prime, false, double)
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
        swapFaces(s[0], s[3], s[1], s[3]);
        swapFaces(s[0], s[3], s[4], s[3]);
        swapFaces(s[0], s[3], s[5], s[3]);
        
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
    moveFaces[6] = constMoveFaces[6 + (trackX[1] > 2? 5-trackX[1]:trackX[1])];
    moveFaces[7] = constMoveFaces[6 + (trackZ[1] > 2? 5-trackZ[1]:trackZ[1])];
    moveFaces[8] = constMoveFaces[6 + (trackY[1] > 2? 5-trackY[1]:trackY[1])];

    animatedCube.tempFaces = [];
    animatedCube.tempFaces[0] = animatedCube.faces[5-trackX[1]];
    animatedCube.tempFaces[1] = animatedCube.faces[trackZ[1]];
    animatedCube.tempFaces[2] = animatedCube.faces[trackY[1]];
    animatedCube.tempFaces[3] = animatedCube.faces[5-trackY[1]];
    animatedCube.tempFaces[4] = animatedCube.faces[5-trackZ[1]];
    animatedCube.tempFaces[5] = animatedCube.faces[trackX[1]];
    animatedCube.tempFaces[6] = animatedCube.faces[6 + (trackX[1] > 2? 5-trackX[1]:trackX[1])];
    animatedCube.tempFaces[7] = animatedCube.faces[6 + (trackZ[1] > 2? 5-trackZ[1]:trackZ[1])];
    animatedCube.tempFaces[8] = animatedCube.faces[6 + (trackY[1] > 2? 5-trackY[1]:trackY[1])];

    animatedCube.faces = animatedCube.tempFaces;
}

//algorithm stuff

function generateRandomMove(){
    let rand = Math.random();
    let randMove = Math.floor(Math.random() * moves.length);
    let move = moves[randMove];
    if (rand > 0.5 && rand < 0.75 && randMove < 6){
        move += "W";
    }else if (rand > 0.6 && rand < 0.85){
        move += "2";
    }
    if (!(move[move.length -1] == "2") && rand > 0.5){
        move.push += "/";
    }
    return move;
}

function decryptMove(move){
    pW = move.length > 1 ? move[1] == 'W' : false;
    pD = move[move.length - 1] == '2';
    pP = move[move.length - 1] == "/";
    return [move[0], pP, pW, pD];
}

function performAlgorithm(algorithm){
    let moves = algorithm.split(",");
    for (move of moves){
        performMove(decryptMove(move));
    }
}

function performMove(move){
    moveFace(moves.indexOf(move[0]), move[1], move[2], move[3]);
}

function performRandomMoves(){
    randomMoves = setInterval(performRandomMove, 1);
}

function performRandomMove(){
    performAlgorithm(generateRandomMove());
    randMoveNum ++;
    if (randMoveNum % 1000 == 0){
        let t = performance.now()
        console.log((t - timer) / 1000);
        timer = t;
    }
    if (entity.checkSolved()){
        clearInterval(randomMoves);
    }
}

//scramble stuff

function scrambleCube(){
    let scramble = ""
    for (let i = 0; i < scrambleLength; i++){
        let move = generateRandomMove();
        scramble += move + (i == 19? "":",");
    }
    performScrambleAlgorithm(scramble)
}

function performScrambleAlgorithm(algorithm){
    algorithm = algorithm.split(",");
    for (let move of algorithm) {
        scrambleMoves.push(decryptMove(move));
    }
    scramble = setInterval(performScrambleMove, 10);
}

function performScrambleMove(){
    if (!animating){
        startAnimatedMove(moves.indexOf(scrambleMoves[scrambleMoveNum][0]), scrambleMoves[scrambleMoveNum][1], scrambleMoves[scrambleMoveNum][2], scrambleMoves[scrambleMoveNum][3]);
        scrambleMoveNum ++;
    }
    if (scrambleMoveNum >= scrambleMoves.length){
        scrambleMoveNum = 0;
        scrambleMoves = [];
        clearInterval(scramble);
    }
}

//animation

function startAnimatedMove(moveNum){
    animating = true;
    animatedCube = copyCube();

    handleRotatedCube();

    animatedCube.calculateAnimatedRotateDegrees(moveNum > 5 ? moveNum - (moveNum == 6 ? 1 : 6) : moveNum);
    animate = setInterval(animateCube.bind(this, moveNum), animationTime/animationSteps);
}

function animateCube(moveNum){
    if (animatedCube.animationFrames >= animationSteps){
        clearInterval(animate)
        finishAnimating(moveNum);
    }else{
        let step = animationSteps * (doubleMove? 0.5:1)
        animatedCube.exclusiveRotate([0,0,0], !primeMove, animatedCube.xD/step, animatedCube.yD/step, animatedCube.zD/step, animatedCube.faces[moveNum]);
        animatedCube.animationFrames ++;
    }
}

function finishAnimating(moveNum){
    animating = false;
    animatedCube = null;
    moveFace(moveNum, primeMove, wideMove, doubleMove);
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

function copyCube(){
    let copy = new Entity(100, arraysEqual);
    for (let i = 0; i < (copy.faces.length -3); i++){
        for (let j = 0; j < copy.faces[i].length; j++){
            copy.cubes[copy.faces[i][j]].squares[i].colour = entity.cubes[entity.faces[i][j]].squares[i].colour
        }
    }

    for (rotation of entity.rotations){
        copy.rotate([0,0,0], rotation[0], rotation[1], rotation[2], rotation[3]);
    }
    return copy
}