var fr = 600;
var dt = 2;
var render = [];
var MAX_X = 1500;
var MAX_Y = 700;
var leftClick = false;
var rightClick = false;
var selected = -1;
var buffer0;
var buffer1;

document.oncontextmenu = function() {
  return false;
}

function setup(){
  var canvas = createCanvas(MAX_X, MAX_Y);
  canvas.parent("mainCanvas");
  frameRate(fr);
}

function draw(){
  background(200);
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
  for (let i = 0; i < render.length; i++){
    render[i].move(dt);
  }
}

function mousePressed(){
  if(mouseButton == LEFT){leftClick = true;}
  if(mouseButton == RIGHT){rightClick = true;render.push(new Obj(mouseX, mouseY, 20));}
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

function keyPressed(){
  if(key == " "){
    generateGuy();
  }
  if(key == "s"){
    shuffleGuy();
  }
}

function generateGuy(){
  render.push(new Obj(MAX_X/2,MAX_Y/2,10));
  render[render.length-1].setVX(random(6)-3);
  render[render.length-1].setVY(random(6)-3);
  render[render.length-1].setAX(random(2)-1);
  render[render.length-1].setAY(random(2)-1);
  render[render.length-1].setMass(random(10));
  render[render.length-1].setDamping(random(10)/10);
  render[render.length-1].setFriction(random(10)/1000);
}

function shuffleGuy(){
  for(let i = 0; i < render.length;i++){
    render[i].setVX(random(4)-2);
    render[i].setVY(random(4)-2);
    render[i].setAX(random(4)-2);
    render[i].setAY(random(4)-2);
    render[i].setMass(random(10));
    render[i].setDamping(random(10)/10);
    render[i].setFriction(random(10)/1000);
  }
}
