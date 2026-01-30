import "./style.css";
import * as panel from "./panel/panel";
import { camera } from "./camera";
import * as background from "./background";
import * as THREE from "three";
import {
    EffectComposer,
    OutputPass,
    RenderPass,
    ShaderPass,
    SMAAPass,
} from "three/examples/jsm/Addons.js";
var clock = new THREE.Clock();
var FPS = 60;
var renderT = 1 / FPS;
var timeS = 0;
const canvas = document.querySelector("#main-canvas");
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(() => {
    var T = clock.getDelta();
    timeS = timeS + T;
    if (timeS > renderT) {
        resize(window.innerWidth, window.innerHeight);
        filmPass.uniforms["uTime"].value = clock.getElapsedTime();
        panel.update();
        composer.render(T);
        timeS = 0;
    }
});
const scene = new THREE.Scene();
scene.background = background.texture;
scene.add(panel.mesh, camera);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
// Film grain pass (vintage effect)
var filmPass = new ShaderPass(background.FilmShader);
composer.addPass(filmPass);
// Vignette pass (darkens edges)
var vignettePass = new ShaderPass(background.VignetteShader);
vignettePass.uniforms["uVignetteStrength"].value = 0.006; // 暗角强度（0=无效果，1=全黑）
vignettePass.uniforms["uVignetteRadius"].value = 0.02; // 暗部开始位置（0=全屏，1=无效果）
composer.addPass(vignettePass);
// Glow pass at right edge
var glowPass = new ShaderPass(background.GlowShader);
glowPass.uniforms["uAspect"].value = window.innerWidth / window.innerHeight;
composer.addPass(glowPass);
composer.addPass(new SMAAPass());
composer.addPass(new OutputPass());

document.addEventListener("mousemove", panel.onMouseMove);
function resize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
    background.resize(width, height);
    panel.resize(width, height);
    vignettePass.uniforms["uVignetteStrength"].value = 0.001;
    vignettePass.uniforms["uVignetteRadius"].value = 0.02;
    glowPass.uniforms["uAspect"].value = width / height;
}
