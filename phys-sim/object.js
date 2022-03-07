class Particle{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 1;
        this.fx = 0;
        this.fy = 0;
        this.mass = 1;
        this.size = size;
        this.colour = color(random(255), random(255), random(255));
        this.damping = 0.97;
        this.gravity = false;
    }

    move(dt){
        //update velocity
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        //validate velocity
        if (this.vx > MAX_SPEED || this.vx < -MAX_SPEED){
            this.vx = Math.sign(this.vx) * MAX_SPEED;
        }
        if (this.vy > MAX_SPEED || this.vy < -MAX_SPEED){
            this.vy = Math.sign(this.vy) * MAX_SPEED;
        }
        if (this.vx < MIN_SPEED && this.vx > -MIN_SPEED){
            this.vx = 0;
        }
        if (this.vy < MIN_SPEED && this.vy > -MIN_SPEED){
            this.vy = 0;
        }
        //update position based off velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        //validate new position 
        this.checkWallCollisions();
        //display at new position
        this.display(this.x, this.y, this.size);
    }

    checkWallCollisions(){
        if(this.y + this.size / 2 > MAX_Y){ // bottom wall
            this.y = MAX_Y - this.size / 2;
            this.vy = -this.vy * (this.damping ** (1 * Math.sign(dt)));
            /*
            let offset = this.y + (this.size / 2) - MAX_Y; //how far the particle has gone past the wall
            this.y = MAX_Y - this.size / 2 - offset; //set reflected position
            this.vy = -this.vy; //reflect velocity
            */
        }
        if(this.y <= 0 + this.size / 2){ // top wall
            this.y = 0 + this.size / 2;
            this.vy = -this.vy * (this.damping ** (1 * Math.sign(dt)));
        }
        if(this.x >= MAX_X - this.size / 2){ // right wall
            this.x = MAX_X - this.size / 2;
            this.vx = -this.vx * (this.damping ** (1 * Math.sign(dt)));
        }
        if(this.x <= 0 + this.size / 2){ // left wall
            this.x = 0 + this.size / 2;
            this.vx = -this.vx * (this.damping ** (1 * Math.sign(dt)));
        }
    }
    
    display(x, y, size){
        fill(this.colour);
        stroke(this.colour);
        ellipse(x, y, size, size);
    }

    clicked(x, y){
        this.x = x;
        this.y = y;
    }

    clear(){
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
    }

    deselect(buffer0, buffer1){
        this.vx = buffer0[0] - buffer1[0];
        this.vy = buffer0[1] - buffer1[1];
        if(this.gravity){this.ay = 1;}
    }

    getColour(){
        return this.colour;
    }

    getPosVector(){
        return [this.x, this.y];
    }

    getMass(){
        return this.mass;
    }

    getSize(){
        return this.size;
    }

    getVX(){
        return this.vx;
    }

    getVY(){
        return this.vy;
    }

    setVX(vx){
        this.vx = vx;
    }

    setVY(vy){
        this.vy = vy;
    }

    setAX(ax){
        this.ax = ax;
    }

    setAY(ay){
        this.ay = ay;
    }

    getFX(){
        return this.fx;
    }

    getFY(){
        return this.fy;
    }

    setFX(fx){
        this.fx = fx;
    }

    setFY(fy){
        this.fy = fy;
    }

}

function attractiveForces(dt, render){
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
        let object = render[i];
        object.setAX(object.getFX() / object.getMass());
        object.setAY(object.getFY() / object.getMass());
        object.move(dt);
    }
}

function interactionForces(){

}