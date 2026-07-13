(function() {
'use strict';

var container = document.getElementById('three-container');
if (!container) return;

var w = container.clientWidth || 380;
var h = container.clientHeight || 380;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
camera.position.set(3, 2, 5);

var renderer;
try {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
} catch(e) {
  return;
}
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// TorusKnot — bentuk geometris keren buat sekolah teknik
var knotGeo = new THREE.TorusKnotGeometry(0.8, 0.25, 128, 16);
var knotMat = new THREE.MeshPhysicalMaterial({
  color: 0x1B5E20,
  roughness: 0.25,
  metalness: 0.8,
  emissive: 0x1B5E20,
  emissiveIntensity: 0.08,
  clearcoat: 0.3
});
var knot = new THREE.Mesh(knotGeo, knotMat);
scene.add(knot);

// Wireframe emas
var edgeGeo = new THREE.EdgesGeometry(knotGeo);
var edgeMat = new THREE.LineBasicMaterial({
  color: 0xFFD000,
  transparent: true,
  opacity: 0.4
});
var wire = new THREE.LineSegments(edgeGeo, edgeMat);
scene.add(wire);

// Particle field
var particleCount = 400;
var positions = new Float32Array(particleCount * 3);
var colors = new Float32Array(particleCount * 3);
for (var i = 0; i < particleCount; i++) {
  var r = 1.5 + Math.random() * 2;
  var theta = Math.random() * Math.PI * 2;
  var phi = Math.acos(2 * Math.random() - 1);
  positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
  positions[i*3+2] = r * Math.cos(phi);
  var c = Math.random();
  colors[i*3] = c < 0.5 ? 0.105 : (0.1 + 0.2 * Math.random());
  colors[i*3+1] = c < 0.5 ? 0.37 : (0.35 + 0.2 * Math.random());
  colors[i*3+2] = c < 0.5 ? 0.125 : 0;
}
var partGeo = new THREE.BufferGeometry();
partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
partGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
var partMat = new THREE.PointsMaterial({
  size: 0.06,
  vertexColors: true,
  transparent: true,
  opacity: 0.8
});
var particles = new THREE.Points(partGeo, partMat);
scene.add(particles);

// Lights
var amb = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(amb);
var dir = new THREE.DirectionalLight(0xFFD000, 1.2);
dir.position.set(2, 5, 3);
scene.add(dir);
var dir2 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
dir2.position.set(-2, 0, 3);
scene.add(dir2);

// Orbit ring
var ringGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
var ringMat = new THREE.MeshBasicMaterial({
  color: 0x1B5E20,
  transparent: true,
  opacity: 0.3
});
var ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 3;
scene.add(ring);

var ring2Geo = new THREE.TorusGeometry(2.0, 0.015, 16, 64);
var ring2Mat = new THREE.MeshBasicMaterial({
  color: 0xFFD000,
  transparent: true,
  opacity: 0.25
});
var ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
ring2.rotation.x = -Math.PI / 4;
ring2.rotation.y = Math.PI / 6;
scene.add(ring2);

// Animation
var clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  var t = clock.getElapsedTime();
  knot.rotation.x = Math.sin(t * 0.2) * 0.3;
  knot.rotation.y = t * 0.4;
  wire.rotation.copy(knot.rotation);
  particles.rotation.y = t * 0.05;
  ring.rotation.z = t * 0.1;
  ring2.rotation.z = -t * 0.08;
  renderer.render(scene, camera);
}
animate();

})();
