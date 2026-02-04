import * as THREE from "three";
import { texture, updateTexture, resizeCanvas } from "./panel-canvas";
export { setFps } from "./panel-canvas";
const geometry = new THREE.PlaneGeometry(1.3, 0.8);
const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.FrontSide,
    transparent: true,
});
const mouse = { x: 0, y: 0 };
const targetOffset = { x: 0, y: 0 };
const currentOffset = { x: 0, y: 0 };

const baseX = -30;
const baseY = 45;
const sensitivity = 0.05;
function rotate() {
    targetOffset.x = mouse.x * sensitivity;
    targetOffset.y = -mouse.y * sensitivity;

    currentOffset.x += (targetOffset.x - currentOffset.x) * 0.15;
    currentOffset.y += (targetOffset.y - currentOffset.y) * 0.15;

    const qWorldX = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        THREE.MathUtils.degToRad(baseX) + currentOffset.y,
    );
    const qWorldY = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        THREE.MathUtils.degToRad(baseY) + currentOffset.x,
    );
    const targetQ = qWorldX.clone().premultiply(qWorldY);

    mesh.quaternion.copy(targetQ);
}
export const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(-0.35, 0.05, 0);
export function update() {
    updateTexture();
    rotate();
}
export function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}
export function resize(width, height) {
    resizeCanvas(width, height);
}
