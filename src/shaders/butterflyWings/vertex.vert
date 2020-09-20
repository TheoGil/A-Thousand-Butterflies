uniform float u_origin_x;
// uniform float u_rotation_y;
uniform float u_min_y_angle;
uniform float u_max_y_angle;
uniform float u_speed;
uniform float u_time;
varying mat4 vPosition;
varying vec2 vUv;

// Map a value between one range to another
// https://github.com/msfeldstein/glsl-map
float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
    vUv = uv;
    float time = u_time * u_speed * 0.25;

    // Matrix transformations are adapted from 
    // https://gist.github.com/Samsy/63b6b723892e93685a6b522b50595fc7 🤘
    
    // Update rotation origin
    vPosition = mat4(
        vec4(1.0,0.0,0.0,0.0),
        vec4(0.0,1.0,0.0,0.0),
        vec4(0.0,0.0,1.0,0.0),
        vec4(u_origin_x,0.0,0.0,1.0)
    );

    // Compute rotation based on time and the minimum and maximum angle values
    float rotationY = map(
        sin(time),
        -1., 
        1.,
        u_min_y_angle,
        u_max_y_angle
    );

    // Rotate
    vPosition = vPosition * mat4(
        vec4(cos(rotationY), 0.0, sin(rotationY), 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(-sin(rotationY), 0.0, cos(rotationY), 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );

    // Counter balance translation
    vPosition = vPosition * mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(-u_origin_x, 0.0, 0.0, 1.0)
    );
      
    gl_Position = projectionMatrix * modelViewMatrix * vPosition * vec4(position,1.0);
}