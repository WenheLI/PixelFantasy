class Cube {

    constructor(size_, color_, scene_) {
        this.size = size_;
        this.color = color_;
        this.scene = scene_;

        this.ppos = new THREE.Vector3( 0, 0, 0 );
        this.pos = new THREE.Vector3(0, 0, 0);
        this.vel = new THREE.Vector3(0, 0, 0);

        this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );
        this.material = new THREE.MeshBasicMaterial( { color: this.color } );

        this.obj = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.obj);

        this.isFly = false;
    }

    update(data) {
        this.ppos = this.pos.clone();
        this.pos.setX(data.center()[0]);
        this.pos.setY(data.center()[1]-200);
        this.pos.setZ(data.center()[2]-400);
        console.log(this.pos);
        this.obj.position.set(this.pos.x, this.pos.y, this.pos.z);

        this.vel.subVectors(this.pos, this.ppos);

        this.obj.rotation.x += .1;
        this.obj.rotation.y += .1;
    }

    reset() {
        this.ppos.set(0, 0, 0);
        this.pos.set(0, 0, 0);
        this.vel.set(0, 0, 0);

        this.obj.position.set(this.pos);
    }

    checkVel() {
        console.log(this.vel);
    }


}
