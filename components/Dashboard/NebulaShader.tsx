"use client";

import React, { useEffect, useRef } from "react";

export default function NebulaShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth || 1280;
      const h = canvas.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(syncSize)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                       -0.577350269189626,
                        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
        total += snoise(p * freq) * amp;
        freq *= 2.05;
        amp *= 0.48;
    }
    return total;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;
    
    vec2 mouse = (u_mouse.xy / u_resolution.xy - 0.5) * aspect;
    float mouseDist = length(p - mouse);
    float mouseGlow = smoothstep(0.6, 0.0, mouseDist) * 0.15;

    float t = u_time * 0.12;

    vec2 q = vec2(fbm(p + vec2(0.0, t * 0.4)), fbm(p + vec2(5.2, 1.3 - t * 0.3)));
    vec2 r = vec2(fbm(p + 3.5 * q + vec2(1.7 - t * 0.2, 9.2)), fbm(p + 3.5 * q + vec2(8.3, 2.8 + t * 0.3)));
    float f = fbm(p + 3.0 * r);

    vec3 bgBase = vec3(0.027, 0.024, 0.051);
    vec3 purple = vec3(0.545, 0.361, 0.965);
    vec3 deepIndigo = vec3(0.298, 0.114, 0.584);
    vec3 cyan = vec3(0.024, 0.714, 0.831);

    float dist = length(p);
    float vignette = smoothstep(1.2, 0.2, dist);

    vec3 color = bgBase;
    
    float n1 = smoothstep(-0.2, 0.8, f) * 0.65;
    color = mix(color, deepIndigo, n1 * 0.7);
    color = mix(color, purple, pow(clamp(f * 0.5 + 0.5, 0.0, 1.0), 2.2) * 0.55);
    
    float n2 = smoothstep(0.1, 0.9, length(r)) * 0.35;
    color = mix(color, cyan, n2 * (0.25 + mouseGlow));

    float stars = pow(abs(snoise(p * 25.0 + vec2(t * 0.05, 0.0))), 16.0) * 0.35;
    color += vec3(stars * 0.6, stars * 0.7, stars);

    vec2 p1 = p - vec2(-0.4 * aspect.x, 0.25);
    float glow1 = smoothstep(0.7, 0.0, length(p1)) * 0.22;
    color += purple * glow1;

    vec2 p2 = p - vec2(0.4 * aspect.x, -0.2);
    float glow2 = smoothstep(0.65, 0.0, length(p2)) * 0.18;
    color += cyan * glow2;

    color = mix(bgBase, color, clamp(vignette * 1.1, 0.0, 0.9));

    gl_FragColor = vec4(color, 1.0);
}`;

    function compileShader(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vShader = compileShader(gl.VERTEX_SHADER, vs);
    const fShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vShader || !fShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    function render(t: number) {
      if (!canvas || !gl) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* WebGL Animated Shader Canvas */}
      <canvas
        ref={canvasRef}
        id="nebula-shader-canvas"
        className="block w-full h-full object-cover"
      />
      {/* Architectural Grid Lattice mesh */}
      <div className="absolute inset-0 bg-grid-lattice opacity-45 mix-blend-screen pointer-events-none"></div>
      {/* Delicate radial vignette overlay to ensure pristine typography legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,6,14,0.75)_75%,#07060e_100%)] pointer-events-none"></div>
    </div>
  );
}
