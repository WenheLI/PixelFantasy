class Bullet {
    constructor(cube_) {
        this.isDead = false;

        this.cloudPoint = [];

        this.cube = cube_;

        this.size = this.cube.size;
        this.color = this.cube.color;
        this.scene = this.cube.scene;

        this.cloudPoint = [];
        this.vertices2D = [];
        this.oriCloudPoint = [];

        this.pos = this.cube.pos.clone();
        this.vel = this.cube.vel.clone();

        this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );
        this.material = new THREE.MeshBasicMaterial( { color: this.color } );

        this.obj = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.obj);

        this.generateCloudPoint(1);

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

    generateCloudPoint(resolution) {

        let vertices = this.geometry.vertices;

        vertices.forEach((vertex) => {
            vertex.add(this.pos);
        });

        if (this.vertices2D.length === 0) {
            this.vertices2D.push([vertices[0], vertices[1], vertices[4], vertices[5]]);
            this.vertices2D.push([vertices[2], vertices[3], vertices[6], vertices[7]]);
        }

        if (this.cloudPoint.length === 0) {
            for (let h = 0; h < 2; h++) {
                for (let i = 0; i < 4; i += 2) {
                    this.cloudPoint.push([this.vertices2D[h][i].clone(), this.vertices2D[h][1].clone()]);
                    this.cloudPoint.push([this.vertices2D[h][i].clone(), this.vertices2D[h][3].clone()]);
                }
            }
            for (let i = 0; i < 4; i += 1) {
                this.cloudPoint.push([this.vertices2D[0][i].clone(), this.vertices2D[1][i].clone()]);
            }
        }
        for (let j = 0; j < this.cloudPoint.length; j++) {
            let x_1 = this.cloudPoint[j][0].x;
            let x_2 = this.cloudPoint[j][1].x;

            let y_1 = this.cloudPoint[j][0].y;
            let y_2 = this.cloudPoint[j][1].y;

            let z_1 = this.cloudPoint[j][0].z;
            let z_2 =  this.cloudPoint[j][1].z;

            for (let i = 1; i < resolution; i++) {

                let factor = i/resolution;
                let rFractor = 1 - factor;

                this.cloudPoint[j].push(new THREE.Vector3(factor*x_1 + rFractor*x_2, factor*y_1 + rFractor*y_2, factor*z_1 + rFractor*z_2))
            }
        }

        for (let i = 0; i < this.cloudPoint.length; i++) {
            let temp = [];
            for (let j = 0; j < this.cloudPoint[i].length; j++) {
                temp.push(this.cloudPoint[i][j].clone())
            }
            this.oriCloudPoint.push(temp);
        }
    }

    updateCloudPoint() {
        for (let i = 0; i < this.cloudPoint.length; i++) {
            for (let j = 0; j < this.cloudPoint[i].length; j++) {
                this.cloudPoint[i][j] = this.oriCloudPoint[i][j].clone();
            }
        }


        this.cloudPoint.forEach((points) => {
            points.forEach((point) => {
                point.applyMatrix4(this.obj.matrix);
                point.x += this.vel.x;
                point.y += this.vel.y;
                point.z += this.vel.z;
            })
        })
    }
}