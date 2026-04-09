"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./QuantumFlowBackground.module.css";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  force: number;
  vx: number;
  vy: number;
}

interface GradientUniforms {
  [uniform: string]: THREE.IUniform<unknown>;
  uTime: THREE.IUniform<number>;
  uResolution: THREE.IUniform<THREE.Vector2>;
  uColor1: THREE.IUniform<THREE.Vector3>;
  uColor2: THREE.IUniform<THREE.Vector3>;
  uColor3: THREE.IUniform<THREE.Vector3>;
  uColor4: THREE.IUniform<THREE.Vector3>;
  uColor5: THREE.IUniform<THREE.Vector3>;
  uColor6: THREE.IUniform<THREE.Vector3>;
  uSpeed: THREE.IUniform<number>;
  uIntensity: THREE.IUniform<number>;
  uTouchTexture: THREE.IUniform<THREE.Texture>;
  uGrainIntensity: THREE.IUniform<number>;
  uZoom: THREE.IUniform<number>;
  uDarkNavy: THREE.IUniform<THREE.Vector3>;
  uGradientSize: THREE.IUniform<number>;
  uGradientCount: THREE.IUniform<number>;
  uColor1Weight: THREE.IUniform<number>;
  uColor2Weight: THREE.IUniform<number>;
}

class TouchTexture {
  size: number;
  width: number;
  height: number;
  maxAge: number;
  radius: number;
  speed: number;
  trail: TrailPoint[];
  last: { x: number; y: number } | null;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  texture!: THREE.Texture;

  constructor() {
    this.size = 64;
    this.width = this.height = this.size;
    this.maxAge = 64;
    this.radius = 0.25 * this.size;
    this.speed = 1 / this.maxAge;
    this.trail = [];
    this.last = null;
    this.initTexture();
  }

  initTexture() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.clear();
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      if (!point) continue;
      const f = point.force * this.speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0;
    let vx = 0;
    let vy = 0;
    const last = this.last;

    if (last) {
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      if (dx === 0 && dy === 0) return;
      const d = Math.sqrt(dx * dx + dy * dy);
      vx = dx / d;
      vy = dy / d;
      force = Math.min((dx * dx + dy * dy) * 20000, 2.0);
    }

    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(point: TrailPoint) {
    const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
    let intensity = 1;

    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;

    const radius = this.radius;
    const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = this.size * 5;

    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = radius;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

class GradientBackground {
  getViewSize: () => { width: number; height: number };
  scene: THREE.Scene;
  mesh!: THREE.Mesh;
  uniforms: GradientUniforms;

  constructor(
    scene: THREE.Scene,
    getViewSize: () => { width: number; height: number },
    touchTexture: THREE.Texture,
  ) {
    this.scene = scene;
    this.getViewSize = getViewSize;
    this.uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uColor1: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
      uColor2: { value: new THREE.Vector3(0.0, 0.259, 0.22) },
      uColor3: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
      uColor4: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
      uColor5: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
      uColor6: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
      uSpeed: { value: 1.5 },
      uIntensity: { value: 1.8 },
      uTouchTexture: { value: touchTexture },
      uGrainIntensity: { value: 0.08 },
      uZoom: { value: 1.0 },
      uDarkNavy: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
      uGradientSize: { value: 0.45 },
      uGradientCount: { value: 12.0 },
      uColor1Weight: { value: 0.5 },
      uColor2Weight: { value: 1.8 },
    };
  }

  init() {
    const vs = this.getViewSize();
    const geo = new THREE.PlaneGeometry(vs.width, vs.height, 1, 1);
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2  uResolution;
        uniform vec3  uColor1, uColor2, uColor3, uColor4, uColor5, uColor6;
        uniform float uSpeed, uIntensity;
        uniform sampler2D uTouchTexture;
        uniform float uGrainIntensity;
        uniform vec3  uDarkNavy;
        uniform float uGradientSize, uGradientCount;
        uniform float uColor1Weight, uColor2Weight;
        varying vec2 vUv;

        float grain(vec2 uv, float t) {
          vec2 g = uv * uResolution * 0.5;
          return fract(sin(dot(g + t, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
        }

        vec3 getGradientColor(vec2 uv, float time) {
          float r = uGradientSize;
          vec2 c1  = vec2(0.5 + sin(time*uSpeed*0.4)*0.4,  0.5 + cos(time*uSpeed*0.5)*0.4);
          vec2 c2  = vec2(0.5 + cos(time*uSpeed*0.6)*0.5,  0.5 + sin(time*uSpeed*0.45)*0.5);
          vec2 c3  = vec2(0.5 + sin(time*uSpeed*0.35)*0.45,0.5 + cos(time*uSpeed*0.55)*0.45);
          vec2 c4  = vec2(0.5 + cos(time*uSpeed*0.5)*0.4,  0.5 + sin(time*uSpeed*0.4)*0.4);
          vec2 c5  = vec2(0.5 + sin(time*uSpeed*0.7)*0.35, 0.5 + cos(time*uSpeed*0.6)*0.35);
          vec2 c6  = vec2(0.5 + cos(time*uSpeed*0.45)*0.5, 0.5 + sin(time*uSpeed*0.65)*0.5);
          vec2 c7  = vec2(0.5 + sin(time*uSpeed*0.55)*0.38,0.5 + cos(time*uSpeed*0.48)*0.42);
          vec2 c8  = vec2(0.5 + cos(time*uSpeed*0.65)*0.36,0.5 + sin(time*uSpeed*0.52)*0.44);
          vec2 c9  = vec2(0.5 + sin(time*uSpeed*0.42)*0.41,0.5 + cos(time*uSpeed*0.58)*0.39);
          vec2 c10 = vec2(0.5 + cos(time*uSpeed*0.48)*0.37,0.5 + sin(time*uSpeed*0.62)*0.43);
          vec2 c11 = vec2(0.5 + sin(time*uSpeed*0.68)*0.33,0.5 + cos(time*uSpeed*0.44)*0.46);
          vec2 c12 = vec2(0.5 + cos(time*uSpeed*0.38)*0.39,0.5 + sin(time*uSpeed*0.56)*0.41);

          float i1  = 1.0 - smoothstep(0.0,r,length(uv-c1));
          float i2  = 1.0 - smoothstep(0.0,r,length(uv-c2));
          float i3  = 1.0 - smoothstep(0.0,r,length(uv-c3));
          float i4  = 1.0 - smoothstep(0.0,r,length(uv-c4));
          float i5  = 1.0 - smoothstep(0.0,r,length(uv-c5));
          float i6  = 1.0 - smoothstep(0.0,r,length(uv-c6));
          float i7  = 1.0 - smoothstep(0.0,r,length(uv-c7));
          float i8  = 1.0 - smoothstep(0.0,r,length(uv-c8));
          float i9  = 1.0 - smoothstep(0.0,r,length(uv-c9));
          float i10 = 1.0 - smoothstep(0.0,r,length(uv-c10));
          float i11 = 1.0 - smoothstep(0.0,r,length(uv-c11));
          float i12 = 1.0 - smoothstep(0.0,r,length(uv-c12));

          vec2 ru1 = uv - 0.5;
          float a1 = time*uSpeed*0.15;
          ru1 = vec2(ru1.x*cos(a1)-ru1.y*sin(a1), ru1.x*sin(a1)+ru1.y*cos(a1)) + 0.5;
          vec2 ru2 = uv - 0.5;
          float a2 = -time*uSpeed*0.12;
          ru2 = vec2(ru2.x*cos(a2)-ru2.y*sin(a2), ru2.x*sin(a2)+ru2.y*cos(a2)) + 0.5;

          float ri1 = 1.0 - smoothstep(0.0,0.8,length(ru1-0.5));
          float ri2 = 1.0 - smoothstep(0.0,0.8,length(ru2-0.5));

          vec3 color = vec3(0.0);
          color += uColor1*(0.55+0.45*sin(time*uSpeed    ))*i1 *uColor1Weight;
          color += uColor2*(0.55+0.45*cos(time*uSpeed*1.2))*i2 *uColor2Weight;
          color += uColor3*(0.55+0.45*sin(time*uSpeed*0.8))*i3 *uColor1Weight;
          color += uColor4*(0.55+0.45*cos(time*uSpeed*1.3))*i4 *uColor2Weight;
          color += uColor5*(0.55+0.45*sin(time*uSpeed*1.1))*i5 *uColor1Weight;
          color += uColor6*(0.55+0.45*cos(time*uSpeed*0.9))*i6 *uColor2Weight;

          if (uGradientCount > 6.0) {
            color += uColor1*(0.55+0.45*sin(time*uSpeed*1.4))*i7 *uColor1Weight;
            color += uColor2*(0.55+0.45*cos(time*uSpeed*1.5))*i8 *uColor2Weight;
            color += uColor3*(0.55+0.45*sin(time*uSpeed*1.6))*i9 *uColor1Weight;
            color += uColor4*(0.55+0.45*cos(time*uSpeed*1.7))*i10*uColor2Weight;
          }
          if (uGradientCount > 10.0) {
            color += uColor5*(0.55+0.45*sin(time*uSpeed*1.8))*i11*uColor1Weight;
            color += uColor6*(0.55+0.45*cos(time*uSpeed*1.9))*i12*uColor2Weight;
          }

          color += mix(uColor1,uColor3,ri1)*0.45*uColor1Weight;
          color += mix(uColor2,uColor4,ri2)*0.40*uColor2Weight;

          color  = clamp(color, 0.0, 1.0) * uIntensity;
          float lum = dot(color, vec3(0.299,0.587,0.114));
          color  = mix(vec3(lum), color, 1.35);
          color  = pow(color, vec3(0.92));
          float b1 = length(color);
          color  = mix(uDarkNavy, color, max(b1*1.2, 0.15));
          float bMax = 1.0, bLen = length(color);
          if (bLen > bMax) color *= bMax/bLen;
          return color;
        }

        void main() {
          vec2 uv = vUv;
          vec4 tt = texture2D(uTouchTexture, uv);
          float vx = -(tt.r*2.0-1.0), vy = -(tt.g*2.0-1.0), inten = tt.b;
          uv.x += vx*0.8*inten;
          uv.y += vy*0.8*inten;
          float dist = length(uv - 0.5);
          uv += vec2(sin(dist*20.0 - uTime*3.0)*0.04*inten + sin(dist*15.0 - uTime*2.0)*0.03*inten);

          vec3 color = getGradientColor(uv, uTime);
          color += grain(uv, uTime) * uGrainIntensity;
          float ts = uTime*0.5;
          color.r += sin(ts)*0.02;
          color.g += cos(ts*1.4)*0.02;
          color.b += sin(ts*1.2)*0.02;
          float b2 = length(color);
          color = mix(uDarkNavy, color, max(b2*1.2, 0.15));
          color = clamp(color, 0.0, 1.0);
          float bLen = length(color);
          if (bLen > 1.0) color *= 1.0/bLen;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.mesh);
  }

  update(delta: number) {
    this.uniforms.uTime.value += delta;
  }

  onResize(w: number, h: number) {
    const vs = this.getViewSize();
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.geometry = new THREE.PlaneGeometry(vs.width, vs.height, 1, 1);
    }
    this.uniforms.uResolution.value.set(w, h);
  }
}

export default function QuantumFlowBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let reqId: number;
    const clock = new THREE.Clock();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      stencil: false,
      depth: false,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Mount canvas
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000,
    );
    camera.position.z = 50;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);

    const touchTexture = new TouchTexture();

    const getViewSize = () => {
      const h = Math.abs(
        camera.position.z * Math.tan((camera.fov * Math.PI) / 180 / 2) * 2,
      );
      return { width: h * camera.aspect, height: h };
    };

    const bg = new GradientBackground(scene, getViewSize, touchTexture.texture);

    // Initialise Quantum scheme constants
    const u = bg.uniforms;
    u.uColor1.value.set(0.945, 0.353, 0.133);
    u.uColor2.value.set(0.0, 0.259, 0.22);
    u.uColor3.value.set(0.945, 0.353, 0.133);
    u.uColor4.value.set(0.0, 0.0, 0.0);
    u.uColor5.value.set(0.945, 0.353, 0.133);
    u.uColor6.value.set(0.0, 0.0, 0.0);
    u.uDarkNavy.value.set(0.039, 0.055, 0.153);
    u.uGradientSize.value = 0.45;
    u.uGradientCount.value = 12.0;
    u.uSpeed.value = 1.5;
    u.uColor1Weight.value = 0.5;
    u.uColor2Weight.value = 1.8;

    bg.init();

    const handleResize = () => {
      if (!camera || !renderer || !bg) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      bg.onResize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0,
        clientY = 0;

      if (e instanceof TouchEvent) {
        clientX = e.touches[0]?.clientX || 0;
        clientY = e.touches[0]?.clientY || 0;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      touchTexture.addTouch({
        x: clientX / window.innerWidth,
        y: 1 - clientY / window.innerHeight,
      });

      if (cursorRef.current && e instanceof MouseEvent) {
        cursorRef.current.style.left = `${clientX}px`;
        cursorRef.current.style.top = `${clientY}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);

    const tick = () => {
      reqId = requestAnimationFrame(tick);
      const delta = Math.min(clock.getDelta(), 0.1);
      touchTexture.update();
      bg.update(delta);
      renderer.render(scene, camera);
    };

    tick();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);

      // Cleanup three
      if (renderer.domElement && container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      touchTexture.texture.dispose();
      bg.mesh.geometry.dispose();
      (bg.mesh.material as THREE.Material).dispose();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className={styles.webGLApp} />
      <div ref={cursorRef} className={styles.customCursor} />
    </>
  );
}
