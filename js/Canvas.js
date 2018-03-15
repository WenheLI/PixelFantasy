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

        this.plane = new THREE.Plane(this.unitVectorZ, this.pos.length());

        // let geometry = new THREE.Geometry();
        // geometry.vertices.push(this.pos);
        // geometry.vertices.push(this.pos.clone().add(new THREE.Vector3(10, 10, 10)));
        // this.line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 1000}));
        // this.scene.add(this.line);
        this.imprints = [];//to store the painted shapes
    }

    updateRotation() {
        //
        // this.frameObj.rotation.y += 0.1;
        // this.surfaceObj.rotation.y += 0.1;
        this.updateCoordinateVectors();
    }

    updateImprints(bullets) {
        // console.log(bullets);
        bullets.forEach((bullet) => {
            //only check when this bullet is close enough to improve performance
            if (this.plane.distanceToPoint(bullet.pos) < bullet.size) {
                let collidingPoints = this.checkCollision(bullet);
                if (collidingPoints.length > 0) {
                    console.log(collidingPoints);
                    collidingPoints = this.transformToCanvasCoordinate(collidingPoints);
                    collidingPoints = this.sortWithJarvisMarch(collidingPoints);
                    this.addImprints(collidingPoints);
                }
            }
        });
        this.translateImprints();

    }

    checkCollision(bullet) {
        // console.log(bullet);
        let pointCloud = bullet.pointCloud;
        let collidingPoints = [];
        pointCloud.forEach((points) => {
            points.forEach((point) => {
                let pointToCenter = new THREE.Vector3(point.x - this.pos.x, point.y - this.pos.y, point.z - this.pos.z);
                // console.log(pointToCenter.dot(this.unitVectorZ));
                if (Math.abs(pointToCenter.dot(this.unitVectorZ)) < 0.01) {
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

    transformToCanvasCoordinate(inputs) {

        let outputs = [];
        inputs.forEach((point) => {
            outputs.push(new THREE.Vector2(point.x, point.y));
        });
        return outputs;
    }

    sortWithJarvisMarch(inputs) {
        console.log(inputs);
        let jm = new JarvisMarch(inputs);
        console.log(jm.jarvisMarch());
        return jm.jarvisMarch();
    }

    addImprints(collidingPoints) {
        // console.log(collidingPoints);
        let imprintShape = new THREE.Shape();
        let currentPoint = collidingPoints[0];
        imprintShape.moveTo(currentPoint.x, currentPoint.y);
        for (let i = 1; i < collidingPoints.length; i++) {
            imprintShape.lineTo(collidingPoints[i].x, collidingPoints[i].y);
        }

        let imprintGeometry = new THREE.ShapeBufferGeometry(imprintShape);
        let imprintMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        let imprintMesh = new THREE.Mesh(imprintGeometry, imprintMaterial);

        this.scene.add(imprintMesh);


        imprintMesh.position.x = this.pos.x;
        imprintMesh.position.y = this.pos.y;
        imprintMesh.position.z = this.pos.z + 100;

        this.imprints.push(imprintMesh);

    }

    translateImprints() {
        this.imprints.forEach((imprint) => {
            imprint.rotation.x = this.frameObj.rotation.x;
            imprint.rotation.y = this.frameObj.rotation.y;
            imprint.rotation.z = this.frameObj.rotation.z;
        })
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
        // this.line.geometry.vertices[0] = this.pos.clone();
        // this.line.geometry.vertices[1] = this.pos.clone().add(this.unitVectorZ.multiply(1100));
        // scene.add(this.line);
    }
}