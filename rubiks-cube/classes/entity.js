class Entity{
    constructor(cS, aQ){
        this.cubeSize = cS;
        this.cubes = [];

        this.faces = [[8,7,6,5,4,3,2,1,0],[2,11,19,5,13,22,8,16,25],[25,24,23,16,15,14,8,7,6], 
                [2,1,0,11,10,9,19,18,17], [0,9,17,3,12,20,6,14,23], [19,18,17,22,21,20,25,24,23],
            [11,10,9,13,12,16,15,14],[1,10,18,4,21,7,15,24],[22,21,20,13,12,5,4,3]];
        this.createEntity();
        this.animationFrames = 0;
        //this.rotate([0,0,0], true, 13, -13,45)

        this.xD = 0;
        this.yD = 0;
        this.zD = 0;

        this.rotations = [];
        this.arrayEquals = aQ
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
    
    calculateAnimatedRotateDegrees(faceNum){
        let target = this.faces[faceNum][4]
        this.xD = this.cubes[target].getAverageX() * 0.9;
        this.yD = this.cubes[target].getAverageY() * 0.9;
        this.zD = this.cubes[target].getAverageZ() * 0.9;
    }

    rotate(cP, CW, xD, yD, zD){
        this.cubes.forEach((cube) => cube.rotate(cP, CW, xD, yD, zD));

        this.rotations.push([CW, xD, yD, zD]);
    }

    exclusiveRotate(cP, CW, xD, yD, zD, p){
        this.cubes.forEach((cube, index) => {if(p.includes(index)) {cube.rotate(cP, CW, xD, yD, zD)}});
    }

    sortSquares(squares){
        return squares.sort(function(a, b){return a.getAverageX() - b.getAverageX()})
    }

    checkSolved(){
        for (let i = 0; i < this.faces.length - 3; i++){
            let checkColour = this.cubes[this.faces[i][4]].squares[i].colour.levels;
            for (let j = 0; j < this.faces[i].length; j++){
                if (!(this.arrayEquals(this.cubes[this.faces[i][j]].squares[i].colour.levels, checkColour))){
                    return false;
                }
            }
        }
        return true;
    }

    draw(){
        //this.sortCubes()
        let temp = [];
        for (let i in this.cubes){
            for (let j in this.cubes[i].squares){
                temp.push(this.cubes[i].squares[j])
            }
        }
        this.sortSquares(temp).forEach((square)=>square.draw());
    }
}