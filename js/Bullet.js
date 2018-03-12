class Bullet {
    constructor(cube_) {
        this.isDead = false;

        this.cube = cube_;

        this.size = this.cube.size;

        this.color = this.cube.color;
        this.scene = this.cube.scene;



        this.pos = this.cube.pos.clone();
        this.vel = this.cube.vel.clone();

        this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );
        this.material = new THREE.MeshBasicMaterial( { color: this.color } );

        this.obj = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.obj);

    }

    update() {
        this.pos.add(this.vel.normalize().multiplyScalar(3.5));


        this.obj.position.set(this.pos.x, this.pos.y, this.pos.z);

        this.obj.rotation.x += .1;
        this.obj.rotation.y += .1;

        if (this.pos.z < -800 && !this.isDead) {
            this.cube.isFly = false;
            this.isDead = true;
        }
    }
}