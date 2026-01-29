import * as THREE from "three";

export const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10,
);
camera.position.z = 1.5;
