import * as THREE from "three";
import { background } from "./images";

const backgroundAlpha = 0.5;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = background;
img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = backgroundAlpha;
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = 1;
    texture.needsUpdate = true;
};

export const texture = new THREE.CanvasTexture(canvas);
texture.colorSpace = THREE.SRGBColorSpace;

// Vignette shader for post-processing pass
export const VignetteShader = {
    uniforms: {
        tDiffuse: { value: null },
        uVignetteStrength: { value: 0.6 },
        uVignetteRadius: { value: 0.0 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uVignetteStrength;
        uniform float uVignetteRadius;
        varying vec2 vUv;

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);

            // Horizontal gradient: left side transparent, right side black overlay
            // uVignetteRadius controls where black starts (0.0 = full screen, 1.0 = no effect)
            float alpha = smoothstep(uVignetteRadius, 1.0, vUv.x);
            // Base transparency at left edge (0.0 = fully black, 1.0 = fully transparent)
            float baseAlpha = 0.1;
            color.rgb = mix(vec3(0.0), color.rgb, alpha * (1.0 - baseAlpha) + baseAlpha);

            gl_FragColor = color;
        }
    `,
};

// Glow shader for post-processing pass
export const GlowShader = {
    uniforms: {
        tDiffuse: { value: null },
        uAspect: { value: 1.0 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uAspect;
        varying vec2 vUv;

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);

            vec2 glowCenter = vec2(1.0, 0.7);
            vec2 toPixel = vUv - glowCenter;

            // Correct for aspect ratio to keep circle shape
            toPixel.x *= uAspect;

            float pixelDist = length(toPixel);

            // Right half: only pixels to the right of center
            float rightHalf = step(toPixel.x / uAspect, 0.0);

            // Diamond core - bright white at center (extends leftward)
            vec2 d = abs(vUv - glowCenter);
            float diamondDist = d.x + d.y * 0.7;
            float diamondMax = 0.9;
            float diamondFade = 1.0 - sqrt(clamp(diamondDist / diamondMax, 0.0, 1.0));

            // Horizontal line extending leftward from center
            // Line narrows gradually, fades linearly, disappears at left 70%
            float distFromRight = 1.0 - vUv.x;
            float lineWidth = 0.01 * (1.0 - distFromRight * 0.9);
            float lineY = abs(vUv.y - glowCenter.y);
            // Linear fade instead of smoothstep
            float lineFade = clamp(1.0 - lineY / lineWidth, 0.0, 1.0);
            lineFade *= max(0.0, 1.0 - distFromRight / 0.6);

            // Diamond glow stronger (boosted intensity)
            float circleMax = 0.01;
            float circleFade = 1.0 - sqrt(clamp(pixelDist / circleMax, 0.0, 1.0));
            circleFade *= rightHalf;

            // Circle glow on right half
            circleFade *= 0.4;

            // Diamond glow stronger (boosted intensity)
            diamondFade = diamondFade * diamondFade * 1.5;
            float finalFade = max(circleFade, diamondFade);

            vec3 white = vec3(1.0, 1.0, 1.0);
            vec3 yellow = vec3(1.0, 0.8, 0.3);
            vec3 warmYellow = vec3(1.0, 0.85, 0.5);

            // Horizontal line color: white at center, warm yellow at left
            vec3 lineColor = mix(warmYellow, white, distFromRight);
            color.rgb += lineColor * lineFade;

            // Color: white at center, yellow at edges
            vec3 glowColor = mix(warmYellow, white, finalFade * finalFade);
            color.rgb += glowColor * finalFade;

            gl_FragColor = color;
        }
    `,
};

export function resize(width, height) {
    const canvasAspect = width / height;
    const imageAspect = img.width / img.height;

    if (canvasAspect > imageAspect) {
        canvas.width = height * imageAspect;
        canvas.height = height;
    } else {
        canvas.width = width;
        canvas.height = width / imageAspect;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = backgroundAlpha;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    texture.needsUpdate = true;
}
