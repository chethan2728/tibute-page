// three-background.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

let scene, camera, renderer;
let currentPlane, nextPlane;
let textures = [];
let textureIndex = 0;
const transitionTime = 6000;

const loader = new THREE.TextureLoader();
const imagePaths = [
  'assets/1.jpg',
  'assets/2.jpg',
  'assets/3.jpg',
  'assets/4.jpg'
];

init();
animate();
setInterval(crossfadeImage, transitionTime);

function init() {
  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    1,
    1000
  );
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('three-bg').appendChild(renderer.domElement);

  // Load all images as textures
  imagePaths.forEach((path) => {
    const tex = loader.load(path);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    textures.push(tex);
  });

  // Initial plane
  const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
  const material = new THREE.MeshBasicMaterial({
    map: textures[textureIndex],
    transparent: true,
    opacity: 1
  });

  currentPlane = new THREE.Mesh(geometry, material);
  scene.add(currentPlane);

  window.addEventListener('resize', onWindowResize);
}

function crossfadeImage() {
  textureIndex = (textureIndex + 1) % textures.length;

  const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
  const newMaterial = new THREE.MeshBasicMaterial({
    map: textures[textureIndex],
    transparent: true,
    opacity: 0
  });

  nextPlane = new THREE.Mesh(geometry, newMaterial);
  scene.add(nextPlane);

  // Animate crossfade
  let progress = 0;
  const fadeDuration = 60; // frames

  function fade() {
    if (progress < 1) {
      progress += 1 / fadeDuration;
      currentPlane.material.opacity = 1 - progress;
      nextPlane.material.opacity = progress;
      requestAnimationFrame(fade);
    } else {
      scene.remove(currentPlane);
      currentPlane = nextPlane;
    }
  }

  fade();
}

function animate() {
  requestAnimationFrame(animate);
  // Optional: Subtle zoom-in animation
  if (currentPlane) {
    currentPlane.scale.x += 0.0002;
    currentPlane.scale.y += 0.0002;
  }
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
