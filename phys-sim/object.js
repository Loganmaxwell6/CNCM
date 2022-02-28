class Particle{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 1;
        this.size = size;
        this.colour = color(random(255), random(255), random(255));
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
            let offset = this.y + (this.size / 2) - MAX_Y; //how far the particle has gone past the wall
            this.y = MAX_Y - this.size / 2 - offset; //set reflected position
            this.vy = -this.vy; //reflect velocity
        }
        if(this.y <= 0 + this.size / 2){ // top wall
            this.y = 0 + this.size / 2;
            this.vy = -this.vy;
        }
        if(this.x >= MAX_X - this.size / 2){ // right wall
            this.x = MAX_X - this.size / 2;
            this.vx = -this.vx;
        }
        if(this.x <= 0 + this.size / 2){ // left wall
            this.x = 0 + this.size / 2;
            this.vx = -this.vx;
        }
    }
    
    display(x, y, size){
        fill(this.colour);
        stroke(this.colour);
        ellipse(x, y, size, size);
    }
}