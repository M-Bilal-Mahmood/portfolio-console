import React, { useEffect, useRef } from 'react';

interface Vertex {
  angle: number;
  radiusFactor: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vy: number;
  driftAngle: number;
  driftSpeed: number;
  driftAmplitude: number;
  rotation: number;
  rotationSpeed: number;
  vertices: Vertex[];
}

export const FallingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prefers reduced motion check
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      return;
    }

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isTabVisible = document.visibilityState === 'visible';

    // Particle quantity increased by 1/4th (+25%): 60 -> 75 on desktop, 30 -> 38 on mobile
    const getTargetCount = (w: number) => (w < 768 ? 38 : 75);

    // Creates unique irregular organic vertices for a clean, natural speck/flake shape
    const createVertices = (): Vertex[] => {
      const numVertices = Math.floor(Math.random() * 3) + 4; // 4 to 6 vertices
      const vertices: Vertex[] = [];
      const baseStep = (Math.PI * 2) / numVertices;

      for (let i = 0; i < numVertices; i++) {
        const angleJitter = (Math.random() - 0.5) * (baseStep * 0.45);
        const angle = i * baseStep + angleJitter;
        const radiusFactor = Math.random() * 0.75 + 0.6; // 0.6 to 1.35 factor
        vertices.push({ angle, radiusFactor });
      }
      return vertices;
    };

    const createParticle = (initialY?: number): Particle => ({
      x: Math.random() * width,
      y: initialY !== undefined ? initialY : Math.random() * height,
      size: Math.random() * 3 + 2.5, // 2.5px to 5.5px for clear visibility
      opacity: Math.random() * 0.35 + 0.45, // 45% to 80% opacity so they are clearly visible
      vy: Math.random() * 0.55 + 0.35, // Gentle downward drift
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.015 + 0.005,
      driftAmplitude: Math.random() * 0.45 + 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.018, // Subtle natural rotation
      vertices: createVertices(),
    });

    const initParticles = () => {
      const count = getTargetCount(width);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Reconcile particle count
      const targetCount = getTargetCount(width);
      if (particles.length > targetCount) {
        particles = particles.slice(0, targetCount);
      } else {
        while (particles.length < targetCount) {
          particles.push(createParticle());
        }
      }
    };

    handleResize();
    initParticles();

    const render = () => {
      if (!isTabVisible) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.driftAngle += p.driftSpeed;
        p.x += Math.sin(p.driftAngle) * p.driftAmplitude;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Loop back when leaving bottom or horizontal bounds
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) {
          p.x = width + 10;
        } else if (p.x > width + 10) {
          p.x = -10;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        const verts = p.vertices;
        const halfSize = p.size / 2;
        for (let j = 0; j < verts.length; j++) {
          const v = verts[j];
          const r = halfSize * v.radiusFactor;
          const vx = Math.cos(v.angle) * r;
          const vy = Math.sin(v.angle) * r;
          if (j === 0) {
            ctx.moveTo(vx, vy);
          } else {
            ctx.lineTo(vx, vy);
          }
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(240, 242, 248, ${p.opacity})`;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isTabVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isTabVisible = true;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, width, height);
      } else {
        handleResize();
        initParticles();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionChange);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
};
