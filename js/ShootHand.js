class ShootHand {
    constructor(scene_, type_) {
        this.cubes = [];
        this.scene = scene_;
        for (let i = 0; i < 20; i++) {
            this.cubes.push(new Cube(20, '#'+Math.floor(Math.random()*16777215).toString(16), this.scene));
        }

        this.type = type_;
    }

    update(res, bullets) {
        let hasHand = false;
        res.forEach((hand) => {
            if (hand.type === this.type) {
                hasHand = true;
                let index = 0;
                hand.fingers.forEach((finger) => {
                    let bones = finger.bones;
                    bones.forEach((bone) => {
                        this.cubes[index].update(bone);
                        this.cubes[index].checkVel(bullets);
                        index++;
                    })
                })
            }
        });
        if (!hasHand) {
            this.cubes.forEach((cube) => {
                cube.reset();
            })
        }

    }
}


