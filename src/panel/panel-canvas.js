import * as THREE from "three";
import { Leafer } from "leafer-ui";
import {
    elements,
    setSpectrumLevelBars,
    setPeakprogramMeterLevelBar,
    setPlayStatus,
    setProgressBar,
} from "./elements";
import { debug } from "../config";
let WIDTH, HEIGHT;
var canvasEl = document.createElement("canvas");
const leafer = new Leafer({
    view: canvasEl,
    width: 1300,
    height: 800,
    hittable: false,
    hitChildren: false,
    fill: "#FFF0",
});
export function init() {
    leafer.add(elements);
}
export function setFps(fps) {
    leafer.config.maxFPS = fps;
}
export function resizeCanvas(width, height) {
    WIDTH = width;
    HEIGHT = Math.floor((WIDTH * 8) / 13);
}

const texture = new THREE.CanvasTexture(canvasEl);
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.anisotropy = 4;
texture.colorSpace = THREE.SRGBColorSpace;

export { texture };

export function updateTexture() {
    texture.needsUpdate = true;
}
export function clear() {
    for (var i = 0; i < 15; i++) {
        setSpectrumLevelBars(i, 0);
    }
    setPeakprogramMeterLevelBar("L", 0);
    setPeakprogramMeterLevelBar("R", 0);
}
export const wallpaperEngine = {
    audioListener: (audioArray) => {
        var energys = Array.from({ length: 15 }, (_, k) => {
            const leftEnergy = Math.min(
                audioArray[Math.floor(((k + 1) / 15) * 64) - 1],
                1,
            );
            const rightEnery = Math.min(
                audioArray[Math.floor(((k + 1) / 15) * 64) - 1 + 64],
                1,
            );
            const averageEnergy = (leftEnergy + rightEnery) / 2;
            return Math.round(averageEnergy * 22);
        });
        var magnitudeLeft = Math.round(
            (audioArray.slice(0, 64).reduce((sum, value) => {
                return sum + value;
            }, 0) /
                64) *
                116,
        );
        var magnitudeRight = Math.round(
            (audioArray.slice(64, 128).reduce((sum, value) => {
                return sum + value;
            }, 0) /
                64) *
                116,
        );
        for (var i = 0; i < 15; i++) {
            setSpectrumLevelBars(i, energys[i]);
        }
        setPeakprogramMeterLevelBar("L", magnitudeLeft);
        setPeakprogramMeterLevelBar("R", magnitudeRight);
    },
    mediaPlaybackListener: (event) => {
        if (event.status == window.wallpaperMediaIntegration.PLAYBACK_PLAYING) {
            setPlayStatus(true);
        } else if (
            event.status == window.wallpaperMediaIntegration.PLAYBACK_PAUSED ||
            event.status == window.wallpaperMediaIntegration.PLAYBACK_STOPPED
        ) {
            setPlayStatus(false);
        }
    },
    mediaTimelineListener: (event) => {
        setProgressBar(Math.ceil((event.position / event.duration) * 3));
    },
    mediaStatusListener: (event) => {
        if (!event.enabled) {
            setPlayStatus(true);
        }
    },
};
