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
import { wallpaper } from "./config";
const Fps = 60;
var clock = new THREE.Clock();
var renderT = 1 / Fps;
var timeS = 0;
const canvas = document.querySelector("#main-canvas");
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);
function animate() {
    requestAnimationFrame(animate);
    var T = clock.getDelta();
    timeS += T;
    if (timeS > renderT) {
        panel.update();
        composer.render(T);
        timeS = timeS % renderT;
    }
}
const scene = new THREE.Scene();
scene.background = background.texture;
scene.add(panel.mesh, camera);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
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
window.onload = () => {
    resize(window.innerWidth, window.innerHeight);
    panel.init();
    panel.setFps(Fps);
    requestAnimationFrame(animate);
};
if (wallpaper) {
    window.wallpaperRegisterAudioListener(panel.wallpaperEngine.audioListener);
    window.wallpaperRegisterMediaPlaybackListener(
        panel.wallpaperEngine.mediaPlaybackListener,
    );
    window.wallpaperRegisterMediaTimelineListener(
        panel.wallpaperEngine.mediaTimelineListener,
    );
    window.wallpaperRegisterMediaStatusListener(
        panel.wallpaperEngine.mediaStatusListener,
    );
    window.wallpaperPropertyListener = {
        applyGeneralProperties: function (properties) {
            if (properties.fps) {
                renderT = 1 / properties.fps;
                panel.setFps(properties.fps);
            }
        },
    };
}
