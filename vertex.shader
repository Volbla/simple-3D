precision mediump float;

uniform vec3 Camera;
uniform mat3 Rotation;
uniform vec2 Scale;

attribute vec3 position;
varying vec3 vColor;

void main() {
  vColor = vec3( position.xyz / 255. );

  vec3 p = Rotation * (position - vec3(141.0625, 124.1875, 114.875) - Camera);
  p.xz *= Scale;
  float newy = p.y * p.y / (p.y + 1.0);
  gl_Position = vec4(p.x, p.z, newy, p.y);
  gl_PointSize = 10.0;
}
