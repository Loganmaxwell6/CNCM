var render = []; //list of all objects on the canvas
var dt = 0; //timestep - initially 0 to stop simulation by default
var MAX_X = 1500; //bounds of canvas
var MAX_Y = 700;

function setup(){ //run once to initialise program
  var canvas = createCanvas(MAX_X, MAX_Y);
  canvas.parent("canvasContainer");
  frameRate(60);
  for (let i = 0; MAX_Y - i >= 10; i += 20){
    render.push(new Particle((i + 10), (MAX_Y - 10 - i), 20));
  }
}

function draw(){ //run on every frame 
  background(200);
  text(dt.toString(), 10, 30);
  for (let i = 0; i < render.length; i++){ //iterate through all objects
    render[i].move(dt); //update each object
  }
}

function keyPressed(){
  if(keyCode === RIGHT_ARROW){
    dt += 0.1;
    dt = Math.round(dt * 10) / 10; //fix javascript floating point decimal stuff
  }
  if(keyCode === LEFT_ARROW){
    dt -= 0.1;
    dt = Math.round(dt * 10) / 10; //fix javascript floating point decimal stuff
  }
}