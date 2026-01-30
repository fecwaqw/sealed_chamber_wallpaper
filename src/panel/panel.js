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
    uniform float uGlowIntensity;
    uniform vec3 uGlowColor;
    uniform vec3 uTargetColor;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    // Linear gradient from left to right
    float alpha = mix(uAlphaStart, uAlphaEnd, vUv.x);

    // Check if color matches target (#fbba7a)
    // Texture is SRGBColorSpace, so texColor.rgb is in linear space
    // Convert target color from sRGB to linear for comparison
    vec3 targetLinear = pow(uTargetColor, vec3(2.2));
    float colorDist = distance(texColor.rgb, targetLinear);
    float colorMatch = 1.0 - smoothstep(0.0, 0.15, colorDist);

    // Glow effect: stronger for matching colors
    float glowStrength = (1.0 - alpha) * uGlowIntensity;
    glowStrength *= (1.0 + colorMatch * 1.0); // Extra glow for matching colors

    vec3 glow = uGlowColor * glowStrength;
    vec3 finalColor = texColor.rgb + glow;

    gl_FragColor = vec4(finalColor, texColor.a * alpha);
    }
`;
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uAlphaStart: { value: 1 },
        uAlphaEnd: { value: 0.3 },
        uTexture: { value: texture },
        uGlowIntensity: { value: 1 },
        uGlowColor: { value: new THREE.Color(1.0, 0.85, 0.6) },
        uTargetColor: { value: new THREE.Color(0.984, 0.729, 0.478) }, // #fbba7a
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
