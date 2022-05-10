class Particle{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.fx = 0;
        this.fy = 0;
        this.mass = 1;
        this.size = size;
        this.colour = color(random(255), random(255), random(255));
        this.damping = 1;
        this.gravity = false;
        this.fixed = false;
        this.selected = false;
    }

    move(dt){
        if(!this.fixed){
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
        }
        //validate new position 
        this.checkWallCollisions();
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
        this.selected = false;
        this.vx = buffer0[0] - buffer1[0];
        this.vy = buffer0[1] - buffer1[1];
        if(this.gravity){
            this.ay = 1;
        }
    }

    toggleGrav(){
        if(this.gravity){
            this.ay -= 1;
        }
        else{
            this.ay += 1;
        }
        this.gravity = !this.gravity;
    }

    toggleFixed(){
        this.fixed = !this.fixed;
    }

    setDamping(damping){
        this.damping = damping;
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

    getV(){
        return Math.sqrt((this.vx ** 2) + (this.vy ** 2));
    }

    setVX(vx){
        this.vx = vx;
    }

    setVY(vy){
        this.vy = vy;
    }
    
    getAX(){
        return this.ax;
    }

    getAY(){
        return this.ay;
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

    setMass(mass){
        this.mass = mass;
    }
}