class Collision {
    constructor(o1, o2, dx, dy, d) {
        this.o1 = o1;
        this.o2 = o2;

        this.dx = dx;
        this.dy = dy;
        this.d = d;
    }
}

function checkCollision(o1, o2) {
    let dx = o2.x - o1.x;
    let dy = o2.y - o1.y;
    let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (d < o1.size/2 + o2.size/2) {
        return  {
            collisionInfo: new Collision(o1, o2, dx, dy, d),
            collided: true
        }
    }
    return  {
        collisionInfo: null,
        collided: false
    }
}

function resolveCollision(info) {  // "info" is a Collision object from above
    let nx = info.dx /info.d;  // Compute eigen vectors
    let ny = info.dy /info.d;
    let s = info.o1.size/2 + info.o2.size/2 - info.d;
    info.o1.x -= nx * s/2;  // Move first object by half of collision size
    info.o1.y -= ny * s/2;
    info.o2.x += nx * s/2;  // Move other object by half of collision size in opposite direction
    info.o2.y += ny * s/2;
}

function resolveCollisionWithBounce(info) {
    let nx = info.dx /info.d;
    let ny = info.dy /info.d;
    let s = info.o1.size/2 + info.o2.size/2 - info.d;
    if(info.o1.seleted){
        info.o2.x += nx * s/2;
        info.o2.y += ny * s/2;
    }
    else if(info.o2.selected){
        info.o1.x -= nx * s/2;
        info.o1.y -= ny * s/2;
    }
    else{
        info.o1.x -= nx * s/2;
        info.o1.y -= ny * s/2;
        info.o2.x += nx * s/2;
        info.o2.y += ny * s/2;
    }
    

    let k = -2 * ((info.o2.vx - info.o1.vx) * nx + (info.o2.vy - info.o1.vy) * ny) / (1/info.o1.mass + 1/info.o2.mass);
    info.o1.vx -= k * nx / info.o1.mass;  // Same as before, just added "k" and switched to "m" instead of "s/2"
    info.o1.vy -= k * ny / info.o1.mass;
    info.o2.vx += k * nx / info.o2.mass;
    info.o2.vy += k * ny / info.o2.mass;
}