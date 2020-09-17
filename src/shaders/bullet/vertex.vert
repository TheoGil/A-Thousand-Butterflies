varying vec2 vUv;
varying float vZ;

void main() {
    vUv = uv;
    vZ = position.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}