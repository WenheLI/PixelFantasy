let ans = [];
let bullets = [];
let canvases = [];

const width = document.getElementById('three_canvas').clientWidth;
const height = document.getElementById('three_canvas').clientHeight;

let scene = new THREE.Scene();
// let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
let camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('three_canvas')});
renderer.setSize(width, height);

// let left = new FunctionHand(scene, "left");
let right = new ShootHand(scene, "right");
canvases.push(new Canvas(0, scene, 300, 200, 0, 0, -400));

camera.up = 1;
camera.position.z = 100;


let animate = function () {
    requestAnimationFrame(animate);
    ans = getRes();
    right.update(ans, bullets);
    canvases.forEach((canvas) => {
       // canvas.updateRotation();
    });
    bullets.forEach((bullet) => {
        bullet.update();
    });

    renderer.render(scene, camera);
};

animate();