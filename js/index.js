let ans = [];
let bullets = [];
let canvases = [];

const width = document.getElementById('three_canvas').clientWidth;
const height = document.getElementById('three_canvas').clientHeight;

let scene = new THREE.Scene();
// let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
let camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('three_canvas')});
renderer.setSize(width, height);

// let left = new FunctionHand(scene, "left");
let right = new ShootHand(scene, "right");
canvases.push(new Canvas(0, scene, 600, 400, 0, 0, -600));

camera.up = 1;
camera.position.z = 0;

let x = 100, y = 10;

let heartShape = new THREE.Shape();

// heartShape.moveTo(x + 0, y + 0);
// heartShape.lineTo(x + 10, y + 0);
// heartShape.lineTo(x + 10, y + 10);
// heartShape.lineTo(x + 0, y + 10);
//
//
// let geometry = new THREE.ShapeBufferGeometry( heartShape );
// let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// let mesh = new THREE.Mesh( geometry, material ) ;
// scene.add( mesh );


let animate = function () {
    requestAnimationFrame(animate);
    ans = getRes();
    right.update(ans, bullets);

    // bullets.forEach((bullet) => {
    //     bullet.update();
    // });
    for(let i = 0; i < bullets.length; i++){
        bullets[i].update();
        if(bullets[i].isDead){
            bullets.splice(i,1);
            // i--;
        }
    }

    canvases.forEach((canvas) => {
        canvas.updateRotation();
        canvas.updateImprints(bullets);
        // canvas.updateRotation();
    });


    renderer.render(scene, camera);
};

animate();