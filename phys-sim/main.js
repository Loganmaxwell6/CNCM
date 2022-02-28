var render = []; //list of all objects on the canvas
var dt = 0.1; //timestep - initially 0 to stop simulation by default
var sdt = 0;
var MAX_X = 1500; //bounds of canvas
var MAX_Y = 700;
var MAX_SPEED = 150;
var MIN_SPEED = dt * 0.1; 

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
  console.log(render[0]);
}

function keyPressed(){
  if(key == "ArrowRight"){
    dt += 0.1;
    dt = Math.round(dt * 10) / 10; //fix javascript floating point decimal stuff
  }
  if(key == "ArrowLeft"){
    dt -= 0.1;
    dt = Math.round(dt * 10) / 10; //fix javascript floating point decimal stuff
  }
  if(key == "p"){
    temp = sdt;
    sdt = dt;
    dt = temp;
  }
}