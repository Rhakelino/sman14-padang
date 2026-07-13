import * as THREE from 'three';

const container = document.getElementById('three-container');
if (!container) return;

let w = container.clientWidth || 380;
let h = container.clientHeight || 380;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
camera.position.set(2.5, 1.5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// — Lights —
const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffd000, 1.8);
key.position.set(2, 4, 3);
scene.add(key);

const fill = new THREE.DirectionalLight(0x1b5e20, 0.6);
fill.position.set(-3, 1, -2);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xffffff, 0.4);
rim.position.set(-1, -2, 4);
scene.add(rim);

// — Torus Knot (main sculpture) —
const geom = new THREE.TorusKnotGeometry(1.05, 0.32, 128, 24);
const mat = new THREE.MeshPhysicalMaterial({
  color: 0x1b5e20,
  metalness: 0.7,
  roughness: 0.25,
  clearcoat: 0.4,
  clearcoatRoughness: 0.3,
  emissive: 0x1b5e20,
  emissiveIntensity: 0.08,
});
const knot = new THREE.Mesh(geom, mat);
knot.rotation.x = 0.4;
knot.rotation.y = 0.3;
scene.add(knot);

// — Inner wireframe glow —
const wireGeom = new THREE.TorusKnotGeometry(1.07, 0.34, 64, 12);
const wireMat = new THREE.MeshBasicMaterial({
  color: 0xffd000,
  wireframe: true,
  transparent: true,
  opacity: 0.12,
});
const wire = new THREE.Mesh(wireGeom, wireMat);
wire.rotation.x = 0.4;
wire.rotation.y = 0.3;
scene.add(wire);

// — Orbiting ring 1 —
const ring1Geo = new THREE.TorusGeometry(1.6, 0.025, 32, 64);
const ring1Mat = new THREE.MeshPhysicalMaterial({
  color: 0xffd000,
  emissive: 0xffd000,
  emissiveIntensity: 0.15,
  metalness: 0.9,
  roughness: 0.2,
});
const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
ring1.rotation.x = Math.PI / 2.8;
ring1.rotation.z = 0.3;
scene.add(ring1);

// — Orbiting ring 2 —
const ring2 = new THREE.Mesh(
  new THREE.TorusGeometry(1.85, 0.015, 24, 64),
  new THREE.MeshPhysicalMaterial({
    color: 0x2e7d32,
    emissive: 0x1b5e20,
    emissiveIntensity: 0.1,
    metalness: 0.5,
    roughness: 0.4,
    transparent: true,
    opacity: 0.6,
  })
);
ring2.rotation.x = Math.PI / 3.2;
ring2.rotation.z = -0.5;
scene.add(ring2);

// — Particles —
const particleCount = 400;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 2 + Math.random() * 1.2;
  positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  positions[i * 3 + 2] = r * Math.cos(phi);
  const c = Math.random() > 0.5 ? 0xffd000 : 0x1b5e20;
  colors[i * 3] = ((c >> 16) & 0xff) / 255;
  colors[i * 3 + 1] = ((c >> 8) & 0xff) / 255;
  colors[i * 3 + 2] = (c & 0xff) / 255;
}
const ptGeo = new THREE.BufferGeometry();
ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
ptGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const ptMat = new THREE.PointsMaterial({
  size: 0.04,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});
const particles = new THREE.Points(ptGeo, ptMat);
scene.add(particles);

// — Ground glow ring —
const glowGeo = new THREE.RingGeometry(1.2, 2.4, 48);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0xffd000,
  transparent: true,
  opacity: 0.06,
  side: THREE.DoubleSide,
});
const glow = new THREE.Mesh(glowGeo, glowMat);
glow.rotation.x = -Math.PI / 2;
glow.position.y = -1.3;
scene.add(glow);

// — Small floating orbs —
const orbs = [];
for (let i = 0; i < 8; i++) {
  const size = 0.04 + Math.random() * 0.06;
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(size, 12, 12),
    new THREE.MeshPhysicalMaterial({
      color: Math.random() > 0.5 ? 0xffd000 : 0x2e7d32,
      emissive: Math.random() > 0.5 ? 0xffd000 : 0x1b5e20,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
    })
  );
  const angle = (i / 8) * Math.PI * 2;
  const radius = 2.0 + Math.random() * 0.5;
  orb.userData = { angle, radius, speed: 0.3 + Math.random() * 0.3, yOff: (Math.random() - 0.5) * 0.8 };
  orb.position.set(
    Math.cos(angle) * radius,
    orb.userData.yOff,
    Math.sin(angle) * radius
  );
  scene.add(orb);
  orbs.push(orb);
}

// — Resize handler —
function resize() {
  w = container.clientWidth || 380;
  h = container.clientHeight || 380;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', resize);
const ro = new ResizeObserver(resize);
ro.observe(container);

// — Animation loop —
function animate(t) {
  requestAnimationFrame(animate);
  const speed = t * 0.0003;

  knot.rotation.x = 0.4 + Math.sin(speed * 0.7) * 0.1;
  knot.rotation.y = speed * 0.8 + 0.3;
  wire.rotation.copy(knot.rotation);

  ring1.rotation.x = Math.PI / 2.8 + Math.sin(speed * 0.4) * 0.05;
  ring1.rotation.z = 0.3 + speed * 0.2;
  ring2.rotation.x = Math.PI / 3.2 + Math.sin(speed * 0.3 + 1) * 0.05;
  ring2.rotation.z = -0.5 + speed * 0.15;

  particles.rotation.y = speed * 0.15;
  glow.rotation.z = speed * 0.1;

  orbs.forEach((orb, i) => {
    const a = orb.userData.angle + speed * orb.userData.speed;
    orb.position.x = Math.cos(a) * orb.userData.radius;
    orb.position.z = Math.sin(a) * orb.userData.radius;
    orb.position.y = orb.userData.yOff + Math.sin(speed * 2 + i) * 0.2;
  });

  renderer.render(scene, camera);
}
animate(0);
