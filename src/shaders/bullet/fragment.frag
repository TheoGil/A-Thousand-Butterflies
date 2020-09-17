varying vec2 vUv;
varying float vZ;
uniform float u_time;
uniform float u_beam_opacity;

void main() {
    float phase = fract((vUv.y - u_time) * 9.7489);
    float alpha = step(phase, .5) * u_beam_opacity;
    if (alpha < 0.1) { discard; }
    float green = (1. - vUv.y) * 3.;
    gl_FragColor = vec4(1., green, 0.5, alpha);
}