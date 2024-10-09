import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { vh } from "./main.js";

const WINDOW_WIDTH = (window.innerWidth * 2) / 4;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  5,
  WINDOW_WIDTH / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  alpha: true,
});

function onWindowResize() {
  const width = (window.innerWidth * 2) / 4;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", onWindowResize);
onWindowResize();

// ** Orbit Controls ** //

const controls = new OrbitControls(camera, renderer.domElement);

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 20, 100);
controls.update();
controls.enableZoom = false;

// ** Logging camera changes ** //
// controls.addEventListener("change", function () {
// 	console.log(
// 		"Camera rotation:",
// 		camera.rotation.x,
// 		camera.rotation.y,
// 		camera.rotation.z
// 	);
//   console.log(
//     "Camera position:",
//     camera.position.x,
//     camera.position.y,
//     camera.position.z
//   );
//   console.log(
//     "Camera pan:",
//     controls.target.x,
//     controls.target.y,
//     controls.target.z
//   );
// });

// ** Loading Violin ** //

let violin;

const GltfLoader = new GLTFLoader();

// Load a glTF resource
GltfLoader.load(
  // resource URL
  "assets/Violin.glb",
  // called when the resource is loaded
  function (gltf) {
    violin = gltf.scene;

    scene.add(violin);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened", error);
  }
);

let ranAnimationFunc = false;

function animate() {
  controls.update();

  if (violin !== undefined && !ranAnimationFunc) {
    createAnimations();
    ranAnimationFunc = true;
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// ** Animations ** //

// {
// 	"rotation": [-1.8143717866455322, -0.885793984354576, -1.8813143132145713],
// 	"position": [-25.560870000000005, 21.675372, -4.602106000000001],
// 	"pan": [0.232428, 1.2250729999999999, 0.47999]
// },
const keyframes = [
  // First is not animated, it is initial
  {
    rotation: [-0.8210487582243323, -0.45335812604562764, -0.43967585528093744],
    position: [-21.047083453696803, 32.487262248487355, 30.09437554991128],
    pan: [0.05073084860961398, 0.7948283830260309, 0.5847561273484202],
  },
  {
    rotation: [
      -0.006782241566443082, -1.5030487324436124, -0.006766683643050312,
    ],
    position: [-47.5066299117112, 1.4301315210054029, 3.1188282428472163],
    pan: [0.05105574532485072, 1.4082463643309535, -0.10795465707896856],
  },
  {
    rotation: [3.094166113591845, 0.009990202484805824, -3.1411185052184596],
    position: [0.4948814112881588, -1.4189809802999005, -46.57986680137825],
    pan: [0.029485600488800112, 0.7894933316548782, -0.04857355427657906],
  },
  {
    rotation: [-2.43486162851592, 0.41127325040438, 2.8126413432202235],
    position: [19.913047451835773, 30.29192840088985, -33.21674721364455],
    pan: [0.34880454314838266, 1.1639059545206563, 0.8965793074359726],
  },
  {
    rotation: [-0.9235913194125372, 0.28776804051204447, 0.3592188603951932],
    position: [15.26497094144331, 42.56660846946009, 32.478699893934305],
    pan: [0.039425938605574695, 1.5288187556922572, 1.4621952171491606],
  },
  {
    rotation: [
      -1.5001815080104433, 0.0007239529551606057, 0.010234734707253288,
    ],
    position: [0.1060627261473445, 77.03433902268921, 5.9773615602407],
    pan: [0.050731, 0.794828, 0.584756],
  },
];
// start: "bottom 95%",
// 				end: `50% 50%`,'

camera.position.x = keyframes[0]["position"][0];
camera.position.y = keyframes[0]["position"][1];
camera.position.z = keyframes[0]["position"][2];

camera.rotation.x = keyframes[0]["rotation"][0];
camera.rotation.y = keyframes[0]["rotation"][1];
camera.rotation.z = keyframes[0]["rotation"][2];

controls.target.x = keyframes[0]["pan"][0];
controls.target.y = keyframes[0]["pan"][1];
controls.target.z = keyframes[0]["pan"][2];

const createAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  const height = $(window).height() - $(`.paragraph[data-index='0']`).offset().top;
  const DURATION = 1;

	const timeline = gsap.timeline({
  	scrollTrigger: {
  		trigger: `.paragraphs`,
  		start: `top+=${height} bottom`,
  		end: "bottom+=50% bottom",
  		scrub: 5,
  	},
  });

  keyframes.slice(1).map((animation, i) => {
		console.log('duration', DURATION)
		console.log('Keyframe time', i * DURATION)

  	timeline.to(camera.rotation, {
  		x: animation["rotation"][0],
  		y: animation["rotation"][1],
  		z: animation["rotation"][2],
  		duration: DURATION
  	}, i * DURATION).to(camera.position, {
  		x: animation["position"][0],
  		y: animation["position"][1],
  		z: animation["position"][2],
  		duration: DURATION
  	}, i * DURATION).to(controls.target, {
  		x: animation["pan"][0],
  		y: animation["pan"][1],
  		z: animation["pan"][2],
  		duration: DURATION
  	}, i * DURATION);
  })
  
};
