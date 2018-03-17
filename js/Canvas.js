class Canvas {
    constructor(index, scene_, sizeX, sizeY, posX, posY, posZ) {

        this.scene = scene_;

        this.pos = new THREE.Vector3(posX, posY, posZ);
        this.size = new THREE.Vector2(sizeX, sizeY);



        //canvas surface
        this.planeGeometry = new THREE.PlaneBufferGeometry(sizeX, sizeY);
        this.planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
        this.surfaceObj = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.surfaceObj.position.set(this.pos.x, this.pos.y, this.pos.z);

        //canvas frame
        this.edgesGeometry = new THREE.EdgesGeometry(this.planeGeometry);
        this.edgeMaterial = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 10});
        this.frameObj = new THREE.LineSegments(this.edgesGeometry, this.edgeMaterial);
        this.frameObj.position.set(this.pos.x, this.pos.y, this.pos.z);

        this.scene.add(this.frameObj);
        this.scene.add(this.surfaceObj);


        //following attributes for calculations

        // this.unitVectorX = new THREE.Vector3(1, 0, 0);
        // this.unitVectorY = new THREE.Vector3(0, 1, 0);
        this.unitVectorZ = new THREE.Vector3(0, 0, 1);
        this.plane = new THREE.Plane(this.unitVectorZ, this.pos.length());
        let rotationX = this.surfaceObj.rotation.x;
        let rotationY = this.surfaceObj.rotation.y;
        let rotationZ = this.surfaceObj.rotation.z;
        this.euler = new THREE.Euler(rotationX, rotationY, rotationZ, "XYZ");
        this.reverseEuler = new THREE.Euler(-rotationX, -rotationY, -rotationZ, "XYZ");

        // let geometry = new THREE.Geometry();
        // geometry.vertices.push(this.pos);
        // geometry.vertices.push(this.pos.clone().add(new THREE.Vector3(10, 10, 10)));
        // this.line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 1000}));
        // this.scene.add(this.line);

        //to store the painted shapes
        this.imprintsFront = [];
        this.imprintsBack = [];
    }

    updateRotation() {
        //
        this.frameObj.rotation.z += 0.01;
        this.surfaceObj.rotation.z += 0.01;
        this.updateEuler();
        this.updateCoordinateVectors();
        this.updatePlane();

    }

    updateImprints(bullets) {
        // console.log(bullets);
        bullets.forEach((bullet) => {
            //only check when this bullet is close enough to improve performance

            if (this.plane.distanceToPoint(bullet.pos) < bullet.size * 1.5) {
            //     console.log('checking');
                let collidingPoints = this.checkCollision(bullet);
                if (collidingPoints.length > 0) {
                    // console.log(collidingPoints);
                    collidingPoints = this.transformToCanvasCoordinate(collidingPoints);
                    collidingPoints = this.sortWithJarvisMarch(collidingPoints);
                    this.addImprints(collidingPoints, bullet.color);
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
                let crossThreshold = 0.1;
                if (Math.abs(pointToCenter.dot(this.unitVectorZ)) < crossThreshold) {
                    collidingPoints.push(pointToCenter);
                    console.log("hit");

                }
            })
        });

        return collidingPoints;
    }

    transformToCanvasCoordinate(inputs) {

        let outputs = [];
        inputs.forEach((point) => {
            point.applyEuler(this.reverseEuler);

            //relocate points that are outside of the canvas onto the canvas
            if (point.x > this.size.x / 2)
                point.x = this.size.x / 2;
            else if (point.x < -this.size.x / 2)
                point.x = -this.size.x / 2;

            if (point.y > this.size.y / 2)
                point.y = this.size.y / 2;
            else if (point.y < -this.size.y / 2)
                point.y = -this.size.y / 2;

            outputs.push(new THREE.Vector2(point.x, point.y));
        });
        return outputs;
    }

    sortWithJarvisMarch(inputs) {
        // console.log(inputs);
        let jm = new JarvisMarch(inputs);
        // console.log(jm.jarvisMarch());
        return jm.jarvisMarch();
    }

    addImprints(collidingPoints, color) {
        // console.log(collidingPoints);
        let imprintShape = new THREE.Shape();
        let currentPoint = collidingPoints[0];
        imprintShape.moveTo(currentPoint.x, currentPoint.y);
        for (let i = 1; i < collidingPoints.length; i++) {
            imprintShape.lineTo(collidingPoints[i].x, collidingPoints[i].y);
        }

        let imprintGeometry = new THREE.ShapeBufferGeometry(imprintShape);
        let imprintMaterial = new THREE.MeshBasicMaterial({color: color});
        let imprintMeshFront = new THREE.Mesh(imprintGeometry, imprintMaterial);
        let imprintMeshBack = new THREE.Mesh(imprintGeometry, imprintMaterial);

        this.scene.add(imprintMeshFront);
        this.scene.add(imprintMeshBack);

        imprintMeshFront.position.x = this.pos.x;
        imprintMeshFront.position.y = this.pos.y;
        imprintMeshFront.position.z = this.pos.z + 1;

        imprintMeshBack.position.x = this.pos.x;
        imprintMeshBack.position.y = this.pos.y;
        imprintMeshBack.position.z = this.pos.z - 1;

        this.imprintsFront.push(imprintMeshFront);
        this.imprintsBack.push(imprintMeshBack);

    }

    translateImprints() {
        this.imprintsFront.forEach((imprint) => {
            imprint.rotation.x = this.frameObj.rotation.x;
            imprint.rotation.y = this.frameObj.rotation.y;
            imprint.rotation.z = this.frameObj.rotation.z;
        });
        this.imprintsBack.forEach((imprint) => {
            imprint.rotation.x = this.frameObj.rotation.x;
            imprint.rotation.y = this.frameObj.rotation.y;
            imprint.rotation.z = this.frameObj.rotation.z;
        });
    }

    updateCoordinateVectors() {
        // this.unitVectorX = new THREE.Vector3(1, 0, 0).applyEuler(this.euler);
        // this.unitVectorY = new THREE.Vector3(0, 1, 0).applyEuler(this.euler);
        this.unitVectorZ = new THREE.Vector3(0, 0, 1).applyEuler(this.euler);

    }

    updatePlane() {
        this.plane.set(this.unitVectorZ, -this.pos.dot(this.unitVectorZ));
    }

    updateEuler() {
        let rotationX = this.surfaceObj.rotation.x;
        let rotationY = this.surfaceObj.rotation.y;
        let rotationZ = this.surfaceObj.rotation.z;
        this.plane = new THREE.Plane(this.unitVectorZ, this.pos.length());
        this.euler = new THREE.Euler(rotationX, rotationY, rotationZ, "XYZ");
        this.reverseEuler = new THREE.Euler(-rotationX, -rotationY, -rotationZ, "XYZ");
    }
}