class Point {
    constructor(xC, yC, zC){
        this.x3d = xC;
        this.y3d = yC;
        this.z3d = zC;

        this.x2d;
        this.y2d;

        this.convertPoint()
    }

    rotateX(centrePoints, CW, degrees){
        let distY = this.y3d - centrePoints[1];
		let distZ = this.z3d - centrePoints[2];
		let radius = Math.sqrt(distY*distY+distZ*distZ);
		let theta = Math.atan2(distZ,distY);
		theta += 2*Math.PI/360*degrees*(CW?-1:1);
		this.y3d = radius * Math.cos(theta)+centrePoints[1];
		this.z3d = radius * Math.sin(theta)+centrePoints[2];
    }

    rotateY(centrePoints, CW, degrees){
        let distX = this.x3d - centrePoints[0];
		let distZ = this.z3d - centrePoints[2];
		let radius = Math.sqrt(distX*distX+distZ*distZ);
		let theta = Math.atan2(distX, distZ);
		theta += 2*Math.PI/360*degrees*(CW?-1:1);
		this.x3d = radius * Math.sin(theta) + centrePoints[0];
		this.z3d = radius * Math.cos(theta) + centrePoints[2];
    }
    
    rotateZ(centrePoints, CW, degrees){
        let distX = this.x3d - centrePoints[0];
        let distY = this.y3d - centrePoints[1];
        let radius = Math.sqrt(distX*distX+distY*distY);
        let theta = Math.atan2(distY, distX);
        theta += 2*Math.PI/360*degrees*(CW?-1:1);
        this.y3d = radius * Math.sin(theta) + centrePoints[1];
        this.x3d = radius * Math.cos(theta) + centrePoints[0];
    }

    convertPoint(){
        let x3d = this.y3d * scaleVal;
		let y3d = this.z3d * scaleVal;
		let depth = this.x3d * scaleVal;
		let newVal = this.scalePoint(x3d,y3d,depth);
		this.x2d = (MAX_X/2 + newVal[0]);
		this.y2d = (MAX_Y/2 - newVal[1]);
    }

    scalePoint(x3d, y3d, depth){
        let dist = Math.sqrt(x3d*x3d + y3d*y3d);
		let theta = Math.atan2(y3d, x3d);
		let depth2 = 15 - depth;
		let localScale = Math.abs(1400/(depth2+1400));
		dist *= localScale;
		let newVal = [];
		newVal[0] = dist * Math.cos(theta);
		newVal[1] = dist * Math.sin(theta);
		return newVal;
    }
}