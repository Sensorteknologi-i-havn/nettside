import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js';
import {RoomEnvironment} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/environments/RoomEnvironment.js';


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


// Canvas
const canvas = document.querySelector('bg');

// Mimics human eyeball.
// @param: FOV, Aspect Ratio, 2 x View Frustrum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 ); 


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true
});

//Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

// Scence == container
const scene = new THREE.Scene();
const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

// 3D model loader
const loader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/js/libs/draco/gltf/');
loader.setDRACOLoader(dracoLoader);

var mesh;
// load model
loader.load('/models/mclaren.glb', function (gltf) {
  
  //mesh = gltf.scene.children[1];
  //scene.add(mesh);

  const model = gltf.scene;
  model.position.set( 3, -2, 25 );
  model.rotation.set(0, -1, 0);
  model.scale.set( 1, 1, 1 );
  scene.add( model );

  animate();

}, function ( xhr ) {

  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

}, undefined, function (e) {
  console.error(e);
});

// Resize
window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

renderer.setClearAlpha(0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

// Full screen canvas
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
camera.position.setZ(30)

// Objects
const towerGeometry1 = new THREE.BoxGeometry(0.3, 0.5, 0.2)
const towerGeometry2 = new THREE.BoxGeometry(0.3, 0.55, 0.2)
const towerGeometry3 = new THREE.BoxGeometry(0.3, 0.35, 0.2)
const towerGeometry4 = new THREE.BoxGeometry(0.3, 0.28, 0.2)

// Material, wrapping paper for object
const towerMaterial1 = new THREE.MeshStandardMaterial({color: 0x064E40})
const towerMaterial2 = new THREE.MeshStandardMaterial({color: 0x1F5F5B})
const towerMaterial3 = new THREE.MeshStandardMaterial({color: 0x0e8c80})
const towerMaterial4 = new THREE.MeshStandardMaterial({color: 0x48BF91})

// Mesh
const tower1 = new THREE.Mesh(towerGeometry1, towerMaterial1)
const tower2 = new THREE.Mesh(towerGeometry2, towerMaterial2)
const tower3 = new THREE.Mesh(towerGeometry3, towerMaterial3)
const tower4 = new THREE.Mesh(towerGeometry4, towerMaterial4)

const staticT1 = new THREE.Mesh(towerGeometry1, towerMaterial1)
const staticT2 = new THREE.Mesh(towerGeometry2, towerMaterial2)
const staticT3 = new THREE.Mesh(towerGeometry3, towerMaterial3)
const staticT4 = new THREE.Mesh(towerGeometry4, towerMaterial4)

// model 1
tower1.position.set(-0.15, 0.025, 0)
tower2.position.set(0.15, 0.05, 0)
tower3.position.set(-0.15, -0.05, 0.2)
tower4.position.set(0.15, -0.085, 0.2)

// model 2
staticT1.position.set(-0.15, 0.025, 0)
staticT2.position.set(0.15, 0.05, 0)
staticT3.position.set(-0.15, -0.05, 0.2)
staticT4.position.set(0.15, -0.085, 0.2)


// Groups & model positioning
var sculpt = new THREE.Group();
var staticSculpt = new THREE.Group();

sculpt.add(tower1, tower2, tower3, tower4);
staticSculpt.add(staticT1, staticT2, staticT3, staticT4)
scene.add(sculpt, staticSculpt);

sculpt.position.set(1.75, -3.2, 28)
sculpt.rotation.set(0, -1, 0)

staticSculpt.rotation.y = -1
staticSculpt.position.set(1.75, -5.65, 28)

const objectsDistance = 4
sculpt.position.y += -objectsDistance * 0
staticSculpt.position.y += -objectsDistance * 0

// Light
//const ambiLight = new THREE.AmbientLight(0xffffff)
//ambiLight.position.set(5, 5, 5)
//scene.add(ambiLight)

/**
 * Scroll
 */
 let scrollY = window.scrollY

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

staticSculpt.addEventListener('click', () => {
  alert('yo')
})

window.addEventListener('resize', () => {
  //Update Sizes:
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()

  //Update renderer:
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()

function animate() {
  
  const elapsedTime = clock.getElapsedTime();

  requestAnimationFrame( animate );
  
  camera.position.y = -scrollY * 2.5 / sizes.height;
  sculpt.rotation.y += 0.005;

  controls.update();
  
  //controls.update()
  renderer.render(scene, camera);
}

animate()