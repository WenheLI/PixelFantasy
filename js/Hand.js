class Hand {
    constructor(cubes, type) {
        this.cubes = cubes;
        this.type = type;
    }

    update(res) {
        let hasHand = false;
        res.forEach((hand) => {
            if (hand.type === this.type) {
                hasHand = true;
                let index = 0;
                hand.fingers.forEach((finger) => {
                    let bones = finger.bones;
                    bones.forEach((bone) => {
                        this.cubes[index].position.set(bone.center()[0], bone.center()[1] - 200,  bone.center()[2] - 400);
                        index++;
                    })
                })
            }
        });
        if (!hasHand) {
            this.cubes.forEach((cube) => {
                cube.position.set(0, 0, 0);
            })
        }

    }

    draw() {
        this.cubes.forEach((cube) => {
            cube.rotation.x += 0.1;
            cube.rotation.y += 0.1;
        });
    }
}

export {Hand}


