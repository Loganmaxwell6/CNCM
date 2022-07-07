var scaleVal = 0.1
var MAX_X, MAX_Y;
var MIN_SIZE = 500;
var entity;
var initialX = 0;
var initalY = 0;
var mouseSens = 2;
var justPressed = null;

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
    if (justPressed == 82){
        entity.rotateR();
    }
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
            console.log(document.getElementById("zoomSlider").value)
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

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }