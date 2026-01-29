import * as THREE from "three";
import { texture, updateTexture, resizeCanvas } from "./panel-canvas";
const geometry = new THREE.PlaneGeometry(1.3, 0.8);
const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uAlphaStart;
    uniform float uAlphaEnd;
    uniform float uControlPoint1;
    uniform float uControlPoint2;

    varying vec2 vUv;
    varying vec3 vPosition;

    float cubicBezier(float t, float p0, float p1, float p2, float p3) {
    float u = 1.0 - t;
    float tt = t * t;
    float uu = u * u;
    float uuu = uu * u;
    float ttt = tt * t;

    float p = uuu * p0;
    p += 3.0 * uu * t * p1;
    p += 3.0 * u * tt * p2;
    p += ttt * p3;

    return p;
    }

    void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    float progress = cubicBezier(
        vUv.x, 
        0.0,
        uControlPoint1,
        uControlPoint2,
        1.0
    );
    float alpha = mix(uAlphaStart, uAlphaEnd, progress);
    gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
    }
`;
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uAlphaStart: { value: 1 },
        uAlphaEnd: { value: 0.2 },
        uControlPoint1: { value: 0.2 },
        uControlPoint2: { value: 0.6 },
        uTexture: { value: texture },
    },
    transparent: true,
    side: THREE.FrontSide,
});
const mouse = { x: 0, y: 0 };
const targetOffset = { x: 0, y: 0 };
const currentOffset = { x: 0, y: 0 };

const baseX = -30;
const baseY = 45;
const sensitivity = 0.05;
const slerpFactor = 2;
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

    mesh.quaternion.slerp(targetQ, slerpFactor);
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
