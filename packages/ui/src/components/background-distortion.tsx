"use client";

import React, { useEffect, useRef } from "react";

export interface BackgroundDistortionProps {
  /** Additional CSS class names for the canvas */
  className?: string;
  /** Size of each grid cell in pixels (default: 36) */
  gridSize?: number;
  /** Radius of the subtle lens effect in pixels (default: 160) */
  distortionRadius?: number;
  /** Maximum pixel displacement for the distortion (default: 3.5) */
  maxDisplacement?: number;
  /** Z-index of the background canvas (default: 0) */
  zIndex?: number;
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform float u_dpr;
uniform float u_scroll;
uniform float u_grid_size;
uniform float u_radius;
uniform float u_max_disp;

float getGrid(vec2 coord, float gSize, float lWidth) {
  vec2 f = mod(coord, gSize);
  vec2 d = min(f, gSize - f);
  float dist = min(d.x, d.y);
  return 1.0 - smoothstep(0.0, lWidth * 1.3, dist);
}

void main() {
  vec2 screenPixel = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
  vec2 worldPixel = vec2(screenPixel.x, screenPixel.y + u_scroll);

  vec2 toMouse = screenPixel - u_mouse;
  float dist = length(toMouse);
  float rad = u_radius * u_dpr;

  // Gentle, subtle lens distortion (max ~8px, smooth bell curve)
  vec2 displacement = vec2(0.0);
  float proximity = 0.0;

  if (dist < rad && u_intensity > 0.005) {
    float norm = dist / rad;
    // Bell curve: zero at center, peak midway, zero at edge
    float curve = sin(norm * 3.14159265) * (1.0 - norm);
    vec2 dir = dist > 0.001 ? toMouse / dist : vec2(0.0);
    displacement = dir * curve * (u_max_disp * u_dpr) * u_intensity;
    proximity = (1.0 - norm) * u_intensity;
  }

  float gSize = u_grid_size * u_dpr;
  float lWidth = 1.0 * u_dpr;

  // Distorted grid line
  vec2 sampleCoord = worldPixel + displacement;
  float line = getGrid(sampleCoord, gSize, lWidth);

  // Subtle clean colors
  // Base line: soft dark silver (matches subtle dark theme)
  vec3 baseLineCol = vec3(0.024);
  // Highlight line under mouse: soft Harmonia Lime (#d9f27a)
  vec3 limeCol = vec3(0.851, 0.949, 0.478);

  vec3 lineColor = mix(baseLineCol, limeCol, proximity * 0.2);

  // Soft ambient spotlight following the cursor (very discreet)
  float spot = 0.0;
  if (dist < rad * 1.2 && u_intensity > 0.005) {
    spot = exp(-dist * (0.0075 / u_dpr)) * u_intensity * 0.035;
  }
  vec3 spotColor = vec3(0.133, 0.773, 0.369) * spot; // soft emerald tint

  vec3 finalColor = line * lineColor + spotColor;
  float alpha = max(line * mix(0.28, 0.55, proximity), spot * 0.5);

  gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.7));
}
`;

export function BackgroundDistortion({
  className = "",
  gridSize = 36,
  distortionRadius = 160,
  maxDisplacement = 3.5,
  zIndex = 0,
}: BackgroundDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Start with mouse OFF screen and zero intensity (no initial frozen blob)
    const targetMouse = { x: -9999, y: -9999 };
    const currentMouse = { x: -9999, y: -9999 };
    let intensity = 0.0;
    let isMouseOnScreen = false;
    let scrollY = window.scrollY;

    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;
    let aPositionLoc = -1;
    let isWebGL = false;

    try {
      gl =
        (canvas.getContext("webgl2", {
          alpha: true,
          depth: false,
          stencil: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
        }) as WebGLRenderingContext | null) ||
        canvas.getContext("webgl", {
          alpha: true,
          depth: false,
          stencil: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
        }) ||
        (canvas.getContext(
          "experimental-webgl"
        ) as WebGLRenderingContext | null);

      if (gl) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const vs = gl.createShader(gl.VERTEX_SHADER);
        if (vs) {
          gl.shaderSource(vs, VERTEX_SHADER_SOURCE);
          gl.compileShader(vs);
        }

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        if (fs) {
          gl.shaderSource(fs, FRAGMENT_SHADER_SOURCE);
          gl.compileShader(fs);
        }

        if (vs && fs) {
          program = gl.createProgram();
          if (program) {
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);

            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
              isWebGL = true;
              gl.useProgram(program);

              const positions = new Float32Array([
                -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
                1.0,
              ]);
              positionBuffer = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
              gl.bufferData(
                gl.ARRAY_BUFFER,
                positions,
                gl.STATIC_DRAW
              );

              aPositionLoc = gl.getAttribLocation(program, "a_position");
              gl.enableVertexAttribArray(aPositionLoc);
              gl.vertexAttribPointer(
                aPositionLoc,
                2,
                gl.FLOAT,
                false,
                0,
                0
              );
            }
          }
        }
      }
    } catch {
      isWebGL = false;
    }

    const ctx2d = !isWebGL ? canvas.getContext("2d") : null;

    let uResolutionLoc: WebGLUniformLocation | null = null;
    let uMouseLoc: WebGLUniformLocation | null = null;
    let uIntensityLoc: WebGLUniformLocation | null = null;
    let uDprLoc: WebGLUniformLocation | null = null;
    let uScrollLoc: WebGLUniformLocation | null = null;
    let uGridSizeLoc: WebGLUniformLocation | null = null;
    let uRadiusLoc: WebGLUniformLocation | null = null;
    let uMaxDispLoc: WebGLUniformLocation | null = null;

    if (isWebGL && gl && program) {
      uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
      uMouseLoc = gl.getUniformLocation(program, "u_mouse");
      uIntensityLoc = gl.getUniformLocation(program, "u_intensity");
      uDprLoc = gl.getUniformLocation(program, "u_dpr");
      uScrollLoc = gl.getUniformLocation(program, "u_scroll");
      uGridSizeLoc = gl.getUniformLocation(program, "u_grid_size");
      uRadiusLoc = gl.getUniformLocation(program, "u_radius");
      uMaxDispLoc = gl.getUniformLocation(program, "u_max_disp");
    }

    let dpr = 1;
    function handleResize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (isWebGL && gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    function handlePointerMove(e: PointerEvent) {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      isMouseOnScreen = true;

      // On first entrance, jump directly to cursor position
      if (currentMouse.x < -1000) {
        currentMouse.x = e.clientX;
        currentMouse.y = e.clientY;
      }
    }

    function handlePointerLeave() {
      isMouseOnScreen = false;
    }

    function handleScroll() {
      scrollY = window.scrollY;
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });
    window.addEventListener("scroll", handleScroll, { passive: true });

    let animationFrameId: number;
    let isVisible = !document.hidden;

    function handleVisibilityChange() {
      isVisible = !document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    function render() {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse follow
      if (isMouseOnScreen) {
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.09;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.09;
        intensity += (1.0 - intensity) * 0.06;
      } else {
        intensity += (0.0 - intensity) * 0.04;
      }

      const activeIntensity = prefersReducedMotion ? 0 : intensity;

      if (isWebGL && gl && program) {
        gl.viewport(0, 0, canvas!.width, canvas!.height);
        gl.useProgram(program);

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform2f(uResolutionLoc, canvas!.width, canvas!.height);
        gl.uniform2f(
          uMouseLoc,
          currentMouse.x * dpr,
          currentMouse.y * dpr
        );
        gl.uniform1f(uIntensityLoc, activeIntensity);
        gl.uniform1f(uDprLoc, dpr);
        gl.uniform1f(uScrollLoc, scrollY * dpr);
        gl.uniform1f(uGridSizeLoc, gridSize);
        gl.uniform1f(uRadiusLoc, distortionRadius);
        gl.uniform1f(uMaxDispLoc, maxDisplacement);

        if (positionBuffer && aPositionLoc >= 0) {
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(aPositionLoc);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d && canvas) {
        // Fallback 2D: subtle clean grid with gentle displacement
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        const gSize = gridSize * dpr;
        const rad = distortionRadius * dpr;
        const mouseX = currentMouse.x * dpr;
        const mouseY = currentMouse.y * dpr;
        const scroll = (scrollY * dpr) % gSize;

        // Discreet spotlight
        if (activeIntensity > 0.02) {
          const grad = ctx2d.createRadialGradient(
            mouseX,
            mouseY,
            0,
            mouseX,
            mouseY,
            rad
          );
          grad.addColorStop(0, "rgba(217, 242, 122, 0.035)");
          grad.addColorStop(0.5, "rgba(34, 197, 94, 0.01)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx2d.fillStyle = grad;
          ctx2d.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx2d.lineWidth = 1 * dpr;
        ctx2d.strokeStyle = "rgba(255, 255, 255, 0.025)";

        // Vertical lines
        for (let x = 0; x <= canvas.width; x += gSize) {
          ctx2d.beginPath();
          for (let y = 0; y <= canvas.height; y += 30) {
            let px = x;
            let py = y;
            if (activeIntensity > 0.01) {
              const dx = px - mouseX;
              const dy = py - mouseY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < rad && dist > 0.1) {
                const curve = Math.sin((dist / rad) * Math.PI) * (1 - dist / rad);
                const force = curve * maxDisplacement * dpr * activeIntensity;
                px += (dx / dist) * force;
                py += (dy / dist) * force;
              }
            }
            if (y === 0) ctx2d.moveTo(px, py);
            else ctx2d.lineTo(px, py);
          }
          ctx2d.stroke();
        }

        // Horizontal lines
        for (let y = -scroll; y <= canvas.height; y += gSize) {
          ctx2d.beginPath();
          for (let x = 0; x <= canvas.width; x += 30) {
            let px = x;
            let py = y;
            if (activeIntensity > 0.01) {
              const dx = px - mouseX;
              const dy = py - mouseY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < rad && dist > 0.1) {
                const curve = Math.sin((dist / rad) * Math.PI) * (1 - dist / rad);
                const force = curve * maxDisplacement * dpr * activeIntensity;
                px += (dx / dist) * force;
                py += (dy / dist) * force;
              }
            }
            if (x === 0) ctx2d.moveTo(px, py);
            else ctx2d.lineTo(px, py);
          }
          ctx2d.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      if (gl && program) {
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
      }
    };
  }, [gridSize, distortionRadius, maxDisplacement]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ zIndex }}
      className={`pointer-events-none fixed inset-0 h-full w-full will-change-transform ${className}`}
    />
  );
}
