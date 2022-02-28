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
        //update position based off velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        //validate new position 
        this.checkWallCollisions();
        //display at new position
        this.display(this.x, this.y, this.size);
    }

    checkWallCollisions(){
        if (this.y + this.size / 2 > MAX_Y){ //bottom wall
            this.y = MAX_Y - this.size / 2; //reset position to within bounds
            this.vy = -this.vy; //reflect velocity
        }
        if (this.y - this.size / 2 < 0){ //top wall
            this.y = this.size / 2; //reset position to within bounds
            this.vy = -this.vy; //reflect velocity
        }
        if (this.x + this.size / 2 > MAX_X){ //right wall
            this.yx = MAX_X - this.size / 2; //reset position to within bounds
            this.vx = -this.vx; //reflect velocity
        }
        if (this.x - this.size / 2 < 0){ //left wall
            this.y = this.size / 2; //reset position to within bounds
            this.vy = -this.vy; //reflect velocity
        }
    }
    
    display(x, y, size){
        fill(this.colour);
        stroke(this.colour);
        ellipse(x, y, size, size);
    }
}