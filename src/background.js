import * as THREE from "three";
import { background } from "./images";
const loader = new THREE.TextureLoader();
export const texture = loader.load(background);
texture.colorSpace = THREE.SRGBColorSpace;

// Film grain + color grading shader for post-processing pass
export const FilmShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
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
        uniform float uTime;
        varying vec2 vUv;

        // Simple noise function
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);

            // Film grain effect
            float noise = random(vUv + uTime) * 0.04;
            color.rgb += noise - 0.01;

            // Desaturation (fade to vintage look)
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            color.rgb = mix(color.rgb, vec3(gray), 0.2);

            // Sepia tint
            vec3 sepia = vec3(
                dot(color.rgb, vec3(0.393, 0.769, 0.189)),
                dot(color.rgb, vec3(0.349, 0.686, 0.168)),
                dot(color.rgb, vec3(0.272, 0.534, 0.131))
            );
            color.rgb = mix(color.rgb, sepia, 0.1);

            gl_FragColor = color;
        }
    `,
};

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
            float baseAlpha = 0.02;
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

            // Semi-circular glow radiating from diamond center (right edge, upper 1/3)
            vec2 glowCenter = vec2(1.0, 0.6);
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
            lineFade *= max(0.0, 1.0 - distFromRight / 0.7);

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
    const imageAspect = texture.image
        ? texture.image.width / texture.image.height
        : 1;
    const aspect = imageAspect / canvasAspect;

    texture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    texture.repeat.x = aspect > 1 ? 1 / aspect : 1;

    texture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    texture.repeat.y = aspect > 1 ? 1 : aspect;
}
