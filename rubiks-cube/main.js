var scaleVal = 1
var MAX_X, MAX_Y;
var MIN_SIZE = 500;
var entity;
var initialX = 0;
var initalY = 0;
var mouseSens = 2;
var created = false;
var justPressed = null;
function setup(){
    MAX_X = window.outerWidth * 0.75;
    MAX_Y = window.outerHeight * 0.75;

    var canvas = createCanvas(MAX_X, MAX_Y);
    canvas.parent("canvasContainer");
  
    frameRate(60);
    if (!created){
        created = true;
        entity = new Entity(100);
    }
}

function draw(){
    handleWindowSize();
    handleCubeRotation();
    handleMoves();

    justPressed = null;
    clear();
    entity.draw(scaleVal)
}

function handleWindowSize(){
    MAX_X = window.outerWidth * 0.75;
    MAX_Y = window.outerHeight * 0.75;
    if (MAX_X < MIN_SIZE || MAX_Y < MIN_SIZE){
        scaleVal = Math.min(MAX_X/MIN_SIZE, MAX_Y/MIN_SIZE)
    }else{
        scaleVal = 1;
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
    if (justPressed == 82){
        //entity.rotateR();
    }
}

function keyPressed(){
    justPressed = keyCode;
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
    }
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