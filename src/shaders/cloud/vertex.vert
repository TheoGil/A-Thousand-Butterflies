varying vec2 vUv;
varying float vAlpha;
varying float vScale;
varying float vChannel;
attribute vec3 translate;
attribute float scale;
attribute float channel;
attribute float u_fog_near;
attribute float u_fog_far;
uniform float u_time;
uniform float u_time_scale;
uniform float u_max_depth;
uniform sampler2D u_texture;

void main() {
    vUv = uv;
    vScale = scale;
    vChannel = channel;

    vec3 newPosition = position + translate;
    newPosition.z = mod(newPosition.z + u_time, u_max_depth);

    // Fade in cloud that are coming from afar
    vAlpha = smoothstep(-1000., -500., newPosition.z);
    
    // Fade out clouds that are coming to close to the camera
    vAlpha = vAlpha * smoothstep(0., -100., newPosition.z);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}