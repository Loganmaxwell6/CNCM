class Particle{

    // initialise attributes for particle given a position and size
    // new Particle(x, y, size)
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.fx = 0;
        this.fy = 0;
        this.mass = 1;
        this.r = radius;
        this.colour = color(random(255), random(255), random(255));
        this.fixed = false;
        this.gravity = false;
        this.interaction = true;
        this.attraction = true;
        
        // not user editable
        this.selected = false;
        this.index = objectList.indexOf(this);
    }

    // recalculate attributes after given timestep
    // calculate in order of change - 
    // a is gradient of v is gradient of d
    move(dt){
        if(!this.fixed){
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;
            this.x += this.vx * dt;
            this.y += this.vy * dt;
        }
        // validate new position to within bounds of canvas
        this.validatePosition();
    }

    validatePosition(){
        if(this.interaction){
            this.checkObjectCollisions();
        }
        this.checkWallCollisions();
    }

    // validate and correct position of object incase it clips
    // into bounding canvas walls 
    checkWallCollisions(){

        // if rightmost part of object goes past right wall
        // then reset position to within bounds and rebound velocity
        if(this.x + this.r >= MAX_X){
            this.x = MAX_X - this.r - (this.x + this.r - MAX_X);
            this.vx = -this.vx;
        }
        // leftmost part past left wall
        if(this.x - this.r <= 0){
            this.x = this.r + (this.x - this.r);
            this.vx = -this.vx;
        }
        // lowest part past bottom wall
        if(this.y + this.r >= MAX_Y){
            this.y = MAX_Y - this.r - (this.y + this.r - MAX_Y);
            this.vy = -this.vy;
        }
        // top part past top wall
        if(this.y - this.r <= 0){
            this.y = this.r + (this.y - this.r);
            this.vy = -this.vy;
        }
    }

    checkObjectCollisions(){
        this.index = objectList.indexOf(this);
        for(let i = 0; i < objectList.length; i++){
            if(i != this.index){
                let o = objectList[i];
                let dx = this.x - o.getX();
                let dy = this.y - o.getY();
                let d = Math.sqrt(dx**2 + dy**2);
                if(d < this.r + o.getR()){
                    this.resolveObjectCollision(i, dx, dy, d);
                }
            }
        }
    }

    resolveObjectCollision(i, dx, dy, d){
        let nx = dx / d;
        let ny = dy / d;
        let overlap = (this.r + objectList[i].getR()) - d;
        // resolves overlap - moves to the edge of the other object
        if(this.fixed){
            objectList[i].setX(objectList[i].getX() + nx * overlap * 0.5);
            objectList[i].setY(objectList[i].getY() + ny * overlap * 0.5);
        }
        else if(objectList[i].isFixed()){
            this.x -= nx * overlap * 0.5;
            this.y -= ny * overlap * 0.5;
        }
        else{
            this.x += nx * overlap * 0.5;
            this.y += ny * overlap * 0.5;
            objectList[i].setX(objectList[i].getX() - nx * overlap * 0.5);
            objectList[i].setY(objectList[i].getY() - ny * overlap * 0.5);
        }
        
        // resolve velocity - bounce off of object
        let dvx = objectList[i].getVX() - this.vx;
        let dvy = objectList[i].getVY() - this.vy;
        let dm = 1/this.mass + 1/objectList[i].getMass();
        let k = -2 * (dvx * nx + dvy * ny) / dm;
        this.vx -= k * nx / this.mass;
        this.vy -= k * ny / this.mass;
        objectList[i].setVX(objectList[i].getVX() + k * nx / objectList[i].getMass());
        objectList[i].setVY(objectList[i].getVY() + k * ny / objectList[i].getMass());
    }

    // draw particle using p5.js methods on canvas
    draw(){
        fill(this.colour);
        stroke(this.colour);
        ellipse(this.x, this.y, 2 * this.r, 2 * this.r);
    }

    select(){
        this.selected = true;
    }

    clicked(x, y){
        this.x = x;
        this.y = y;
    }

    deselect(buffer0, buffer1){
        this.selected = false;
        this.vx = buffer0[0] - buffer1[0];
        this.vy = buffer0[1] - buffer1[1];
    }

    // getters + setters for all attributes
    getX(){return this.x;}
    setX(x){this.x = x;}
    getY(){return this.y;}
    setY(y){this.y = y;}
    getVX(){return this.vx;}
    setVX(vx){this.vx = vx;}
    getVY(){return this.vy}
    setVY(vy){this.vy = vy;}
    getAX(){return this.ax;}
    setAX(ax){this.ax = ax;}
    getAY(){return this.ay;}
    setAY(ay){this.ay = ay;}
    getFX(){return this.fx;}
    setFX(fx){this.fx = fx;}
    getFY(){return this.fy;}
    setFY(fy){this.fy = fy;}
    getMass(){return this.mass;}
    setMass(m){this.mass = m;}
    getR(){return this.r;}
    setR(r){this.r = r;}
    isFixed(){return this.fixed;}
    setFixed(fixed){this.fixed = fixed;}
    isGravity(){return this.gravity;}
    setGravity(gravity){this.gravity = gravity;}
    isInteraction(){return this.interaction;}
    setInteraction(interaction){this.interaction = interaction;}
    isAttraction(){return this.attraction;}
    setAttraction(attraction){this.attraction = attraction;}
    getColour(){return this.colour;}
    getColourHex(){
        let r = this.colour.levels[0];
        let g = this.colour.levels[1];
        let b = this.colour.levels[2];
        return "#" + r.toString(16) + g.toString(16) + b.toString(16);
    }
    setColour(colour){this.colour = colour;}
    setColourHex(colour){
        let r = parseInt(colour.substring(1, 3), 16);
        let g = parseInt(colour.substring(3, 5), 16);
        let b = parseInt(colour.substring(5, 7), 16);
        this.colour = color(r, g, b);
    }
}