
let ans = [];

const width = document.getElementById('three_canvas').clientWidth;
const height = document.getElementById('three_canvas').clientHeight;

let scene = new THREE.Scene();
// let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
let camera =  new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('three_canvas')});
renderer.setSize( width, height);




let left = new Hand(scene, "left");
let right = new Hand(scene, "right");

camera.up = 1;

let animate = function () {
    requestAnimationFrame( animate );
    ans = getRes();

    left.update(ans);
    right.update(ans);

    renderer.render(scene, camera);
};

animate();