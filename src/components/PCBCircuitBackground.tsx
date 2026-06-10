import React, { useEffect, useRef } from "react";

export const PCBCircuitBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      if (ctx) {
        ctx.resetTransform();
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const W = () => {
      const rect = canvas.getBoundingClientRect();
      return rect.width;
    };
    const H = () => {
      const rect = canvas.getBoundingClientRect();
      return rect.height;
    };

    const palette = {
      trace: "#00c896",
      traceA: "rgba(0,200,150,0.18)",
      node: "#00ffb8",
      nodeGlow: "rgba(0,255,184,0.5)",
      chip: "rgba(0,30,22,0.85)",
      chipBorder: "#00c896",
      pulse: "#00ffb8",
      text: "rgba(0,255,184,0.7)",
      dim: "rgba(0,200,150,0.08)",
    };

    // ---- Chips ----
    const chips = [
      { x: 0.12, y: 0.18, w: 0.13, h: 0.18, label: "CPU", pins: 10 },
      { x: 0.72, y: 0.12, w: 0.11, h: 0.14, label: "GPU", pins: 8 },
      { x: 0.42, y: 0.55, w: 0.15, h: 0.19, label: "MCU", pins: 10 },
      { x: 0.65, y: 0.62, w: 0.09, h: 0.12, label: "RAM", pins: 6 },
      { x: 0.18, y: 0.68, w: 0.10, h: 0.10, label: "I/O", pins: 6 },
      { x: 0.80, y: 0.42, w: 0.09, h: 0.11, label: "CLK", pins: 6 },
      { x: 0.35, y: 0.14, w: 0.09, h: 0.11, label: "PWR", pins: 6 },
    ];

    interface Chip {
      x: number;
      y: number;
      w: number;
      h: number;
      label: string;
      pins: number;
    }

    const chipRect = (c: Chip) => {
      return { x: c.x * W(), y: c.y * H(), w: c.w * W(), h: c.h * H() };
    };

    const drawChip = (c: Chip) => {
      const { x, y, w, h } = chipRect(c);
      ctx.save();
      ctx.fillStyle = palette.chip;
      ctx.strokeStyle = palette.chipBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      // Basic roundRect compatibility fallbacks or modern support
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, w, h, 4);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.fill();
      ctx.stroke();

      // inner grid lines
      ctx.strokeStyle = "rgba(0,200,150,0.12)";
      ctx.lineWidth = 0.5;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); 
        ctx.moveTo(x + (w / 4) * i, y + 2); 
        ctx.lineTo(x + (w / 4) * i, y + h - 2); 
        ctx.stroke();
        
        ctx.beginPath(); 
        ctx.moveTo(x + 2, y + (h / 4) * i); 
        ctx.lineTo(x + w - 2, y + (h / 4) * i); 
        ctx.stroke();
      }

      // label
      ctx.fillStyle = palette.text;
      ctx.font = "500 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c.label, x + w / 2, y + h / 2);

      // pins top/bottom
      const pinCount = Math.floor(c.pins / 2);
      const pinSpacing = w / (pinCount + 1);
      ctx.fillStyle = palette.chipBorder;
      for (let i = 1; i <= pinCount; i++) {
        const px = x + pinSpacing * i;
        ctx.fillRect(px - 1.5, y - 5, 3, 5);
        ctx.fillRect(px - 1.5, y + h, 3, 5);
      }
      ctx.restore();
    };

    // ---- Traces ----
    const traces = [
      { pts: [{ x: 0.25, y: 0.27 }, { x: 0.25, y: 0.32 }, { x: 0.35, y: 0.32 }, { x: 0.35, y: 0.25 }] },
      { pts: [{ x: 0.83, y: 0.26 }, { x: 0.83, y: 0.42 }] },
      { pts: [{ x: 0.35, y: 0.25 }, { x: 0.42, y: 0.25 }, { x: 0.42, y: 0.55 }] },
      { pts: [{ x: 0.50, y: 0.55 }, { x: 0.50, y: 0.40 }, { x: 0.65, y: 0.40 }, { x: 0.65, y: 0.42 }] },
      { pts: [{ x: 0.57, y: 0.64 }, { x: 0.65, y: 0.64 }] },
      { pts: [{ x: 0.42, y: 0.74 }, { x: 0.28, y: 0.74 }, { x: 0.28, y: 0.68 }] },
      { pts: [{ x: 0.83, y: 0.53 }, { x: 0.83, y: 0.62 }, { x: 0.74, y: 0.62 }] },
      { pts: [{ x: 0.18, y: 0.18 }, { x: 0.18, y: 0.50 }, { x: 0.28, y: 0.50 }, { x: 0.28, y: 0.68 }] },
      { pts: [{ x: 0.78, y: 0.19 }, { x: 0.78, y: 0.35 }, { x: 0.89, y: 0.35 }, { x: 0.89, y: 0.55 }, { x: 0.74, y: 0.55 }] },
      { pts: [{ x: 0.44, y: 0.14 }, { x: 0.44, y: 0.08 }, { x: 0.72, y: 0.08 }, { x: 0.72, y: 0.12 }] },
      { pts: [{ x: 0.12, y: 0.25 }, { x: 0.06, y: 0.25 }, { x: 0.06, y: 0.78 }, { x: 0.42, y: 0.78 }, { x: 0.42, y: 0.74 }] },
    ];

    interface Point {
      x: number;
      y: number;
    }

    // ---- Signal pulses ----
    const signals = traces.map((_, i) => ({
      traceIdx: i,
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      size: 3 + Math.random() * 2,
    }));

    const ptAtT = (pts: Point[], t: number) => {
      const segs = [];
      let total = 0;
      for (let i = 1; i < pts.length; i++) {
        const dx = (pts[i].x - pts[i - 1].x) * W();
        const dy = (pts[i].y - pts[i - 1].y) * H();
        const l = Math.sqrt(dx * dx + dy * dy);
        segs.push({ len: l, i });
        total += l;
      }
      let target = t * total;
      for (const seg of segs) {
        if (target <= seg.len) {
          const frac = target / seg.len;
          const p0 = pts[seg.i - 1];
          const p1 = pts[seg.i];
          return {
            x: (p0.x + (p1.x - p0.x) * frac) * W(),
            y: (p0.y + (p1.y - p0.y) * frac) * H(),
          };
        }
        target -= seg.len;
      }
      const last = pts[pts.length - 1];
      return { x: last.x * W(), y: last.y * H() };
    };

    const drawGrid = () => {
      ctx.save();
      ctx.strokeStyle = palette.traceA;
      ctx.lineWidth = 0.5;
      const step = 32;
      const currentW = W();
      const currentH = H();
      for (let x = 0; x < currentW; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, currentH);
        ctx.stroke();
      }
      for (let y = 0; y < currentH; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(currentW, y);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawTrace = (pts: Point[]) => {
      ctx.save();
      ctx.strokeStyle = "rgba(0,200,150,0.35)";
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x * W(), pts[0].y * H());
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x * W(), pts[i].y * H());
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawPulse = (sig: { traceIdx: number; t: number; size: number }) => {
      const tr = traces[sig.traceIdx];
      const pos = ptAtT(tr.pts, sig.t);
      ctx.save();
      const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, sig.size * 3);
      g.addColorStop(0, "rgba(0,255,184,0.95)");
      g.addColorStop(0.5, "rgba(0,255,184,0.4)");
      g.addColorStop(1, "rgba(0,255,184,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, sig.size * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, sig.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ---- Capacitors / resistors ----
    const components = [
      { type: "cap", x: 0.55, y: 0.3, rot: 0 },
      { type: "cap", x: 0.3, y: 0.5, rot: Math.PI / 2 },
      { type: "res", x: 0.6, y: 0.46, rot: 0 },
      { type: "res", x: 0.1, y: 0.46, rot: Math.PI / 2 },
      { type: "cap", x: 0.9, y: 0.7, rot: 0 },
      { type: "res", x: 0.5, y: 0.86, rot: 0 },
    ];

    interface Component {
      type: string;
      x: number;
      y: number;
      rot: number;
    }

    const drawComponent = (comp: Component) => {
      const cx = comp.x * W();
      const cy = comp.y * H();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(comp.rot);
      if (comp.type === "cap") {
        ctx.strokeStyle = palette.chipBorder;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-4, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(4, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-4, -7);
        ctx.lineTo(-4, 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(4, -7);
        ctx.lineTo(4, 7);
        ctx.stroke();
      } else {
        ctx.strokeStyle = palette.chipBorder;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-8, -4, 16, 8);
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(-8, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(14, 0);
        ctx.stroke();
      }
      ctx.restore();
    };

    // ---- Via dots ----
    const vias = [
      { x: 0.35, y: 0.32 },
      { x: 0.42, y: 0.55 },
      { x: 0.5, y: 0.4 },
      { x: 0.65, y: 0.42 },
      { x: 0.83, y: 0.42 },
      { x: 0.28, y: 0.68 },
      { x: 0.83, y: 0.53 },
      { x: 0.06, y: 0.25 },
      { x: 0.44, y: 0.08 },
      { x: 0.5, y: 0.55 },
      { x: 0.18, y: 0.5 },
      { x: 0.44, y: 0.14 },
    ];

    const drawVia = (v: Point, time: number) => {
      const x = v.x * W();
      const y = v.y * H();
      const pulse = 0.5 + 0.5 * Math.sin(time * 2 + v.x * 10);
      ctx.save();
      ctx.strokeStyle = `rgba(0,255,184,${0.3 + 0.4 * pulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(0,200,150,${0.4 + 0.4 * pulse})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawCornerMarkers = () => {
      const currentW = W();
      const currentH = H();
      const corners = [
        { x: 10, y: 10 },
        { x: currentW - 10, y: 10 },
        { x: 10, y: currentH - 10 },
        { x: currentW - 10, y: currentH - 10 },
      ];
      corners.forEach((c) => {
        ctx.save();
        ctx.strokeStyle = "rgba(0,200,150,0.5)";
        ctx.lineWidth = 1;
        const s = 12;
        const dx = c.x < currentW / 2 ? 1 : -1;
        const dy = c.y < currentH / 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y + dy * s);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(c.x + dx * s, c.y);
        ctx.stroke();
        ctx.restore();
      });
    };

    let scanY = 0;
    const drawScan = () => {
      const currentH = H();
      scanY = (scanY + 0.5) % currentH;
      ctx.save();
      const g = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      g.addColorStop(0, "rgba(0,255,184,0)");
      g.addColorStop(0.5, "rgba(0,255,184,0.05)");
      g.addColorStop(1, "rgba(0,255,184,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - 20, W(), 40);
      ctx.restore();
    };

    let labelBlink = 0;
    const drawLabel = () => {
      labelBlink += 0.04;
      const alpha = 0.5 + 0.5 * Math.sin(labelBlink);
      ctx.save();
      ctx.font = "500 10px monospace";
      ctx.fillStyle = `rgba(0,255,184,${0.3 + 0.3 * alpha})`;
      ctx.textAlign = "left";
      const labels = ["SYS_CLK: 3.8GHz", "VCORE: 1.2V", "TEMP: 42°C", "PKT_TX: 9.6Gb/s"];
      labels.forEach((l, i) => {
        ctx.fillText(l, 14, H() - 14 - i * 15);
      });
      ctx.restore();
    };

    let animT = 0;
    let animationFrameId: number;

    const render = () => {
      animT += 0.016;
      ctx.clearRect(0, 0, W(), H());
      drawGrid();
      drawScan();
      drawCornerMarkers();
      traces.forEach((tr) => drawTrace(tr.pts));
      components.forEach((c) => drawComponent(c));
      vias.forEach((v) => drawVia(v, animT));
      chips.forEach((c) => drawChip(c));
      signals.forEach((sig) => {
        sig.t += sig.speed;
        if (sig.t > 1) {
          sig.t = 0;
          sig.speed = 0.003 + Math.random() * 0.004;
        }
        drawPulse(sig);
      });
      drawLabel();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block bg-black"
      style={{ display: "block" }}
    />
  );
};
