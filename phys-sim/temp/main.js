var render = []; //list of all objects on the canvas
var dt = 0; //timestep - initially 0 to stop simulation by default
var graphDt = 0;
var selectedObjectGraph = -1;
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
  for(let i = 0; i < render.length; i++){
    render[i].x = 0.55 * windowWidth * (render[i].x / MAX_X);
    render[i].y = 0.55 * windowHeight * (render[i].y / MAX_Y);
  }
  MAX_X = windowWidth * 0.55;
  MAX_Y = windowHeight * 0.55;
  MAX_SPEED = Math.min(MAX_Y, MAX_X) - 50
}

function draw(){ //run on every frame 
  background(200);
  fill(0);
  stroke(0);
  text(dt.toString(), 10, 25);
  if(leftClick){
    if(selected < 0){
      for(let i = 0; i < render.length; i++){
        let pos = render[i].getPosVector();
        let r = render[i].getSize() / 2;
        if ((((mouseX - pos[0]) ** 2) + ((mouseY - pos[1]) ** 2)) <= (r ** 2)){
          selected = i;
          render[i].selected = true;
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
  if(GRAV && dt != 0 && render.length != 0){
    attractiveForces();
    let collisions = [];
    for (let [i, o1] of render.entries()) {
        for (let [j, o2] of render.entries()) {
            if (i < j) {
                let {collisionInfo, collided} = checkCollision(o1, o2);
                if (collided) {
                    collisions.push(collisionInfo);
                }
            }
        }
    }
    for(let col of collisions){
      resolveCollisionWithBounce(col);
    }
    for(let i = 0; i < render.length; i++){
      
      if(d > MAX_D)// if move dt/2 != move dt / 2
      render[i].move(dt);
      render[i].display(render[i].getPosVector()[0], render[i].getPosVector()[1], render[i].getSize())
    }
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
  if (dt != 0 && selected != selectedObjectGraph && selectedObjectGraph != -1){
    if (fCount >= (30)){
      addDataPointToGraph(selectedObjectGraph.vx);
      fCount = 0;
      graphDt = 0;
    }
    fCount++;
  }
};

function mousePressed(){
  if(mouseButton == LEFT){leftClick = true;}
  if(mouseButton == RIGHT){
    rightClick = true;
    if (mouseX < MAX_X && mouseY < MAX_Y){
      render.push(new Particle(mouseX, mouseY, 30));
      setGraphObject(render[render.length - 1]);
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

function attractiveForces(){
  for(let i = 0; i < render.length; i++){
      render[i].setFX(0);
      render[i].setFY(0);
  }
  for(let i = 0; i < render.length; i++){
      for(let j = 0; j < render.length; j++){
          if(i < j){
              let posi = render[i].getPosVector();
              let posj = render[j].getPosVector();
              let distX = posj[0] - posi[0];
              let distY = posj[1] - posi[1];
              let dist = Math.sqrt(distX ** 2 + distY ** 2);
              if(dist <= 0){
                  dist = 0.1;
              }
              let force = G * (render[i].getMass() * render[j].getMass()) / (dist ** 2); //f = GmM/r^2
              let fx = force * distX / dist;
              let fy = force * distY / dist;
              render[i].setFX(render[i].getFX() + fx);
              render[i].setFY(render[i].getFY() + fy);
              render[j].setFX(render[j].getFX() - fx);
              render[j].setFY(render[j].getFY() - fy);
          }
      }
  }
  for(let i = 0; i < render.length; i++){
    if(i != selected){
      render[i].setAX(render[i].getFX() / render[i].getMass());
      render[i].setAY(render[i].getFY() / render[i].getMass());
      if(render[i].gravity){render[i].setAY(render[i].getAY() + 1);}
    }
  }
}