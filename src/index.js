import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createMesh } from "./createMesh";
import "./styles.css";

let camera, scene, renderer;
let mesh;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  camera.position.z = 1;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  new OrbitControls(camera, renderer.domElement);

  mesh = createMesh("あいうえお順です😃", 0.1, false);
  scene.add(mesh);

  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

const input = document.getElementById("textInput");
input.addEventListener("input", (evt) => {
  mesh.changeTexture(evt.target.value);
});
