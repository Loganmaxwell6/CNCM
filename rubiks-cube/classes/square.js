class Square{
    constructor(c, ...p){
        this.colour = c
        this.points = p
    }

    rotate(cP, CW, xD, yD, zD){
        this.points.forEach((point) =>{
            point.rotateX(cP, CW, xD);
            point.rotateY(cP, CW, yD);
            point.rotateZ(cP, CW, zD);
            point.convertPoint();
        })
    }

    draw(){
        fill(this.colour);
        quad(this.points[0].x2d, this.points[0].y2d,
            this.points[1].x2d, this.points[1].y2d,
            this.points[2].x2d, this.points[2].y2d,
            this.points[3].x2d, this.points[3].y2d)
    }

    getAverageX(){
        let sum = 0;
        this.points.forEach((point) => sum+=point.x3d);
        return sum / 4;
    }

    getAverageY(){
        let sum = 0;
        this.points.forEach((point) => sum+=point.y3d);
        return sum / 4;
    }

    getAverageZ(){
        let sum = 0;
        this.points.forEach((point) => sum+=point.z3d);
        return sum / 4;
    }
}