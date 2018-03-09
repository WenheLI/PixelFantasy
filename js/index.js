import { getRes } from "./LeapMotion.js";
import { Hand } from "./Hand.js"
import { Bullet } from "./Bullet.js"

let res = [];

const width = document.getElementById('three_canvas').clientWidth;
const height = document.getElementById('three_canvas').clientHeight;

let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
// let camera =  new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('three_canvas')});
renderer.setSize( width, height);


let geometry = new THREE.BoxGeometry( 10, 10, 10 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

let cube = new Bullet(new THREE.Mesh(geometry, material));

let cuba = new THREE.Mesh(geometry,material);

let cubesLeft = [];
let cubesRight = [];

for (let i  = 0 ; i < 20; i++) {
    cubesLeft.push(new THREE.Mesh(geometry, material));
}

for (let i  = 0 ; i < 20; i++) {
    cubesRight.push(new THREE.Mesh(geometry, material));
}

cubesRight.forEach((cube) => {
    scene.add(cube);
});

cubesLeft.forEach((cube) => {
    scene.add(cube);
});


scene.add(cuba);


let left = new Hand(cubesLeft, "left");
let right = new Hand(cubesRight, "right");

// scene.add(cube.cube);
// camera.position.z = 400;
// camera.position.y = 200;
console.log(cuba.getWorldPosition());
camera.up = 1;

let animate = function () {
    let index = 0;
    requestAnimationFrame( animate );
    res = getRes();
    // if (res.length !== 0) {
    //     console.log(res[0]);
    //     cube.update(res[0].fingers[0].bones[0]);
    // }
    //
    // cube.draw();

    left.update(res);
    right.update(res);

    left.draw();
    right.draw();

    renderer.render(scene, camera);
};

animate();