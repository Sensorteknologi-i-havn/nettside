import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js';
import {DRACOLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js';
import {RoomEnvironment} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/environments/RoomEnvironment.js';
import { TWEEN } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/libs/tween.module.min';
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js';
import { CSS3DRenderer, CSS3DObject } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS3DRenderer.js';

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

let earthDiv;
let earthLabel;
let labelRenderer;
let earthMassDiv;
let earthMassLabel;
let moon;
let earthGeo;
let earthMaterial;
let earthGeometry;
let earthMesh;
let earthButtonDiv;
let earthButtonLabel;
let palmasButtonDiv;
let palmasButtonLabel;
let palmasInfoDiv;
let palmasLabel;

let kafkaButtonDiv;
let kafkaButtonLabel;
let kafkaDiv;
let kafkaLabel;

let techButtonDiv;
let techButtonLabel;
let techDiv;
let techLabel;

let stromButtonDiv;
let stromButtonLabel;
let StromInfoDiv;
let stromInfoLabel;

let sjoButtonDiv;
let sjoButtonLabel;
let sjoInfoDiv;
let sjoInfoLabel;

let sensorButtonDiv;
let sensorButtonLabel;
let sensorInfoDiv;
let sensorInfoLabel;

let wifiModel;
let tech;

let neuronModel;
let boatModel;
let portModel;
let satearthModel;
let satelitteModel;
let norgeModel;
let pointModel;
let userModel;
 
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
  camera.position.setZ(2)
  //const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 ); 

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
  });
  //renderer.gammaOutput = true,


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


  const EARTH_RADIUS = 1;

  const earthGeometry = new THREE.SphereGeometry( EARTH_RADIUS, 16, 16 );
  const earthMaterial = new THREE.MeshPhongMaterial( {
    specular: 0x333333,
    shininess: 5,
    opacity: 0
  } );
  earthMaterial.transparency = true;
  const earth = new THREE.Mesh( earthGeometry, earthMaterial );
  tech = new THREE.Mesh( earthGeometry, earthMaterial );
  const strom = new THREE.Mesh( earthGeometry, earthMaterial );
  scene.add( earth, tech, strom );


//////////////////STRØMANLEGG BUTTON////////////////
stromButtonDiv = document.createElement( 'span' );
let stromButtonStyle = stromButtonDiv.style;
stromButtonDiv.className = "strom-knapp";
stromButtonStyle.background =  '#285376'; // rgb(24, 24, 24)
stromButtonStyle.color = 'white';
stromButtonStyle.fontSize = '18px';
stromButtonStyle.borderRadius = '15px';
stromButtonStyle.margin = "20px";
stromButtonStyle.padding = "15px";
stromButtonStyle.zIndex = "999";
stromButtonDiv.innerHTML = "Europas største <i class='fa fa-bolt'></i>";
stromButtonDiv.style.zIndex = '99';

stromButtonLabel = new CSS2DObject( stromButtonDiv );
stromButtonLabel.position.set(1, -1.5, 0);
stromButtonDiv.addEventListener('mouseover', nasjonalScaleUp, false);
stromButtonDiv.addEventListener('mouseout', nasjonalScaleDown);

strom.add(stromButtonLabel);
strom.position.set(0, 0, 0)
strom.scale.set(0.5,0.5,0.5)



/////////////////STROM INFO////////////////////
StromInfoDiv = document.createElement( 'span' );
let stromInfoStyle = StromInfoDiv.style;
StromInfoDiv.setAttribute('style', 'white-space: pre;');
StromInfoDiv.className = 'stromText';
StromInfoDiv.innerHTML = '<b>Prosjektet "Europas største landstrømsanlegg"</b><br><br>';
//earthDiv.style.fontWeight = 'bold';
StromInfoDiv.innerHTML += 'er et av mange steg for elektrifiseringen av Kristiansand-regionen \r\nog resten av Agder. I Norge er vi forpliktet gjennom EUs \r\nklimarammeverk til å redusere utslipp med 40% innen 2030. \r\nElektrifiseringen av Kristiansand havn er en milepæl i \r\nhavnens, byens og regionens lange historie og kan ha \r\nimplikasjoner for hele den maritime industrien i Norge. \r\nEU har som mål å oppnå landstrømanlegg ved sine største havner \r\ninnen 2025. Anlegget ble installert i kristiansand havn høsten 2018. \r\nI tråd med denne ambisjonen har Kristiansand havn mottatt \r\nfinansiering for store deler av investeringen for å \r\noppnå ren og bærekraftig drift. ';
stromInfoStyle.background = 'rgb(24, 24, 24)'
stromInfoStyle.borderRadius = '5%';
stromInfoStyle.padding = '15px';
stromInfoStyle.fontSize = '18px';
stromInfoStyle.margin = "10px";
stromInfoStyle.opacity = '0';
StromInfoDiv.style.zIndex = '0';
//earthDiv.style.marginTop = '-1em';
stromInfoLabel = new CSS2DObject( StromInfoDiv );
stromInfoLabel.position.set(2.4, 0.1, 0)

strom.add( stromInfoLabel );

//////////////////DATASJØ BUTTON////////////////
sjoButtonDiv = document.createElement( 'span' );
let sjoButtonStyle = sjoButtonDiv.style;
sjoButtonDiv.className = "sjo-knapp";
sjoButtonStyle.background =  '#285376'; // rgb(24, 24, 24)
sjoButtonStyle.color = 'white';
sjoButtonStyle.fontSize = '18px';
sjoButtonStyle.borderRadius = '15px';
sjoButtonStyle.margin = "20px";
sjoButtonStyle.padding = "15px";
sjoButtonStyle.zIndex = "999";
sjoButtonDiv.innerHTML = "Datasjø <i class='fa fa-tint'></i>";
sjoButtonDiv.style.zIndex = '99';

sjoButtonLabel = new CSS2DObject( sjoButtonDiv );
sjoButtonLabel.position.set(2.2, -1.5, 0)
sjoButtonDiv.addEventListener('mouseover', sjoScaleUp, false);
sjoButtonDiv.addEventListener('mouseout', sjoScaleDown);

strom.add(sjoButtonLabel);
strom.position.set(0, -12.5, 0)


///////////////DATASJØ INFO/////////////////////
sjoInfoDiv = document.createElement( 'span' );
let sjoInfoStyle = sjoInfoDiv.style;
sjoInfoDiv.setAttribute('style', 'white-space: pre;');
sjoInfoDiv.className = 'sjoText';
sjoInfoDiv.innerHTML = '<b>Prosjektet “Datasjøen”<b><br><br>';
//earthDiv.style.fontWeight = 'bold';
sjoInfoDiv.innerHTML += 'Stavanger kommune beskriver “Datasjøen” som et system med mulighet \r\nfor å  lagre og dele data. I følge Kommunal- og \r\nmoderniseringsdepartementets digitaliseringsstrategi, en digital offentlig \r\nsektor legges det frem med; en metode for lagring av alle former for \r\ndata og kan sammenliknes med et sentralt datalager for alle typer \r\ndata: strukturerte og ustrukturerte, både dokumenter og logger, \r\nbilder, lyd og video. Hensikten med datasjøen vil hovedsakelig legge \r\ntil rette for effektiv og standardisert datadeling på en sikker måte. \r\nDet innebærer at hver enkelt kommune eier sine data, og styrer hvem \r\nsom skal ha tilgang til disse. Med dette blir de enkelte kommunenes \r\nbehov for å kontrollere tilgang og eierskap til data ivaretatt, \r\nsamtidig som kommunene kan utnytte fordelene med å samkjøre \r\ndrift og forvaltning av “datasjøen” til en lavere kostnad.';
sjoInfoStyle.background = 'rgb(24, 24, 24)'
sjoInfoStyle.borderRadius = '5%';
sjoInfoStyle.padding = '15px';
sjoInfoStyle.fontSize = '18px';
sjoInfoStyle.margin = "10px";
sjoInfoStyle.opacity = '0';
sjoInfoDiv.style.zIndex = '0';
//earthDiv.style.marginTop = '-1em';
sjoInfoLabel = new CSS2DObject( sjoInfoDiv );
sjoInfoLabel.position.set(2.4, 0.3, 0)

strom.add( sjoInfoLabel );


/////////////////SENSOR BUTTON////////////////
sensorButtonDiv = document.createElement( 'span' );
let sensorButtonStyle = sensorButtonDiv.style;
sensorButtonDiv.className = "sensor-knapp";
sensorButtonStyle.background =  '#285376'; // rgb(24, 24, 24)
sensorButtonStyle.color = 'white';
sensorButtonStyle.fontSize = '18px';
sensorButtonStyle.borderRadius = '15px';
sensorButtonStyle.margin = "20px";
sensorButtonStyle.padding = "15px";
sensorButtonStyle.zIndex = "999";
sensorButtonDiv.innerHTML = "Sensornettverk <i class='fa fa-rss'></i>";
sensorButtonDiv.style.zIndex = '99';

sensorButtonLabel = new CSS2DObject( sensorButtonDiv );
sensorButtonLabel.position.set(3.4, -1.5, 0);
sensorButtonDiv.addEventListener('mouseover', sensorScaleUp, false);
sensorButtonDiv.addEventListener('mouseout', sensorScaleDown);

strom.add(sensorButtonLabel);

///////////////SENSOR INFO/////////////////////
sensorInfoDiv = document.createElement( 'span' );
let sensorInfoStyle = sensorInfoDiv.style;
sensorInfoDiv.setAttribute('style', 'white-space: pre;');
sensorInfoDiv.className = 'sjoText';
sensorInfoDiv.innerHTML = '<b>Prosjektet “LoRaWAN Sensornettverk”<b><br><br>';
//earthDiv.style.fontWeight = 'bold';
sensorInfoDiv.innerHTML += 'En viktig byggestein ved utviklingen av smartby og havn ved Stavanger, \r\ner sensorer som måler og teller. Hensikten med dette er for \r\nå; måle temperatur, støynivå, forbipasseringer i handlegaten, vannstand, \r\nCO2 i kontorer og klasserom, ledige parkeringsplasser og mer. Av disse \r\nsensorene kan en koble sammen sensordata og åpne data for å lage \r\nnye og nyttige tjenester til innbyggerne, som “kan hjelpe dem \r\nå ta smartere valg i hverdagen”.';
sensorInfoStyle.background = 'rgb(24, 24, 24)'
sensorInfoStyle.borderRadius = '5%';
sensorInfoStyle.padding = '15px';
sensorInfoStyle.fontSize = '18px';
sensorInfoStyle.margin = "10px";
sensorInfoStyle.opacity = '0';

//earthDiv.style.marginTop = '-1em';
sensorInfoLabel = new CSS2DObject( sensorInfoDiv );
sensorInfoLabel.position.set(2.4, 0.05, 0)

strom.add( sensorInfoLabel );



function nasjonalScaleUp() {
  if (stromButtonLabel) {
    stromButtonStyle.background = 'rgb(24, 24, 24)';
    stromButtonStyle.color = 'white';
    stromButtonStyle.content = 'none';
    stromInfoStyle.opacity = '1';
    stromInfoStyle.content = 'normal';
  }
}

function nasjonalScaleDown() {
  stromButtonStyle.background = '#285376';
  stromButtonStyle.color = 'white';
  stromInfoStyle.opacity = '0';
  stromInfoStyle.content = 'none';
}

function sjoScaleUp() {
    sjoButtonStyle.background = 'rgb(24, 24, 24)';
    sjoButtonStyle.color = 'white';
    sjoButtonStyle.content = 'none';
    sjoInfoStyle.opacity = '1';
    sjoInfoStyle.content = 'normal';
}

function sjoScaleDown() {
  sjoButtonStyle.background = '#285376';
  sjoButtonStyle.color = 'white';
  sjoInfoStyle.opacity = '0';
  sjoInfoStyle.content = 'none';
}

function sensorScaleUp() {
    sensorButtonStyle.background = 'rgb(24, 24, 24)';
    sensorButtonStyle.color = 'white';
    sensorButtonStyle.content = 'none';
    sensorInfoStyle.opacity = '1';
    sensorInfoStyle.content = 'normal';
}

function sensorScaleDown() {
  sensorButtonStyle.background = '#285376';
  sensorButtonStyle.color = 'white';
  sensorInfoStyle.opacity = '0';
  sensorInfoStyle.content = 'none';
}


/////////////////TEKNOLOGIES////////////////////////
//////////////////KAFKA BUTTON/////////////////////
  kafkaButtonDiv = document.createElement( 'span' );
  let pkafkaStyle = kafkaButtonDiv.style;
  kafkaButtonDiv.className = "kafka-knapp";
  pkafkaStyle.background =  '#285376';
  pkafkaStyle.fontSize = '18px';
  pkafkaStyle.color = 'white';
  pkafkaStyle.borderRadius = '15px';
  pkafkaStyle.margin = "20px";
  pkafkaStyle.padding = "15px";
  pkafkaStyle.zIndex = "999";
  kafkaButtonDiv.innerHTML = "Kafka";
  kafkaButtonDiv.style.zIndex = '99';

  kafkaButtonLabel = new CSS2DObject( kafkaButtonDiv );
  kafkaButtonLabel.position.set(-4.5, -2.5, 0);
  kafkaButtonDiv.addEventListener('mouseover', kafkaScaleUp, false);
  kafkaButtonDiv.addEventListener('mouseout', kafkaScaleDown);
  tech.add(kafkaButtonLabel);
  

  /////////////////KAFKA INFO////////////////////
  kafkaDiv = document.createElement( 'span' );
  let kafkaStyle = kafkaDiv.style;
  kafkaDiv.setAttribute('style', 'white-space: pre;');
  kafkaDiv.className = 'kafkaText';
  kafkaDiv.innerHTML = '<b>Apache Kafka</b><br><br>';
  //earthDiv.style.fontWeight = 'bold';
  kafkaDiv.innerHTML += 'er et åpent kildekode-programvare som er designet for å \r\nhåndtere store mengder data. Kafka har som mål \r\nå tilby en enhetlig plattform med høy gjennomstrømning \r\nog lav latens for håndtering av sanntidsdatastrømmer. \r\nKafka kan håndtere «high-velocity» data på en ny \r\nmåte som ikke er tilgjengelig hos andrel. Apache \r\nkafka blir brukt for innhenting/absorbering av sensordata. \r\nKlienten kan koble seg til en av instansene for å \r\nhente inn data og informasjon. Denne arkitekturen \r\nsammen med TCP-sockets tilbyr maksimal gjennomstrømming \r\nog skalerbarhet. '
  kafkaStyle.background = 'rgb(24, 24, 24)'
  kafkaStyle.borderRadius = '5%';
  kafkaStyle.padding = '15px';
  kafkaStyle.fontSize = '18px';
  kafkaStyle.margin = "10px";
  kafkaStyle.opacity = '0';
  kafkaDiv.style.zIndex = '0';
  //earthDiv.style.marginTop = '-1em';
  kafkaLabel = new CSS2DObject( kafkaDiv );
  kafkaLabel.position.set(-3.5, 0, 0)
  tech.add( kafkaLabel );

  tech.scale.set(0.3,0.3,0.3)
  tech.position.set(2, -10, 0);
  tech.polygonOffset = true;
  tech.polygonOffset = 0;
  
  function kafkaScaleUp() {
    pkafkaStyle.background = 'rgb(24, 24, 24)';
    pkafkaStyle.color = 'white';
    kafkaStyle.opacity = '1';
    kafkaStyle.content = 'normal';
  }

  function kafkaScaleDown() {
    pkafkaStyle.background = '#285376';
    pkafkaStyle.color = 'white';
    kafkaStyle.opacity = '0';
    kafkaStyle.content = 'none';
  }

  //////////////////TECH BUTTON/////////////////////
  techButtonDiv = document.createElement( 'span' );
  let techButtonStyle = techButtonDiv.style;
  techButtonDiv.className = "tech-knapp";
  techButtonStyle.background =  '#285376'; // rgb(24, 24, 24)
  techButtonStyle.color = 'white';
  techButtonStyle.fontSize = '18px';
  techButtonStyle.borderRadius = '15px';
  techButtonStyle.margin = "20px";
  techButtonStyle.padding = "15px";
  techButtonStyle.zIndex = "999";
  techButtonDiv.innerHTML = "Tech";
  techButtonDiv.style.zIndex = '99';

  techButtonLabel = new CSS2DObject( techButtonDiv );
  techButtonLabel.position.set(-2.5, -2.5, 0);
  techButtonDiv.addEventListener('mouseover', techScaleUp, false);
  techButtonDiv.addEventListener('mouseout', techScaleDown);
  tech.add(techButtonLabel);
  

  /////////////////TECH INFO////////////////////
  techDiv = document.createElement( 'span' );
  let techStyle = techDiv.style;
  techDiv.setAttribute('style', 'white-space: pre;');
  techDiv.className = 'techText';
  techDiv.innerHTML = '<b>MQTT vs. OPC UA vs. APACHE KAFKA</b><br><br>';
  //earthDiv.style.fontWeight = 'bold';
  techDiv.innerHTML += 'MQTT (Message Queuing Telemetry Transport) og \r\nOPC UA (Open Platform Communications United Architecture) \r\ner “open platform” standarder for datautveksling innenfor \r\nindustri 4.0 og Industrial Internet of Things (IIOT). Et problem \r\nsom oppstår er at eldre IT-miljøer fortsatt må bli tatt i bruk, \r\nogså i industri 4.0, noe som setter begrensinger for integrering. \r\nKafka kan anses som komplementært, og ikke en konkurrent til\r\n MQTT og OPC UA. Det kan være vanskelig å vite hvilken \r\nstruktur som burde bli valgt mellom MQTT og \r\nOPC UA sammen med Kafka. Først og fremst er denne \r\ndiskusjonen kun relevant hvis har et valg.';
  techStyle.background = 'rgb(24, 24, 24)'
  techStyle.borderRadius = '5%';
  techStyle.padding = '15px';
  techStyle.fontSize = '18px';
  techStyle.margin = "10px";
  techStyle.opacity = '0';
  techDiv.style.zIndex = '10';
  //earthDiv.style.marginTop = '-1em';
  techLabel = new CSS2DObject( techDiv );
  techLabel.position.set(-3.5, 0, 0)
  tech.add( techLabel );

  function techScaleUp() {
    techButtonStyle.background = 'rgb(24, 24, 24)';
    techButtonStyle.color = 'white';
    techStyle.opacity = '1';
    techStyle.content = 'normal';
  }

  function techScaleDown() {
    techButtonStyle.background = '#285376';
    techButtonStyle.color = 'white';
    techStyle.opacity = '0';
    techStyle.content = 'none';
  }


/////////////////INTERNATIONAL//////////////////////
  ////////////HAMBURG BUTTON///////////////////
  earthButtonDiv = document.createElement( 'span' );
  let bStyle = earthButtonDiv.style;
  earthButtonDiv.className = "hamburg-knapp";
  bStyle.background =  '#285376';
  bStyle.color = 'white';
  bStyle.fontSize = '18px';
  bStyle.borderRadius = '15px';
  bStyle.margin = "20px";
  bStyle.padding = "15px";
  bStyle.zIndex = "1000";
  earthButtonDiv.innerHTML = "Hamburg";

  earthButtonLabel = new CSS2DObject( earthButtonDiv );
  earthButtonLabel.position.set(-4.9, -1.5, 0);
  earthButtonDiv.addEventListener('mouseover', hamburgScaleUp, false);
  earthButtonDiv.addEventListener('mouseout', hamburgScaleDown);
  earth.add(earthButtonLabel);

  /////////////HAMBURG INFO/////////////////
  earthDiv = document.createElement( 'span' );
  let eStyle = earthDiv.style;
  earthDiv.setAttribute('style', 'white-space: pre;');
  earthDiv.className = 'hamburgText';
  earthDiv.innerHTML = '<b>Havneprosjektet i Hamburg</b><br>';
  //earthDiv.style.fontWeight = 'bold';
  earthDiv.innerHTML += '\r\nHavnen i Hamburg er den nest-travleste i Europa \r\nog en handelsvei for store deler av Øst-Europa.\r\nDet er flere jobber dette havnevesenet må utføre, \r\nderfor er det viktig at de tilbyr en effektiv infrastruktur \r\ni havneområdet som: administrering av eiendom, \r\nvedlikehold av kaivegger, broer, brygger og diverse \r\nstrukturer, samt transport i form av skip, jernbane \r\nog lastebil. Diverse industrifirmaer administrerer \r\ncontainerterminalene. Det som gjør Hamburg \r\nspesielt, er at det har vært et samarbeid med \r\nprogramvarefirmaet SAP i en serie på 20 prosjekter \r\nsom ble kalt smartPORT Logistics. Prosjektene tar \r\ni bruk teknologier som Internet of Things til å \r\nskape et state-of-the-art logistikksystem som \r\neffektiviserer sub-sektorene med trafikk- og godsflyt \r\nog bedre infrastruktur.';
  eStyle.background = 'rgb(24, 24, 24)';
  eStyle.borderRadius = '5%';
  eStyle.padding = '15px';
  eStyle.fontSize = '18px';
  eStyle.margin = "10px";
  eStyle.opacity = '0';
  

  earthDiv.style.zIndex = 0;
  //earthDiv.style.marginTop = '-1em';
  earthLabel = new CSS2DObject( earthDiv );
  earthLabel.position.set(0, 0, 0)
  earth.add( earthLabel );
  earth.polygonOffset = true;
  earth.polygonOffset = 0;

  earth.scale.set(0.5, 0.5, 0.5)
  earth.position.set(1, -15, 0)

  ///////////////PALMAS BUTTON////////////////////
  palmasButtonDiv = document.createElement( 'span' );
  let pStyle = palmasButtonDiv.style;
  palmasButtonDiv.className = "palmas-knapp";
  pStyle.background =  '#285376';
  pStyle.color = 'white'
  pStyle.fontSize = '18px';
  pStyle.borderRadius = '15px';
  pStyle.margin = "20px";
  pStyle.padding = "15px";
  pStyle.zIndex = "1000";
  palmasButtonDiv.innerHTML = "Las Palmas";

  palmasButtonLabel = new CSS2DObject( palmasButtonDiv );
  palmasButtonLabel.position.set(-4, -1.5, 0);
  palmasButtonDiv.addEventListener('mouseover', palmasScaleUp, false);
  palmasButtonDiv.addEventListener('mouseout', palmasScaleDown);
  earth.add(palmasButtonLabel);


  /////////////PALMAS INFO/////////////////
  palmasInfoDiv = document.createElement( 'span' );
  let peStyle = palmasInfoDiv.style;
  palmasInfoDiv.setAttribute('style', 'white-space: pre;');
  palmasInfoDiv.className = 'palmasText';
  palmasInfoDiv.innerHTML = '<b>Havneprosjektet i Las Palmas de Gran Canaria</b><br>';
  //earthDiv.style.fontWeight = 'bold';
  palmasInfoDiv.innerHTML += '\r\nHavnen i Las Palmas de Gran Canaria \r\ner en av de ledende på den vestlige kysten av Afrika, \r\nog er et knutepunkt som kobler Europa, Afrika og Amerika. \r\nDe styres av det lokale havnevesenet som er avhengig \r\nav å motta nøyaktig informasjon fra nære fartøy, \r\ncontainere, meteorologisk data, og sjøstanden. Når dataen \r\nblir samlet opp må aggregeringen av data prosesseres og \r\nforsikres. <br><br>Gjennom et prosjekt som stammer fra en rekke \r\ninteressenter kalt SmartPort, som tar i bruk diverse \r\nstatiske og dynamiske data. Noen eksempler på statiske \r\ndata i SmartPort er infrastruktur, hotel, restauranter, \r\nminibanker, bussholdeplasser og apotek. Sensorene \r\nfor disse dataene er plassert på faste steder \r\nsom tillater statisk lagring av koordinatene deres. \r\nEksempler på dynamiske data kommer fra bøyer \r\nog meteorologiske sensorer som oppdaterer med ny \r\ndata hvert 3. minutt. De meteorologiske sensorene tilbyr \r\ndata som: temperatur, vindhastighet og retning, \r\nvindkaststørrelse og retning, nedbør, trykk og fuktighet.';
  peStyle.background = 'rgb(24, 24, 24)'
  peStyle.borderRadius = '5%';
  peStyle.padding = '15px';
  peStyle.fontSize = '18px';
  peStyle.margin = "10px";
  peStyle.opacity = '0';


  palmasInfoDiv.style.zIndex = 0;
  //earthDiv.style.marginTop = '-1em';
  palmasLabel = new CSS2DObject( palmasInfoDiv );
  palmasLabel.position.set(0, 0, 0)
  earth.add( palmasLabel );

  

  // earthMassDiv = document.createElement( 'div' );
  // earthMassDiv.className = 'label';
  // earthMassDiv.textContent = '5.97237e24 kg';
  // earthMassDiv.style.marginTop = '-1em';
  // earthMassLabel = new CSS2DObject( earthMassDiv );
  // earthMassLabel.position.set( 0, - 2 * EARTH_RADIUS, 0 );
  //earth.add( earthMassLabel );


  ////////////RENDERING FOR 2D LABELS///////////////
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize( sizes.width, sizes.height );
  labelRenderer.domElement.style.position = 'fixed';
  labelRenderer.domElement.style.top = '0px';
  document.body.appendChild( labelRenderer.domElement );


  

  function hamburgScaleUp() {
    
      // bStyle.padding = '20px';
      // bStyle.fontSize = '20px'; 
      bStyle.background = 'rgb(24, 24, 24)';
      bStyle.color = 'white';
      pStyle.content = 'none';
      eStyle.opacity = '1';
      eStyle.content = 'normal';
    
  }

  function hamburgScaleDown() {
      // bStyle.padding = '15px';
      // bStyle.fontSize = '18px'; 
      bStyle.background = '#285376';
      bStyle.color = 'white';
      pStyle.content = 'normal';
      eStyle.opacity = '0';
      eStyle.content = 'none'
  }

  function palmasScaleUp() {
      // bStyle.padding = '20px';
      // bStyle.fontSize = '20px'; 
      pStyle.background = 'rgb(24, 24, 24)';
      pStyle.color = 'white';
      peStyle.opacity = '1';
      peStyle.content = 'normal';
  }

  function palmasScaleDown() {
      // bStyle.padding = '15px';
      // bStyle.fontSize = '18px'; 
      pStyle.background = '#285376';
      pStyle.color = 'white';
      earthButtonDiv.style.opacity = '1';
      peStyle.opacity = '0';
      peStyle.content = 'none';
  }

////////////////////LOAD WIFI MODEL//////////////////
const WIFIloader = new OBJLoader();
wifiModel = new THREE.Object3D();

  // load a resource
  WIFIloader.load('/models/wifi.obj', function ( object ) {

    object.scale.set(15, 15, 15)
    object.position.set(1.15, -12.78, 0)
    object.rotation.set(0, 0, 0)
    wifiModel = object;
      scene.add( wifiModel );
  
    },
    // called when loading is in progresses
    function ( xhr ) {
  
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  
    },
    // called when loading has errors
    function ( error ) {
  
      console.log( 'An error happened' );
  
    }
  );

///////////////LOAD PORT MODEL////////////////////
  // loader.load('/models/port/port.glb', function (gltf) {
    
  //   //mesh = gltf.scene.children[0];
  //   //scene.add(mesh);
    
  //   model = gltf.scene;

  //   model.position.set( 0, 1, 0 );
  //   model.rotation.set(0, 0, 0);
  //   model.scale.set( 0.015, 0.015, 0.015 );
  //   modelY = model.position.y
    //scene.add( model );
   

  // }, function ( xhr ) {

  //   console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  // }, undefined, function (e) {
  //   console.error(e);
  // });


  //////////////LOAD EARTH MODEL////////////////////
  earthModel = new THREE.Object3D();
  loader.load('/models/earth/scene.gltf', function (gltf) {
    
    
    earthModel = gltf.scene;
    earthModel.position.set( 1, -16, 0 );
    earthModel.rotation.set(0, 0, 0);
    earthModel.scale.set( 1, 1, 1 );
    earthModel.name = "EarthModel";

    // var earthMesh = new THREE.Mesh();
    // let earthMeshMaterial = new THREE.MeshStandardMaterial();
    // gltf.scene.traverse(function (child) {
    //   if ((child).isMesh) {
    //       earthMesh = child
    //       earthMeshMaterial = child.material
    //       earthMeshMaterial.format = THREE.RGBAFormat;
    //       earthMeshMaterial.polygonOffset = true
    //       earthMeshMaterial.polygonOffsetUnit = 1;
    //       earthMeshMaterial.polygonOffsetFactor = -1;
    //   }})
    // var jorden = new THREE.Mesh(earthMesh.geometry, earthMeshMaterial)
    // jorden.scale.set(0.02,0.02,0.02)
    // scene.add(jorden)
    // earthMeshMaterial.transparent = true;
    // earthMeshMaterial.polygonOffset = true;
    // earthMesh.position.set( 1.5, -11.5, 26 );
    // scene.add(earthMesh);

    // earthModel.traverse((child) => {
    //   if(child.isMesh) {
    //     child.material.po;
    //     earthGeometry = child.geometry;
    //   }
    // });

    //earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    //earthMesh.scale.set(10, 10, 10)

    // var jord = new THREE.Group();
    // jord.add(earthMesh);
    //scene.add(jord);

    scene.add(earthModel);

  }, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  }, undefined, function (e) {
    console.error(e);
  });

  /////////////////////LOAD LITEN PORT////////////////////////////
  neuronModel = new THREE.Object3D();
  loader.load('/models/error/scene.gltf', function (gltf) {
    
    
    neuronModel = gltf.scene;
    neuronModel.position.set( 1, -25.3, 0 );
    neuronModel.scale.set(1.5, 1.5, 1.5)
    neuronModel.rotation.set(0, 3.5, 0)
    neuronModel.name = "errorModel";

    scene.add(neuronModel);

  }, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  }, undefined, function (e) {
    console.error(e);
  });

  /////////////////////LOAD BOAT////////////////////////////
  boatModel = new THREE.Object3D();
  loader.load('/models/boat/scene.gltf', function (gltf) {
    
    
    boatModel = gltf.scene;
    boatModel.position.set( 0.5, -20.1, 1 );
    boatModel.rotation.set(0, -1, 0);
    boatModel.scale.set( 2, 2, 2 );
    boatModel.name = "BoatModel";

    
    scene.add(boatModel);

  }, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  }, undefined, function (e) {
    console.error(e);
  });

  /////////////////////LOAD NEW PORT////////////////////////////
  portModel = new THREE.Object3D();
  loader.load('/models/port/scene.gltf', function (gltf) {
    
    
    portModel = gltf.scene;
    portModel.position.set( 0, 0, 0 );
    portModel.rotation.set(0.25, -0.8, 0);
    portModel.scale.set( 2, 2, 2 );
    portModel.name = "portModel";

    
    scene.add(portModel);

  }, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  }, undefined, function (e) {
    console.error(e);
  });

  /////////////////////LOAD satEarth////////////////////////////
  satearthModel = new THREE.Object3D();
  loader.load('/models/earth/scene.gltf', function (gltf) {
    
    
    satearthModel = gltf.scene;
    satearthModel.position.set( 1, -3.4, 0 );
    satearthModel.scale.set(0.8, 0.8, 0.8 )
    satearthModel.rotation.set(0, 0, 0)
    satearthModel.name = "satearthModel";
    scene.add(satearthModel);

  }, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  }, undefined, function (e) {
    console.error(e);
  });

  /////////////////////LOAD SATELITTE////////////////////////////
  satelitteModel = new THREE.Object3D();
  loader.load('/models/satelitte/scene.gltf', function (gltf) {
    
    
    satelitteModel = gltf.scene;
    satelitteModel.scale.set(0.00005, 0.00005, 0.00005)
    satelitteModel.rotation.set(-1, -1, 0)
    satelitteModel.position.set( -2, 1, 0 );
    satelitteModel.name = "satelitteModel";
    satearthModel.add(satelitteModel)

    //scene.add(satelitteModel);

  }, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  }, undefined, function (e) {
    console.error(e);
  });

  /////////////////////LOAD norge////////////////////////////
  // norgeModel = new THREE.Object3D();
  // loader.load('/models/norge/scene.gltf', function (gltf) {
    
    
  //   norgeModel = gltf.scene;
  //   norgeModel.scale.set(0.3, 0.3, 0.3)
  //   norgeModel.rotation.set(0, 0, 0)
  //   norgeModel.position.set( 1.2, -12.3, 0 );
  //   norgeModel.name = "norgeModel";
  //   scene.add(norgeModel)

  // }, function ( xhr ) {

  //   console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  // }, undefined, function (e) {
  //   console.error(e);
  // });

  /////////////////////LOAD CLOUD////////////////////////////
  userModel = new THREE.Object3D();
  loader.load('/models/glass/scene.gltf', function (gltf) {
    
    
    userModel = gltf.scene;
    userModel.scale.set(0.05, 0.05, 0.05)
    userModel.rotation.set(0, -0.5, 0)
    userModel.position.set( -1, -8, -0.5 );
    userModel.name = "userModel";
    scene.add(userModel)

  }, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  }, undefined, function (e) {
    console.error(e);
  });

   /////////////////////LOAD EXCLAMATION POINT////////////////////////////
   pointModel = new THREE.Object3D();
   loader.load('/models/person/excl/scene.gltf', function (gltf) {
     
     
    pointModel = gltf.scene;
    pointModel.scale.set(0.01, 0.01, 0.01)
    pointModel.rotation.set(0, -0.5, 0)
    pointModel.position.set( 1.3, -7.4, 0 );
    pointModel.name = "pointModel";
     scene.add(pointModel)
 
   }, function ( xhr ) {
 
     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
 
   }, undefined, function (e) {
     console.error(e);
   });



  

  renderer.setClearAlpha(0)
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.render(scene, camera)

  // Full screen canvas
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  //camera.position.setZ(30)

  events();
}

 //////////////////////WINDOW RESIZE//////////////////////////
 window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

  // let renderer3d = new CSS3DRenderer();
  // renderer3d.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer3d.domElement);
  // let el = document.createElement('div');
  // el.textContent = "Hello";
  // let obj = new THREE.CSS3DRenderer(el);
  // obj.position.set(0,0,0);
  // scene.add(obj);


  //   // Objects
  //   const towerGeometry1 = new THREE.BoxGeometry(0.3, 0.5, 0.2)
  //   const towerGeometry2 = new THREE.BoxGeometry(0.3, 0.55, 0.2)
  //   const towerGeometry3 = new THREE.BoxGeometry(0.3, 0.35, 0.2)
  //   const towerGeometry4 = new THREE.BoxGeometry(0.3, 0.28, 0.2)
  
  //   const boxGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.2);
    
  
  
  //   // Material, wrapping paper for object
  //   const towerMaterial1 = new THREE.MeshStandardMaterial({color: 0x064E40})
  //   const towerMaterial2 = new THREE.MeshStandardMaterial({color: 0x1F5F5B})
  //   const towerMaterial3 = new THREE.MeshStandardMaterial({color: 0x0e8c80})
  //   const towerMaterial4 = new THREE.MeshStandardMaterial({color: 0x48BF91})
  
  //   const boxMaterial = new THREE.MeshStandardMaterial({color: 0x064E40})
  
  
  //   // Mesh
  //   const tower1 = new THREE.Mesh(towerGeometry1, towerMaterial1)
  //   const tower2 = new THREE.Mesh(towerGeometry2, towerMaterial2)
  //   const tower3 = new THREE.Mesh(towerGeometry3, towerMaterial3)
  //   const tower4 = new THREE.Mesh(towerGeometry4, towerMaterial4)
  
  //   const staticT1 = new THREE.Mesh(towerGeometry1, towerMaterial1)
  //   const staticT2 = new THREE.Mesh(towerGeometry2, towerMaterial2)
  //   const staticT3 = new THREE.Mesh(towerGeometry3, towerMaterial3)
  //   const staticT4 = new THREE.Mesh(towerGeometry4, towerMaterial4)
  
  //   const box = new THREE.Mesh(boxGeometry, boxMaterial);
  //   box.position.set(0,0,20);
  //   scene.add(box);

  //   const earth = box
 


  // // model 1
  // tower1.position.set(-0.15, 0.025, 0)
  // tower2.position.set(0.15, 0.05, 0)
  // tower3.position.set(-0.15, -0.05, 0.2)
  // tower4.position.set(0.15, -0.085, 0.2)

  // // model 2
  // staticT1.position.set(-0.15, 0.025, 0)
  // staticT2.position.set(0.15, 0.05, 0)
  // staticT3.position.set(-0.15, -0.05, 0.2)
  // staticT4.position.set(0.15, -0.085, 0.2)

  
  // ///////////////////////////////
  // // Groups & model positioning
  // var sculpt = new THREE.Group();
  // var staticSculpt = new THREE.Group();

  // sculpt.add(tower1, tower2, tower3, tower4);
  // staticSculpt.add(staticT1, staticT2, staticT3, staticT4);
  // scene.add(sculpt, staticSculpt);

  // sculpt.position.set(1.75, -3.2, 28)
  // sculpt.rotation.set(0, -1, 0)

  // staticSculpt.rotation.y = -1
  // staticSculpt.position.set(1.75, -5.65, 28)

  


// Textures
//scene.add(earth)

// Positioning
// const objectsDistance = 4
// sculpt.position.y += -objectsDistance * 0
// staticSculpt.position.y += -objectsDistance * 0


// Light
// const ambiLight = new THREE.AmbientLight()
// ambiLight.position.set(5, 5, 5)
// scene.add(ambiLight)

/**
 * Scroll
 */

//////////////////////EVENTS///////////////////////
function events() {
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    //model.position.y = (scrollY/300);
    //model.rotation.y = 4 + (scrollY/500)
  })

  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  } 

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

  // button.addEventListener("click", (event) => {
  //   const target = model;
  //   const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  //   button.style.display = 'none';
  //   exitButton.style.display = 'block';
  //   disableScroll();
  //   new TWEEN.Tween(coords)
  //   .to({ x: (target.position.x-offsetX), y: camera.position.y, z: (target.position.z + offsetZ) })
  //     .onUpdate(() => 
  //       camera.position.set(coords.x, coords.y, coords.z)
  //     )
  //     .start();
  // });

  // exitButton.addEventListener("click", (event) => {
  //   camX = camera.position.x;
  //   camY = camera.position.y;
  //   camZ = camera.position.z;
  //   const target = prevCam;
  //   const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  //   button.style.display = 'block';
  //   exitButton.style.display = 'none';
  //   enableScroll();
  //   new TWEEN.Tween(coords)
  //     .to({ x: camX, y: camY, z: camZ })
  //     .onUpdate(() => 
  //       camera.position.set(coords.x, coords.y, coords.z)
  //     )
  //     .start();
  // });

  // earthButton.addEventListener("click", (event) => {
  //   const target = earthModel;
  //   const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  //   const earthCoords = { x: earthModel.position.x, y: earthModel.position.y, z: earthModel.position.z }
  //   const earthRotCoords = { x: earthModel.rotation.x, y: earthModel.rotation.y, z: earthModel.rotation.z }
  //   prevCamEarth = coords;
  //   earthButton.style.display = 'none';
  //   earthExitButton.style.display = 'block';
  //   stop = true;
  //   disableScroll();
  //   new TWEEN.Tween(coords)
  //     .to({ x: target.position.x-0.5, y: target.position.y, z: (target.position.z +1.5) })
  //     .onUpdate(() => 
  //       camera.position.set(coords.x, coords.y, coords.z),

  //     )
  //     .start();

  //     new TWEEN.Tween(earthRotCoords)
  //     .to({ x: earthModel.rotation.x, y: earthModel.rotation.y, z: (earthModel.rotation.z) })
  //     .onUpdate(() => 
  //       earthModel.rotation.set(0, -0.9, 0)
  //     )
  //     .start();
  // });

  // earthExitButton.addEventListener("click", (event) => {
  //   const target = prevCamEarth;
  //   const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  //   const earthCoords = { x: earthModel.position.x, y: earthModel.position.y, z: earthModel.position.z }
  //   earthButton.style.display = 'block';
  //   earthExitButton.style.display = 'none';
  //   stop = false;
  //   enableScroll();

  //   new TWEEN.Tween(coords)
  //     .to({x: camX, y: camY, z: camZ })
  //     .onUpdate(() => 
  //       camera.position.set(coords.x, coords.y, coords.z),
  //       earthModel.position.set( 1.5, -11.5, 28 )
  //     )
  //     .start();

  //     new TWEEN.Tween(earthCoords)
  //     .to({ x: earthModel.rotation.x, y: earthModel.rotation.y, z: (earthModel.rotation.z) })
  //     .onUpdate(() => 
  //       earthModel.rotation.set(0, 5,0)
  //     )
  //     .start();
  // });
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
      //earth.rotation.y += 0.05 * ( targetX - earthModel.rotation.y );
    }

    if (portModel) {
      
      //portModel.rotation.y += 0.05 * ( targetX - model.rotation.y );
    }

    if(neuronModel) {
      neuronModel.rotation.y += 0.05 * ( targetX - neuronModel.rotation.y );
    }

    if (boatModel) {
      boatModel.rotation.y += 0.05 * ( targetX - boatModel.rotation.y );
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

function updatePosition() {

}


function animate() {
  let clock = new THREE.Clock();
  const elapsed = clock.getElapsedTime();


  

  requestAnimationFrame( animate );
  TWEEN.update();
  camera.position.y = -scrollY * 2.5 / sizes.height;
  wifiModel.rotation.y += 0.005;
  satearthModel.rotation.y += 0.01;

  //boatModel.rotation.y += 0.005;
  //tech.rotation.y += 0.005
  //earthModel.rotation.y += 0.0005;
  //controls.update();
  //camera.position.z = defaultCamZ;
  mouseRotate();
  //controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();
