class Bullet {
    constructor(cube) {
        this.cube = cube;
        this.ppos = cube.position;
        this.pos = cube.postion;

        this.speed = [0 ,0 ,0];
    }

    update(bone) {
        this.ppos = this.pos;
        this.pos = bone.center();

        for (let i = 0; i < 3; i++) {
            this.speed[i] = this.pos[i] - this.ppos[i];
        }

        this.cube.position.set(this.pos[0], this.pos[1], this.pos[2]);
    }

    draw() {
        this.cube.rotation.x += .1;
    }
}

export {
    Bullet
}