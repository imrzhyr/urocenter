"use client";
import { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let gradientX = 0;
    let gradientY = 0;
    let targetX = canvas.width / 2;
    let targetY = canvas.height / 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createGradient = (x: number, y: number) => {
      const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, Math.max(canvas.width, canvas.height) * 0.5
      );

      // iOS-inspired colors
      gradient.addColorStop(0, 'rgba(10, 132, 255, 0.03)'); // iOS blue
      gradient.addColorStop(0.3, 'rgba(94, 92, 230, 0.02)'); // iOS purple
      gradient.addColorStop(0.6, 'rgba(0, 179, 255, 0.01)'); // iOS light blue
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      return gradient;
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      // Smooth movement
      const dx = targetX - gradientX;
      const dy = targetY - gradientY;
      gradientX += dx * 0.02;
      gradientY += dy * 0.02;

      // Clear with a very subtle base color
      ctx.fillStyle = 'rgba(248, 250, 252, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw multiple overlapping gradients
      const gradient1 = createGradient(gradientX, gradientY);
      const gradient2 = createGradient(canvas.width - gradientX, canvas.height - gradientY);

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update target position periodically
      if (Math.random() < 0.002) {
        targetX = Math.random() * canvas.width;
        targetY = Math.random() * canvas.height;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Setup
    window.addEventListener('resize', resize);
    resize();
    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col  h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900  text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <canvas
            ref={canvasRef}
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
            style={{ 
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 100%)'
            }}
          ></canvas>
        </div>
        {children}
      </div>
    </main>
  );
}; 