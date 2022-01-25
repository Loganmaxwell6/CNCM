class Obj{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 1;
        this.size = size;
        this.damping = 1;
        this.friction = 0;
        this.mass = 1;
        this.colour = color(random(255), random(255), random(255));
        this.gravity = true;
    }   
  
    move(dt){
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.checkCollisions();
        this.display(this.x, this.y, this.size);
    }

    checkCollisions(){
        if(this.y > MAX_Y - this.size / 2){ // bottom wall
            this.vy = this.vy * -this.damping;
            this.vx -= this.vx * this.friction * this.mass;
            this.y = MAXY_Y - this.size / 2;
            //this.y = MAX_Y - ((this.y + this.size / 2) - MAX_Y) - this.size / 2;
        }
        if(this.y <= 0 + this.size / 2){ // top wall
            this.vy = this.vy * -this.damping;
            this.vx -= this.vx * this.friction * this.mass;
            this.y = 0 + this.size / 2;
        }
        if(this.x >= MAX_X - this.size / 2){ // right wall
            this.vx = this.vx * -this.damping;
            this.vy -= this.vy * this.friction * this.mass;
            this.x = MAX_X - this.size / 2;
        }
        if(this.x <= 0 + this.size / 2){ // left wall
            this.vx = this.vx * -this.damping;
            this.vy -= this.vy * this.friction * this.mass;
            this.x = 0 + this.size / 2;
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
    }

    deselect(buffer0, buffer1, dt){
        this.vx = buffer0[0] - buffer1[0];
        this.vy = buffer0[1] - buffer1[1];
        if(this.gravity){this.ay = 1;}
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

    setFriction(friction){
        this.friction = friction;
    }

}