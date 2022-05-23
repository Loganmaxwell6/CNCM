var objectList = []; // initialise empty list of objects to render
var MAX_X, MAX_Y; // initialise + set bounds of canvas
var MAX_SPEED; 
var dt = 1; // timestep
var leftClick = false; // bool values for each mouse button
var rightClick = false;
var selectedObject = null; // index of object that has been clicked
var buffer0, buffer1; // buffer frame storage for deselect
// initialise graph canvas
var objectGraph = new Chart($('#objectGraph'), {
  type: 'line',
  data: [],
  options: {
    animation: false,
    elements: {
      point: {
        radius: 0
      }
    }
  }});
var graphObject = null; // index of selected object for graph
var graphProperty = null; // name of property selected
var G = 1000; // gravitational constant - 1000 works well at this size
var savedPositions = []; // saved start positions for reset and load
var fcount = 0; // counter to sample values after every 20 frames
var fcountmax = 20;

var defaultData = {
  labels: [0],
  datasets: [{
    label: "",
    data: [0],
    fill: false,
    borderColor: 'rgb(0, 0, 0)',
  }]
}

// initialise graph with default data
function initGraph(){
  objectGraph.data = defaultData;
  objectGraph.update();
}

// p5 setup func - run once at start of execution
function setup(){ 
  // create canvas and attatch to container
  MAX_X = windowWidth * 0.55;
  MAX_Y = windowHeight * 0.55;
  var canvas = createCanvas(MAX_X, MAX_Y);
  canvas.parent("canvasContainer");

  frameRate(60);
  
  // limit max speed so particles do not travel full length in one frame
  MAX_SPEED = Math.min(MAX_X, MAX_Y) - 50;

  // create blank graph
  initGraph();
}

// p5 draw func - run on every frame
function draw(){
  background(200); // clear screen on each frame - redraws objects
  fill(0); // text colour for dt val
  stroke(0);
  text(dt.toString(), 278, 25); // display dt value
  // find selected object
  if(leftClick && selectedObject == null){
    for(let i = 0; i < objectList.length; i++){
      let tempx = objectList[i].getX();
      let tempy = objectList[i].getY();
      let tempr = objectList[i].getR();
      // use circle equation to check if mouse is inside object
      let dist = (mouseX - tempx) ** 2 + (mouseY - tempy) ** 2;
      if(dist <= (tempr ** 2)){
        // select object
        selectedObject = i;
        objectList[i].select();
      }
    }
  }
  // after object is selected
  else if(leftClick && selectedObject != null){
    // move object to mouse position and update buffers
    objectList[selectedObject].clicked(mouseX, mouseY);
    buffer1 = buffer0;
    buffer0 = [objectList[selectedObject].getX(), objectList[selectedObject].getY()];
  }

  if(objectList.length != 0){
    // clear force accumulators
    for(let i = 0; i < objectList.length; i++){
      objectList[i].setFX(0);
      objectList[i].setFY(0);
    }
    // for every pair of objects, compute force between them
    for(let i = 0; i < objectList.length; i++){
      for(let j = 0; j < objectList.length; j++){
        if(i < j && objectList[i].isAttraction() && objectList[j].isAttraction()){
          resolveAttraction(objectList[i], objectList[j]);
        }
      }
    }

    // iterate through object list + recalculate position
    for(let i = 0; i < objectList.length; i++){
      objectList[i].move(dt);
      objectList[i].draw();
    }

    // update acceleration from force  accumulators
    for(let i = 0; i < objectList.length; i++){
      objectList[i].setAX(objectList[i].getFX() / objectList[i].getMass());
      objectList[i].setAY(objectList[i].getFY() / objectList[i].getMass());
    }
  }
  // sample for graph
  if(dt != 0 && fcount >= fcountmax && graphObject != null && graphProperty != null){
    fcount = 0;
    // converts string dropdown selects to javascript code
    addToGraph(eval("objectList[graphObject].get" + graphProperty + "()")); 
  }
  else{
    fcount++;
  }
}

// add object to dropdown list when added to canvas
function addToObjectSelect(){
  let temphtml = document.getElementById("objectSelect").innerHTML;
  // adds template to dropdown
  temphtml += '<option onclick= "setSelectedObject()" value="' + (objectList.length - 1) + '">Object ' + objectList.length + '</option>';
  document.getElementById("objectSelect").innerHTML = temphtml;
}

function setSelectedObject(obj){
  graphObject = obj;
  setGraphObject(graphObject);
}

function setSelectedProperty(prop){
  graphProperty = prop.toUpperCase();
}

// adds the template to the object panel on creation of particle
function addToObjectPanel(){
  if(objectList.length == 1){
    document.getElementById("panelContainer").innerHTML = "";
  } 
  let pos = objectList.length - 1;
  let temphtml = document.getElementById("panelContainer").innerHTML;
  // full html template for panel - each particle has its own panel added
  temphtml += (
    '<div class="objectPanelObject" id="objectPanelObject' + (pos) + 
    '">Object ' + (pos+1) + 
    '<form><input type="color" id="colourPicker' + (pos) + '"></form>' + 
    '<span>x : <input type="text" id="' + (pos) + ',' + 'x"></span>' + 
    '<span>y : <input type="text" id="' + (pos) + ',' + 'y"></span>' + 
    '<span>vx : <input type="text" id="' + (pos) + ',' + 'vx"></span>' + 
    '<span>vy : <input type="text" id="' + (pos) + ',' + 'vy"></span>' + 
    '<span>ax : <input type="text" id="' + (pos) + ',' + 'ax"></span>' + 
    '<span>ay : <input type="text" id="' + (pos) + ',' + 'ay"></span>' + 
    '<span>size : <input type="text" id="' + (pos) + ',' + 'r"></span>' +
    '<span>mass : <input type="text" id="' + (pos) + ',' + 'mass"></span>' +
    '<span>attraction : <input type="checkbox" id="' + (pos) + ',' + 'attraction"></span>' +
    '<span>interaction : <input type="checkbox" id="' + (pos) + ',' + 'interaction"></span>' +
    '<span>fixed : <input type="checkbox" id="' + (pos) + ',' + 'fixed"></span>' +
    '</div>'
  );
  document.getElementById("panelContainer").innerHTML = temphtml;
  // bind onchange events to inputs
  document.getElementById("colourPicker" + (objectList.length - 1).toString()).onchange = function(){
    objectList[objectList.length - 1].setColourHex(this.value);
    if(objectList.length - 1 == graphObject){
      setGraphObject(graphObject);
    }
  };
  document.getElementById("colourPicker" + (objectList.length - 1).toString()).value = objectList[objectList.length - 1].getColourHex();
  document.querySelectorAll('input[type="text"], input[type="checkbox"]').onchange = function(){
    let temp = this.id.split(",");
    let obj = temp[0];
    let prop = temp[1];
    eval("objectList[obj].set" + prop + "(this.value)");
    if(obj == graphObject){
      setGraphObject(graphObject);
    }
  }
}

// mousepress event handler
function mousePressed(){
  if(mouseButton == LEFT){leftClick = true;}
  if(mouseButton == RIGHT){
    rightClick = true;
    // validate mouse position before place object
    if (mouseX < MAX_X && mouseY < MAX_Y){
      objectList.push(new Particle(mouseX, mouseY, 20));
      addToObjectSelect();
      addToObjectPanel();
    }
  }
}
function mouseReleased(){
  if(mouseButton == LEFT){
    leftClick = false;
    // if an object was selected, run deselect method with buffer frames
    if (selectedObject != null){
      objectList[selectedObject].deselect(buffer0, buffer1);
      selectedObject = null;
    }
  }
  if(mouseButton == RIGHT){rightClick = false;}
}

function windowResized(){
  // scale objects to new resolution
  for(let i = 0; i < objectList.length; i++){
    objectList[i].setX( 0.55 * windowWidth * (objectList[i].getX() / MAX_X));
    objectList[i].setY( 0.55 * windowHeight * (objectList[i].getY() / MAX_Y));
  }

  MAX_X = windowWidth * 0.55;
  MAX_Y = windowHeight * 0.55;
  resizeCanvas(MAX_X, MAX_Y);
}

function getDtSlider(val){
  dt = val / 100;
}

function resetGraph(){
  setGraphObject(graphObject);
}

// sets up graph for a selected object
function setGraphObject(val){
  // if no selected object then reset graph
  if(val == null){
    initGraph();
  }
  else{
    graphObject = parseInt(val);
    let o = objectList[val];
    // get colour in right format for graph
    let r = o.getColour().levels[0];
    let g = o.getColour().levels[1];
    let b = o.getColour().levels[2];
    let colour = "rgb(" + r.toString() + "," + g.toString() + "," + b.toString() + ")";
    // set up new data frame
    let data = {
      labels: [0],
      datasets: [{
        label: "Object " + (val + 1),
        data: [],
        fill: false,
        borderColor: colour,
        fillColor: colour,
      }]
    };
    // update graph
    objectGraph.data = data;
    objectGraph.update();
  }
}

// adds point to graph
function addToGraph(val){
  let labels = objectGraph.data.labels.slice();
  let data = objectGraph.data.datasets[0].data.slice();
  // starts with [0] - []
// so add one value to match 0, then add next predicted timestep
  data.push(val);
  labels.push(labels[labels.length - 1] + fcountmax * dt);
  objectGraph.data.labels = labels;
  objectGraph.data.datasets[0].data = data;
  objectGraph.update();
}

// calculates force of attraction between two objects
function resolveAttraction(o1, o2){
  let dx = o1.getX() - o2.getX();
  let dy = o1.getY() - o2.getY();
  let d = Math.sqrt(dx**2 + dy**2);
  // f = g m1m2/r^2
  let f = (G * o1.getMass() * o2.getMass()) / (d**2);
  // help with clipping when objects are close
  if(d <= 0){
    d = 0.1;
  }
  let fx = f * dx / d;
  let fy = f * dy / d;
  // add to forces
  o1.setFX(o1.getFX() - fx);
  o1.setFY(o1.getFY() - fy);
  o2.setFX(o2.getFX() + fx);
  o2.setFY(o2.getFY() + fy);
}

// full reset of simulation to saved setup
function reset(){
  objectList = savedPositions.slice();
  document.getElementById("panelContainer").innerHTML = "";
  document.getElementById("objectSelect").innerHTML = '<option value="" disabled selected>Select object</option>';
  initGraph();
}

// saves the objectList array as a JSON object to be downloaded
function save(){
  if(objectList.length != 0){
    let f = JSON.stringify(objectList); // convert to JSON object as a string
    let file = new Blob([f], {type: 'text/plain'}); // create a Blob object - for file writing to local storage
    // create blank anchor to attatch blob 
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(file);
    a.download = 'save.json';
    // simulate a click on a link to download the file
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }
}

// accepts user file input into the objectList array
function load(file){
  // validate file type as json
  if(file.type != "application/json"){
    alert("Invalid file type");
  } 
  else{
    try{
      let a = window.URL.createObjectURL(file);
      let reader = new FileReader();
      // reader needs time to read file, so function bound to onload
      reader.onload = function(){
        let data = JSON.parse(this.result);
        savedPositions = data;
        reset();
      };
      let readfile = reader.readAsDataURL(a); 
    } catch(SyntaxError){ // json parser throws syntaxerror if it cannot parse as json
      alert("Unable to parse file");
    }
  }
}

// pause button, stores last dt value so that play resumes at same speed
function pause(){
  storedt = dt;
  dt = 0;
}

function play(){
  dt = storedt;
}