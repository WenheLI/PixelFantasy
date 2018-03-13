class Canvas {
    constructor(index,scene_,sizeX,sizeY,posX,posY,posZ){

        this.scene = scene_;

        this.pos = new THREE.Vector3(posX,posY,posZ);
        this.size = new THREE.Vector2(sizeX,sizeY);

        this.unitVectorX = new THREE.Vector3(1,0,0);
        this.unitVectorY = new THREE.Vector3(0,1,0);
        this.unitVectorZ = new THREE.Vector3(0,0,1);

        //canvas surface
        this.planeGeometry = new THREE.PlaneBufferGeometry(sizeX,sizeY);
        this.planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        this.surfaceObj = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.surfaceObj.position.set(this.pos.x,this.pos.y,this.pos.z);

        //canvas frame
        this.edgesGeometry = new THREE.EdgesGeometry( this.planeGeometry);
        this.edgeMaterial = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 10});
        this.frameObj = new THREE.LineSegments(this.edgesGeometry,this.edgeMaterial);
        this.frameObj.position.set(this.pos.x,this.pos.y,this.pos.z);

        this.scene.add(this.frameObj);
        this.scene.add(this.surfaceObj);

        this.imprints = [];//to store the painted shapes
    }

    updateRotation(functionHand){

        this.frameObj.rotation.y += 0.1;
        this.surfaceObj.rotation.y += 0.1;

    }
    updateImprints(bullets){


    }

    checkCollision(bullet){

    }

    transformToCanvasCoordinate(pointArray){

    }

    drawImprints(){
        this.imprints.push();
    }

    updateCoordinateVectors(){

    }




}