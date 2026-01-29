import * as THREE from "three";

const loader = new THREE.TextureLoader();
export const texture = loader.load("/background.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

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
            vec2 center = vec2(1.0, 0.6);
            vec2 toPixel = vUv - center;

            // Correct for aspect ratio to keep circle shape
            toPixel.x *= uAspect;

            float dist = length(toPixel);

            // Right half: only pixels to the right of center
            float rightHalf = step(toPixel.x / uAspect, 0.0);

            // Diamond core - bright white at center (extends leftward)
            vec2 d = abs(vUv - center);
            float diamondDist = d.x + d.y * 0.7;
            float diamondMax = 0.9  ;
            float diamondFade = 1.0 - sqrt(clamp(diamondDist / diamondMax, 0.0, 1.0));

            // Horizontal line extending leftward from center
            // Line narrows gradually, fades linearly, disappears at left 70%
            float distFromRight = 1.0 - vUv.x;
            float lineWidth = 0.01 * (1.0 - distFromRight * 0.9);  // Linearly narrower from right to left
            float lineY = abs(vUv.y - center.y);
            float lineFade = smoothstep(lineWidth, 0.0, lineY);  // Line width
            lineFade *= max(0.0, 1.0 - distFromRight / 0.7);  // Linear fade to 0 at left 70%
            // lineFade *= smoothstep(0.75, 0.7, distFromRight);  // Removed - now fades linearly to 0

            // Diamond glow stronger (boosted intensity)
            float circleMax = 0.01;
            float circleFade = 1.0 - sqrt(clamp(dist / circleMax, 0.0, 1.0));
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
