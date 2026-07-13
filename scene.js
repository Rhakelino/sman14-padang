(function() {
'use strict';

console.log('scene.js: starting');

var container = document.getElementById('three-container');
if (!container) { console.log('scene.js: no container'); return; }
console.log('scene.js: container found', container.clientWidth, container.clientHeight);

var w = container.clientWidth || 380;
var h = container.clientHeight || 380;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
camera.position.set(3, 2, 5);

var renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch(e) {
  console.log('scene.js: WebGL error', e.message);
  return;
}
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);
console.log('scene.js: canvas appended');

// A simple green sphere to verify rendering
var sphereGeo = new THREE.SphereGeometry(0.8, 32, 32);
var sphereMat = new THREE.MeshPhysicalMaterial({
  color: 0x1B5E20,
  roughness: 0.3,
  metalness: 0.7,
  emissive: 0x1B5E20,
  emissiveIntensity: 0.1
});
var sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);
console.log('scene.js: sphere added');

// Wireframe
var wireMat = new THREE.MeshBasicMaterial({
  color: 0xFFD000,
  wireframe: true,
  transparent: true,
  opacity: 0.3
});
var wire = new THREE.Mesh(sphereGeo.clone(), wireMat);
wire.scale.set(1.05, 1.05, 1.05);
scene.add(wire);

// Lights
var amb = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(amb);
var dir = new THREE.DirectionalLight(0xFFD000, 1);
dir.position.set(2, 5, 3);
scene.add(dir);

// Animation
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.02;
  wire.rotation.x -= 0.005;
  wire.rotation.y -= 0.01;
  renderer.render(scene, camera);
}
animate();
console.log('scene.js: animation started');

})();
