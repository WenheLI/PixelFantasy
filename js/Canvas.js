class Canvas {
    constructor(index, scene_, sizeX, sizeY, posX, posY, posZ) {

        this.scene = scene_;

        this.pos = new THREE.Vector3(posX, posY, posZ);
        this.size = new THREE.Vector2(sizeX, sizeY);

        this.unitVectorX = new THREE.Vector3(1, 0, 0);
        this.unitVectorY = new THREE.Vector3(0, 1, 0);
        this.unitVectorZ = new THREE.Vector3(0, 0, 1);

        //canvas surface
        this.planeGeometry = new THREE.PlaneBufferGeometry(sizeX, sizeY);
        this.planeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        this.surfaceObj = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.surfaceObj.position.set(this.pos.x, this.pos.y, this.pos.z);

        //canvas frame
        this.edgesGeometry = new THREE.EdgesGeometry(this.planeGeometry);
        this.edgeMaterial = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 10});
        this.frameObj = new THREE.LineSegments(this.edgesGeometry, this.edgeMaterial);
        this.frameObj.position.set(this.pos.x, this.pos.y, this.pos.z);

        this.scene.add(this.frameObj);
        this.scene.add(this.surfaceObj);

        this.imprints = [];//to store the painted shapes
    }

    updateRotation() {

        this.frameObj.rotation.y += 0.1;
        this.surfaceObj.rotation.y += 0.1;
        this.updateCoordinateVectors();
    }

    updateImprints(bullets) {
        // console.log(bullets);
        bullets.forEach((bullet) => {
            this.checkCollision(bullet);
        })
    }

    checkCollision(bullet) {
        // console.log(bullet);
        let pointCloud = bullet.pointCloud;
        let collidingPoints = [];
        pointCloud.forEach((points) => {
            points.forEach((point) => {
                let pointToCenter = new THREE.Vector3(point.x - this.pos.x, point.y - this.pos.y, point.z - this.pos.z);
                // console.log(pointToCenter.dot(this.unitVectorZ));
                if (pointToCenter.dot(this.unitVectorZ) === 0) {
                    collidingPoints.push(point);
                    console.log("hit");
                    // let geo = new THREE.BoxBufferGeometry(10);
                    // let mat = new THREE.MeshBasicMaterial({color: 0xffffff});
                    // let cube = new THREE.Mesh(geo, mat);
                    // this.scene.add(cube);
                    // cube.position.set(point.x, point.y, point.z);
                }
            })
        });

        return collidingPoints;
    }

    transformToCanvasCoordinate(pointArray) {

    }

    drawImprints(collidingPoints) {

        this.imprints.push();
    }

    updateCoordinateVectors() {
        let rotationX = this.surfaceObj.rotation.x;
        let rotationY = this.surfaceObj.rotation.y;
        let rotationZ = this.surfaceObj.rotation.z;
        let x, y, z;
        this.unitVectorX = 0;
        this.unitVectorY = 0;
        x = Math.cos(rotationX) * Math.sin(rotationY) * Math.cos(rotationZ) + Math.sin(rotationX) * Math.sin(rotationZ);
        y = Math.cos(rotationX) * Math.sin(rotationY) * Math.sin(rotationZ) - Math.sin(rotationX) * Math.cos(rotationZ);
        z = Math.cos(rotationX) * Math.cos(rotationY);
        this.unitVectorZ.set(x, y, z);
    }


}