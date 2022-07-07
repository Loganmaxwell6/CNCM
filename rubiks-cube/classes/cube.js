class Cube{
    constructor(s, c, centrePoints, faces){
        this.size = s
        this.colour = c;
        this.squares = [];
        this.faces = faces
        this.createCubeAboutPoint(centrePoints, faces);
    }

    createCubeAboutPoint(cP, faces){
        let colours = [color(255, 0, 0), color(255, 255, 255), color(0, 0, 255), color(0, 255, 0), color(255, 110, 0), color(255, 255, 0)]
        let black = color(0, 0, 0);
        let points = [new Point(cP[0]-this.size/2, cP[1]-this.size/2, cP[2]+this.size/2), 
        new Point(cP[0]-this.size/2, cP[1]+this.size/2, cP[2]+this.size/2),
        new Point(cP[0]-this.size/2, cP[1]+this.size/2, cP[2]-this.size/2),
        new Point(cP[0]-this.size/2, cP[1]-this.size/2, cP[2]-this.size/2), 
        new Point(cP[0]+this.size/2, cP[1]-this.size/2, cP[2]+this.size/2), 
        new Point(cP[0]+this.size/2, cP[1]+this.size/2, cP[2]+this.size/2),
        new Point(cP[0]+this.size/2, cP[1]+this.size/2, cP[2]-this.size/2),
        new Point(cP[0]+this.size/2, cP[1]-this.size/2, cP[2]-this.size/2)]; 

        this.squares.push(new Square(faces.includes(0) ? colours[4] : black, copyI(points[0]), copyI(points[1]), copyI(points[2]), copyI(points[3])),
        new Square(faces.includes(1) ? colours[1] : black, copyI(points[0]), copyI(points[1]), copyI(points[5]), copyI(points[4])),
        new Square(faces.includes(2) ? colours[2] : black, copyI(points[5]), copyI(points[1]), copyI(points[2]), copyI(points[6])),
        new Square(faces.includes(3) ? colours[3] : black, copyI(points[0]), copyI(points[4]), copyI(points[7]), copyI(points[3])),
        new Square(faces.includes(4) ? colours[5] : black, copyI(points[3]), copyI(points[2]), copyI(points[6]), copyI(points[7])),
        new Square(faces.includes(5) ? colours[0] : black, copyI(points[4]), copyI(points[5]), copyI(points[6]), copyI(points[7])))
    }

    rotate(cP, CW, xD, yD, zD){
        this.squares.forEach((square) => square.rotate(cP, CW, xD, yD, zD));
    }

    getAverageX(){
        let sum = 0;
        this.squares.forEach((square) => sum+= square.getAverageX());
        return sum / 6
    }

    getAverageY(){
        let sum = 0;
        this.squares.forEach((square) => sum+= square.getAverageY());
        return sum / 6
    }

    getAverageZ(){
        let sum = 0;
        this.squares.forEach((square) => sum+= square.getAverageZ());
        return sum / 6
    }
}