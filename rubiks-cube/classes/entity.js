class Entity{
    constructor(cS){
        this.cubeSize = cS;
        this.cubes = [];
        this.createEntity();
        this.sortCubes();
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
        this.cubes.sort(function(a, b){return a.getAverageX() - b.getAverageX()})
    }

    rotate(cP, CW, xD, yD, zD){
        this.cubes.forEach((cube) => cube.rotate(cP, CW, xD, yD, zD));
        this.sortCubes()
    }

    draw(){
        this.cubes.forEach((cube) => cube.draw())
    }
}