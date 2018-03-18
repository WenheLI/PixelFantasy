let ans = [];
let bullets = [];
let canvases = [];

const width = document.getElementById('three_canvas').clientWidth;
const height = document.getElementById('three_canvas').clientHeight;

let scene = new THREE.Scene();
// let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
let camera = new THREE.PerspectiveCamera(70, width / height, 1, 2000);
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('three_canvas')});
renderer.setSize(width, height);

// let left = new FunctionHand(scene, "left");
let right = new ShootHand(scene, "left");
let left = new ControlHand(scene, "right");

canvases.push(new Canvas(0, scene, 800, 400, 0, 0, -600, 0xffffff));
// canvases.push(new Canvas(1, scene, 800, 400, 0, 0, -600, 0x222222));

camera.up = 1;
camera.position.z = 0;

let x = 100, y = 10;


let animate = function () {
    requestAnimationFrame(animate);
    ans = getRes();
    right.update(ans, bullets);
    left.update(ans);

    // bullets.forEach((bullet) => {
    //     bullet.update();
    // });
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
        canvases.forEach((canvas) => {
            bullets[i].checkNearCanvas(canvas);
        });
    }


    canvases.forEach((canvas) => {
        canvas.updateTranslation(left);
        canvas.updateImprints(bullets);
        // canvas.updateRotation();
    });


    renderer.render(scene, camera);

    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].isDead) {
            bullets.splice(i, 1);
            // i--;
        }
    }

};

window.addEventListener('resize', () => {
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;

    renderer.setSize(windowWidth, windowHeight);
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
    // console.log(camera.aspect);
});

animate();