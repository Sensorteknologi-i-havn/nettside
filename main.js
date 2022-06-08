import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js';
import {RoomEnvironment} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/environments/RoomEnvironment.js';
import { TWEEN } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/libs/tween.module.min';
import { CSS2DObject } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js';
import { Int8Attribute } from 'three';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Canvas
const canvas = document.querySelector('#bg');

let scrollY = window.scrollY;
let scrollTop, scrollLeft;
let model;
let modelY;
let earthModel;
let stop = false;
let sprite;
let mesh;
let spriteBehindObject;

const EARTH_RADIUS = 1;
const annotation = document.querySelector(".annotation");

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let loadingManager;
let progressBar;
let progressBarContainer;
let camera;
let prevCam;
let defaultCam;
let renderer;
let scene;
let pmremGenerator;
let loader;
let dracoLoader;

var button = document.getElementById("plusbutton");
var exitButton = document.getElementById("exitbutton");
 
var earthButton = document.getElementById("plusbuttonearth");
var earthExitButton = document.getElementById("exitbuttonearth");
let earthDiv;
let earthLabel;
 
let offsetZ = 2;
let offsetX = 1;
let camX, camY, camZ, prevCamEarth;
let staticY = -10;

init();

function init() {
  // Progress Bar
  loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = function(url, item, total) {
    console.log('Started loading: ${url}');
  }

  progressBar = document.getElementById('progress-bar');

  loadingManager.onProgress = function(url, pageloaded, total) {
    progressBar.value = (pageloaded / total) * 100;
  }

  progressBarContainer = document.querySelector('.progress-bar-container');

  loadingManager.onLoad = function() {
    progressBarContainer.style.display = 'none';
  }

  // Camera
  // Mimics human eyeball.
  // @param: FOV, Aspect Ratio, 2 x View Frustrum
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  defaultCam = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
  //const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 ); 

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
  });



  //Orbit Controls
  //const controls = new OrbitControls( camera, renderer.domElement );


  // Scence == container
  scene = new THREE.Scene();
  pmremGenerator = new THREE.PMREMGenerator( renderer );
  scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

  //loadingManager.onError = function() {
  //  console.error('Loading error: ${url}');
  //}


  // 3D model loader
  loader = new GLTFLoader(loadingManager);

  dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/js/libs/draco/gltf/');
  loader.setDRACOLoader(dracoLoader);

// load model
  // loader.load('/models/port/port.glb', function (gltf) {
    
    //   //mesh = gltf.scene.children[1];
  //   //scene.add(mesh);
    
  //   model = gltf.scene;

  //   model.position.set( 2, -2, 26 );
  //   model.rotation.set(0, 0, 0);
  //   model.scale.set( 0.02, 0.02, 0.02 );
  //   modelY = model.position.y
  //   scene.add( model );
  //   animate();

  // }, function ( xhr ) {

  //   console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  // }, undefined, function (e) {
  //   console.error(e);
  // });


    
  loader.load('/models/earth/scene.gltf', function (gltf) {
    
    earthModel = gltf.scene;
    earthModel.position.set( 1.5, -11.5, 28 );
    earthModel.rotation.set(0, 0, 0);
    earthModel.scale.set( 1, 1, 1 );
    scene.add( earthModel);
    //earthModel.scene.name = "earthModel";

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

  /////////////LABEL///////////

  // const earth = scene.getObjectByName("earthModel");
  // const earthMesh = new THREE.Mesh(earth.geometry, new THREE.MeshStandardMaterial());
  // earthDiv = document.createElement( 'div' );
  // earthDiv.className = 'label';
  // earthDiv.textContent = 'Earth';
  // earthDiv.style.marginTop = '-1em';

  // earthLabel = new CSS2DObject( earthDiv );
  // earthLabel.position.set( 0, 0, 0 );
  // earthMesh.add( earthLabel );


  events();
}

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

  //////////////////////////////
  ///////////////////////////////
  // Groups & model positioning
  var sculpt = new THREE.Group();
  var staticSculpt = new THREE.Group();

  sculpt.add(tower1, tower2, tower3, tower4);
  staticSculpt.add(staticT1, staticT2, staticT3, staticT4);
  scene.add(sculpt, staticSculpt);

  sculpt.position.set(1.75, -3.2, 28)
  sculpt.rotation.set(0, -1, 0)

  staticSculpt.rotation.y = -1
  staticSculpt.position.set(1.75, -5.65, 28)



// Textures
//scene.add(earth)

// Positioning
const objectsDistance = 4
sculpt.position.y += -objectsDistance * 0
staticSculpt.position.y += -objectsDistance * 0


// Light
// const ambiLight = new THREE.AmbientLight()
// ambiLight.position.set(5, 5, 5)
// scene.add(ambiLight)

/**
 * Scroll
 */

// Events
function events() {
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    //model.position.y = (scrollY/300);
    //model.rotation.y = 4 + (scrollY/500)
  })

  function disableScroll() {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,

        // if any scroll is attempted, set this to the previous value
        window.onscroll = function() {
            window.scrollTo(scrollLeft, scrollTop);
        };
  }

  function enableScroll() {
    window.onscroll = function() {};
  }

  button.addEventListener("click", (event) => {
    const target = model;
    const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    button.style.display = 'none';
    exitButton.style.display = 'block';
    disableScroll();
    new TWEEN.Tween(coords)
    .to({ x: (target.position.x-offsetX), y: camera.position.y, z: (target.position.z + offsetZ) })
      .onUpdate(() => 
        camera.position.set(coords.x, coords.y, coords.z)
      )
      .start();
  });

  exitButton.addEventListener("click", (event) => {
    camX = camera.position.x;
    camY = camera.position.y;
    camZ = camera.position.z;
    const target = prevCam;
    const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    button.style.display = 'block';
    exitButton.style.display = 'none';
    enableScroll();
    new TWEEN.Tween(coords)
      .to({ x: camX, y: camY, z: camZ })
      .onUpdate(() => 
        camera.position.set(coords.x, coords.y, coords.z)
      )
      .start();
  });

  earthButton.addEventListener("click", (event) => {
    const target = earthModel;
    const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const earthCoords = { x: earthModel.position.x, y: earthModel.position.y, z: earthModel.position.z }
    const earthRotCoords = { x: earthModel.rotation.x, y: earthModel.rotation.y, z: earthModel.rotation.z }
    prevCamEarth = coords;
    earthButton.style.display = 'none';
    earthExitButton.style.display = 'block';
    stop = true;
    disableScroll();
    new TWEEN.Tween(coords)
      .to({ x: target.position.x-0.5, y: target.position.y, z: (target.position.z +1.5) })
      .onUpdate(() => 
        camera.position.set(coords.x, coords.y, coords.z),

      )
      .start();

      new TWEEN.Tween(earthRotCoords)
      .to({ x: earthModel.rotation.x, y: earthModel.rotation.y, z: (earthModel.rotation.z) })
      .onUpdate(() => 
        earthModel.rotation.set(0, -0.9, 0)
      )
      .start();
  });

  earthExitButton.addEventListener("click", (event) => {
    const target = prevCamEarth;
    const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const earthCoords = { x: earthModel.position.x, y: earthModel.position.y, z: earthModel.position.z }
    earthButton.style.display = 'block';
    earthExitButton.style.display = 'none';
    stop = false;
    enableScroll();

    new TWEEN.Tween(coords)
      .to({x: camX, y: camY, z: camZ })
      .onUpdate(() => 
        camera.position.set(coords.x, coords.y, coords.z),
        earthModel.position.set( 1.5, -11.5, 28 )
      )
      .start();

      new TWEEN.Tween(earthCoords)
      .to({ x: earthModel.rotation.x, y: earthModel.rotation.y, z: (earthModel.rotation.z) })
      .onUpdate(() => 
        earthModel.rotation.set(0, 5,0)
      )
      .start();
  });
}


//Ray caster
document.addEventListener( "mousemove", (event) => {

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );

});

function mouseRotate() {

  if (stop) {
    targetX = 0;
    targetY = 0;
  } else {

    targetX = mouseX * .005;
    targetY = mouseY * .001;

    if ( earthModel ) {

      earthModel.rotation.y += 0.05 * ( targetX - earthModel.rotation.y );
      //earthModel.rotation.z += 0.05 * ( targetx - earthModel.rotation.x );

    }

    if (model) {
      
      model.rotation.y += 0.5 * ( targetX - model.rotation.y );
    }
  }


  renderer.render( scene, camera );

}



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


function animate() {
  let clock = new THREE.Clock();

  requestAnimationFrame( animate );
  TWEEN.update();
  camera.position.y = -scrollY * 2.5 / sizes.height;
  //earthModel.rotation.y += 0.0005;
  //controls.update();
  //camera.position.z = defaultCamZ;
  mouseRotate();
  //controls.update();
  renderer.render(scene, camera);
}

animate();
