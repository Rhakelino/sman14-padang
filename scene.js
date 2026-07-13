(function() {
'use strict';

var container = document.getElementById('three-container');
if (!container) return;

var w = container.clientWidth || 380;
var h = container.clientHeight || 380;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
camera.position.set(3, 2, 5);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Main torus knot — green metallic
var knotGeo = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 16, 2, 3);
var knotMat = new THREE.MeshPhysicalMaterial({
  color: 0x1B5E20,
  roughness: 0.25,
  metalness: 0.85,
  emissive: 0x1B5E20,
  emissiveIntensity: 0.08,
  clearcoat: 0.3
});
var knot = new THREE.Mesh(knotGeo, knotMat);
scene.add(knot);

// Wireframe overlay — gold
var wireMat = new THREE.MeshPhysicalMaterial({
  color: 0xFFD000,
  wireframe: true,
  transparent: true,
  opacity: 0.25,
  roughness: 0.5,
  metalness: 0.6
});
var wire = new THREE.Mesh(knotGeo.clone(), wireMat);
wire.scale.set(1.02, 1.02, 1.02);
scene.add(wire);

// Orbits — ring particles
var ringCount = 400;
var ringGeo = new THREE.BufferGeometry();
var positions = new Float32Array(ringCount * 3);
var colors = new Float32Array(ringCount * 3);
for (var i = 0; i < ringCount; i++) {
  var theta = Math.random() * Math.PI * 2;
  var phi = Math.acos(2 * Math.random() - 1);
  var r = 1.6 + Math.random() * 0.4;
  positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
  positions[i*3+2] = r * Math.cos(phi);
  var c = Math.random() > 0.5 ? 0x1B5E20 : 0xFFD000;
  colors[i*3] = ((c >> 16) & 0xFF) / 255;
  colors[i*3+1] = ((c >> 8) & 0xFF) / 255;
  colors[i*3+2] = (c & 0xFF) / 255;
}
ringGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
ringGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
var ringMat = new THREE.PointsMaterial({
  size: 0.04,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
var ring = new THREE.Points(ringGeo, ringMat);
scene.add(ring);

// Orbiting small spheres
var orbitGroup = new THREE.Group();
scene.add(orbitGroup);
for (var i = 0; i < 10; i++) {
  var orbSize = 0.035 + Math.random() * 0.045;
  var orbMat = new THREE.MeshPhysicalMaterial({
    color: Math.random() > 0.5 ? 0x1B5E20 : 0xFFD000,
    emissive: Math.random() > 0.5 ? 0x1B5E20 : 0xFFD000,
    emissiveIntensity: 0.3,
    roughness: 0.2,
    metalness: 0.6
  });
  var orb = new THREE.Mesh(new THREE.SphereGeometry(orbSize, 8, 8), orbMat);
  var angle = (i / 10) * Math.PI * 2;
  var radius = 1.2 + Math.random() * 0.8;
  orb.position.x = Math.cos(angle) * radius;
  orb.position.z = Math.sin(angle) * radius;
  orb.position.y = (Math.random() - 0.5) * 1.0;
  orb.userData = { angle: angle, radius: radius, speed: 0.004 + Math.random() * 0.008, yOff: orb.position.y };
  orbitGroup.add(orb);
}

// Lights
var amb = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(amb);
var dir1 = new THREE.DirectionalLight(0xFFD000, 1.2);
dir1.position.set(3, 5, 4);
scene.add(dir1);
var dir2 = new THREE.DirectionalLight(0x1B5E20, 0.6);
dir2.position.set(-3, -2, 2);
scene.add(dir2);
var dir3 = new THREE.DirectionalLight(0xffffff, 0.4);
dir3.position.set(0, -5, 0);
scene.add(dir3);

// Resize handler
function resize() {
  var nw = container.clientWidth || 380;
  var nh = container.clientHeight || 380;
  if (nw !== w || nh !== h) {
    w = nw; h = nh;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  resize();

  knot.rotation.x += 0.005;
  knot.rotation.y += 0.012;
  knot.rotation.z += 0.003;
  wire.rotation.x -= 0.003;
  wire.rotation.y -= 0.008;
  wire.rotation.z -= 0.002;

  ring.rotation.y += 0.002;
  ring.rotation.x += 0.001;

  orbitGroup.rotation.y += 0.006;
  orbitGroup.children.forEach(function(child, idx) {
    child.position.y = child.userData.yOff + Math.sin(Date.now() * child.userData.speed * 50 + idx) * 0.2;
  });

  renderer.render(scene, camera);
}

animate();

})();
