class Entity{
    constructor(cS){
        this.cubeSize = cS;
        this.cubes = [];

        this.faces = [[8,7,6,5,4,3,2,1,0],[2,11,19,5,13,22,8,16,25],[25,24,23,16,15,14,8,7,6], 
                [2,1,0,11,10,9,19,18,17], [0,9,17,3,12,20,6,14,23], [19,18,17,22,21,20,25,24,23]];
        this.createEntity();
        this.x = 0;
        this.y = 0;
        this.z = 0;
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
    
    animatedRotate(){
        function animatedRotate(ent){
            console.log(ent)
            ent.exclusiveRotate([0,0,0], true, x/animationTime, y/animationTime, z/animationTime, ent.faces[2]);
        }
        let x = this.cubes[15].getAverageX() * 0.9;
        let y = this.cubes[15].getAverageY() * 0.9;
        let z = this.cubes[15].getAverageZ() * 0.9;
        

        for (let i = 0; i < animationTime; i++){
            setTimeout(animatedRotate.bind(this, this), 1);
        }
        // let xD =  Math.asin(x / 100) * (180/Math.PI);
        // let yD = Math.asin(y / 100) * (180/Math.PI);
        // let zD = Math.asin(z / 100) * (180/Math.PI);
    }

    rotate(cP, CW, xD, yD, zD){
        this.cubes.forEach((cube) => cube.rotate(cP, CW, xD, yD, zD));
        this.x += xD;
        this.y+= yD;
        this.z += zD;
    }

    exclusiveRotate(cP, CW, xD, yD, zD, p){
        this.cubes.forEach((cube, index) => {if(p.includes(index)) {cube.rotate(cP, CW, xD, yD, zD)}});
    }

    sortSquares(squares){
        return squares.sort(function(a, b){return a.getAverageX() - b.getAverageX()})
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