import "./style.css";
import * as panel from "./panel/panel";
import { camera } from "./camera";
import * as background from "./background";
import * as THREE from "three";
import {
    EffectComposer,
    FocusShader,
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
    glowPass.uniforms["uAspect"].value = width / height;
}
