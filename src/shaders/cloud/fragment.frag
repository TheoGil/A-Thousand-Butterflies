varying float vAlpha;
varying float vScale;
varying float vChannel;
varying vec2 vUv;
uniform sampler2D u_texture;

void main() {
  vec2 scaledUv = vUv / vScale;
  vec4 texture = texture2D(u_texture, scaledUv);
  float finalAlpha = vAlpha * texture[int(vChannel)];
  gl_FragColor = vec4(
    1.,
    1.,
    1.,
    finalAlpha
  );
}