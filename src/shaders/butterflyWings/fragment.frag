uniform sampler2D u_texture;
uniform float u_texture_channel;
uniform bool u_flip_x;
varying vec2 vUv;

void main() {
    vec2 flippedUv = vUv;
    if (u_flip_x) {
        flippedUv.x = 1. - vUv.x;
    }
    
    vec4 texture = texture2D(u_texture, flippedUv);
    
    float alpha = step(0.1, texture[int(u_texture_channel)]);
    
    vec3 color1 = vec3(1., 0., 0.);
    vec3 color2 = vec3(0., 1., 0.);
    vec3 color3 = vec3(0., 0., 1.);

    vec3 finalColor = vec3(1., 1., 1.);
    
    if (texture[int(u_texture_channel)] > 0.39 && texture[int(u_texture_channel)] < 0.41) {
        finalColor = color1;
    }

    if (texture[int(u_texture_channel)] > 0.59 && texture[int(u_texture_channel)] < 0.61) {
        finalColor = color2;
    }

    if (texture[int(u_texture_channel)] > 0.79 && texture[int(u_texture_channel)] < 0.81) {
        finalColor = color3;
    }
    
    
    gl_FragColor = vec4(
        finalColor,
        alpha
    );
}
