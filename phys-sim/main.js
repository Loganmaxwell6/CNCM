var render = []; //list of all objects on the canvas
var dt = 0; //timestep - initially 0 to stop simulation by default
var sdt = 0;
var MAX_X = 1100; //bounds of canvas
var MAX_Y = 550;
var MAX_SPEED = 150;
var MIN_SPEED = dt * 0.1; 
var leftClick = false;
var rightClick = false;
var selected = -1;
var buffer0;
var buffer1;

var data = {
  labels: [0],
  datasets: [{
    label: "",
    data: [],
    fill: false,
    borderColor: 'rgb(0,0,0)',
  }]
};

var objectGraph = new Chart($('#objectGraph'), {
    type: 'line',
    data: data,
});

function addDataPointToGraph(val){
  let labels = objectGraph.data.labels;
  objectGraph.data.labels.push(labels[labels.length - 1] + dt);
  objectGraph.data.datasets[0].data.push(val);
  objectGraph.update();
};

function resetGraph(){
  objectGraph.data = data;
  objectGraph.update();
};

function getDtSlider(val){
  dt = (val - 100) / 100;
}

function setup(){ //run once to initialise program
  var canvas = createCanvas(MAX_X, MAX_Y);
  canvas.parent("canvasContainer");
  frameRate(60);
  /*
  for (let i = 0; MAX_Y - i >= 10; i += 20){
    render.push(new Particle((i + 10), (MAX_Y - 10 - i), 20));
  }
  */
};

function draw(){ //run on every frame 
  background(200);
  text(dt.toString(), 10, 25);
  if(leftClick){
    if(selected < 0){
      for(let i = 0; i < render.length; i++){
        let pos = render[i].getPosVector();
        let r = render[i].getSize() / 2;
        if ((((mouseX - pos[0]) ** 2) + ((mouseY - pos[1]) ** 2)) <= (r ** 2)){
          selected = i;
          render[i].clear();
        }
      }
    }
    else{
      render[selected].clicked(mouseX, mouseY);
      buffer1 = buffer0;
      buffer0 = render[selected].getPosVector();
    }
  }
  for (let i = 0; i < render.length; i++){ //iterate through all objects
    render[i].move(dt); //update each object
  }
  //console.log(render[0]);
};

function mousePressed(){
  if(mouseButton == LEFT){leftClick = true;}
  if(mouseButton == RIGHT){
    rightClick = true;
    render.push(new Particle(mouseX, mouseY, 30));
  }
}

function mouseReleased(){
  if(mouseButton == LEFT){
    leftClick = false;
    if (selected >= 0){
      render[selected].deselect(buffer0, buffer1, dt);
      selected = -1;
    }
  }
  if(mouseButton == RIGHT){rightClick = false;}
}