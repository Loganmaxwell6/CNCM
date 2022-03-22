class Obj{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 1;
        this.mass = 1;
        this.fx = this.mass * this.ax;
        this.fy = this.mass * this.ay;
        this.size = size;
        this.damping = 1;
        this.colour = color(random(255), random(255), random(255));
        this.gravity = true;
    }   
  
    move(dt){
        this.ax = this.fx / this.mass;
        this.ay = this.fy / this.mass;
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        if (this.vx > MAX_SPEED || this.vx < -MAX_SPEED){
            this.vx = Math.sign(this.vx) * MAX_SPEED;
        }
        if (this.vy > MAX_SPEED || this.vy < -MAX_SPEED){
            this.vy = Math.sign(this.vy) * MAX_SPEED;
        }
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.checkWallCollisions();
        this.display(this.x, this.y, this.size);
    }

    checkWallCollisions(){
        if(this.y + this.size / 2 > MAX_Y){ // bottom wall
            this.y = MAX_Y - this.size / 2;
            this.vy = -this.vy * this.damping;
            this.ay = -this.ay;
        }
        if(this.y <= 0 + this.size / 2){ // top wall
            this.y = 0 + this.size / 2;
            this.vy = -this.vy * this.damping;
            this.ay = -this.ay;
        }
        if(this.x >= MAX_X - this.size / 2){ // right wall
            this.x = MAX_X - this.size / 2;
            this.vx = -this.vx * this.damping;
            this.ax = -this.ax;
        }
        if(this.x <= 0 + this.size / 2){ // left wall
            this.x = 0 + this.size / 2;
            this.vx = -this.vx * this.damping;
            this.ax = -this.ax;
        }
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
        this.fx = 0;
        this.fy = 0;
    }

    deselect(buffer0, buffer1, dt){
        this.vx = buffer0[0] - buffer1[0];
        this.vy = buffer0[1] - buffer1[1];
        if(this.gravity){this.fy = 1 * this.mass;}
    }
  
    display(x, y, size){
      fill(this.colour);
      stroke(this.colour);
      ellipse(x, y, size, size);
    }

    getPosVector(){
        return [this.x, this.y];
    }

    getMovementVector(){
        return [this.vx, this.vy];
    }

    getAccVector(){
        return [this.ax, this.ay];
    }

    getSize(){
        return this.size;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
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

    setMass(mass){
        this.mass = mass;
    }

    toggleGrav(){
        this.gravity = !this.gravity;
    }

    setDamping(damping){
        this.damping = damping;
    }

}