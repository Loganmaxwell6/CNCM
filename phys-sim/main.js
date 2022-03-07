var render = []; //list of all objects on the canvas
var dt = 0; //timestep - initially 0 to stop simulation by default
var graphDt = 0;
var selectedObjectGraph;
var graphThreshold = 0.05;
var MAX_X; //bounds of canvas
var MAX_Y;
var MAX_SPEED;
var MIN_SPEED = dt * 0.1; 
var G = 1000;
var GRAV = true;
var leftClick = false;
var rightClick = false;
var selected = -1;
var buffer0;
var buffer1;
var fCount = 0;

var data = {
  labels: [0],
  datasets: [{
    label: "",
    data: [0],
    fill: false,
    borderColor: 'rgb(0,0,0)',
  }]
};


// change to scatter + https://stackoverflow.com/questions/46232699/display-line-chart-with-connected-dots-using-chartjs
var objectGraph = new Chart($('#objectGraph'), {
    type: 'line',
    data: data,
    options: {
      animation: false,
      elements: {
        point: {
          radius: 0,
        }
      }
    },
});

function setGraphObject(i){
  selectedObjectGraph = i;
  r = i.getColour().levels[0];
  g = i.getColour().levels[1];
  b = i.getColour().levels[2];
  colour = 'rgb('+r.toString()+','+g.toString()+','+b.toString()+')';
  data = {
    labels: [0],
    datasets: [{
      label: "Particle",
      data : [i.vx],
      fill: false,
      borderColor: colour,
      fillColor: colour,
    }]
  };
  objectGraph.data = data;
  objectGraph.update();
}

function addDataPointToGraph(val, valPrevious){
  let labels = objectGraph.data.labels;
  let last = labels[labels.length - 1];
  let newTime = last + graphDt;
  objectGraph.data.labels.push(Math.round((newTime - dt) * 100) / 100);
  objectGraph.data.datasets[0].data.push(valPrevious);
  objectGraph.data.labels.push(Math.round(newTime * 100) / 100);
  objectGraph.data.datasets[0].data.push(val);
  objectGraph.update();
}

function addDataPointToGraph(val){
  let labels = objectGraph.data.labels;
  let last = labels[labels.length - 1];
  let newTime = last + graphDt;
  objectGraph.data.labels.push(Math.round((newTime + dt) * 100) / 100);
  objectGraph.data.datasets[0].data.push(val);
  objectGraph.update();
}

function resetGraph(){
  setGraphObject(selectedObjectGraph);
  objectGraph.data = data;
  objectGraph.update();
};

function getDtSlider(val){
  dt = (val - 100) / 100;
}

function setup(){ //run once to initialise program
  var canvas = createCanvas(windowWidth * 0.55, windowHeight * 0.55);
  canvas.parent("canvasContainer");
  frameRate(60);
  MAX_X = windowWidth * 0.55;
  MAX_Y = windowHeight * 0.55;
  MAX_SPEED = Math.min(MAX_Y, MAX_X) - 50
  /*
  for (let i = 0; MAX_Y - i >= 10; i += 20){
    render.push(new Particle((i + 10), (MAX_Y - 10 - i), 20));
  }
  */
};

function windowResized(){
  resizeCanvas(windowWidth * 0.55, windowHeight * 0.55);
  MAX_X = windowWidth * 0.55;
  MAX_Y = windowHeight * 0.55;
  MAX_SPEED = Math.min(MAX_Y, MAX_X) - 50
}

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
  if(GRAV){
    attractiveForces(render, dt);
  }
  else{
    for (let i = 0; i < render.length; i++){ //iterate through all objects
      if (render[i] == selectedObjectGraph){
        let previous = selectedObjectGraph.vx;
        render[i].move(dt); //update each object
        if (Math.abs(selectedObjectGraph.vx - previous) > graphThreshold){
          addDataPointToGraph(selectedObjectGraph.vx, previous);
          graphDt = 0;
        }
        else{
          graphDt += dt;
        }
      }
      else{
        render[i].move(dt);
      }
    }
  }
  /*
  if (dt != 0 && selected == -1){
    if (fCount >= (30)){
      addDataPointToGraph(selectedObjectGraph.vx);
      fCount = 0;
      graphDt = 0;
    }
    fCount++;
  }
  */
};

function mousePressed(){
  if(mouseButton == LEFT){leftClick = true;}
  if(mouseButton == RIGHT){
    rightClick = true;
    if (mouseX < MAX_X && mouseY < MAX_Y){
      render.push(new Particle(mouseX, mouseY, 30));
      //setGraphObject(render[render.length - 1]);
    };
  }
}

function mouseReleased(){
  if(mouseButton == LEFT){
    leftClick = false;
    if (selected >= 0){
      render[selected].deselect(buffer0, buffer1);
      selected = -1;
    }
  }
  if(mouseButton == RIGHT){rightClick = false;}
}