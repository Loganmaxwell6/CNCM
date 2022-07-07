class Entity{
    constructor(cS){
        this.cubeSize = cS;
        this.cubes = [];
        this.createEntity();
        this.sortCubes();
        //this.rotate([0,0,0], true, 13, -13,45)
    }

    createEntity(){
        for (let i = -1; i<=1; i++){
            for (let j = -1; j<= 1; j++){
                for (let k = -1; k <= 1; k++){
                    if(i == 0 && j == 0 && k ==0)continue;
                    this.cubes.push(new Cube(this.cubeSize, color(100, 0, 0), [i*this.cubeSize,j*this.cubeSize,k*this.cubeSize],this.createFaces(i,j,k)))
                }
            }
        }
    }

    createFaces(x, y, z){
        let faces = []
        if (x == -1)faces.push(0);
        if (x == 1)faces.push(5);
        if (y == -1)faces.push(3);
        if (y == 1)faces.push(2);
        if (z == -1)faces.push(4);
        if (z == 1)faces.push(1);
        return faces
    }

    sortCubes(){
        let tempCubes = this.cubes.slice()
        return tempCubes.sort(function(a, b){return a.getAverageX() - b.getAverageX()})
    }

    rotateR(){
        let x = this.cubes[15].getAverageX();
        let y = this.cubes[15].getAverageY();
        let z = this.cubes[15].getAverageZ();
        let xD =  Math.asin(x / 100) * 180/Math.PI;
        let yD = Math.asin(y / 100) * 180/Math.PI;
        let zD = Math.asin(z / 100) * 180/Math.PI;
        console.log(xD, yD, zD);
        this.exclusiveRotate([0,0,0], false, isNaN(xD) ? 90 : xD, isNaN(yD) ? 90 : yD, isNaN(zD) ? 90: zD, [6,7,8,14,15,16,23,24,25]);
    }

    rotate(cP, CW, xD, yD, zD){
        this.cubes.forEach((cube) => cube.rotate(cP, CW, xD, yD, zD));
        this.sortCubes();
        this.x += xD;
        this.y+= yD;
        this.z += zD;
    }

    exclusiveRotate(cP, CW, xD, yD, zD, p){
        this.cubes.forEach((cube, index) => {if(p.includes(index)) {cube.rotate(cP, CW, xD, yD, zD)}});
        this.sortCubes();
    }

    draw(){
        let temp = this.sortCubes()
        temp.forEach((cube) => cube.draw())
    }
}