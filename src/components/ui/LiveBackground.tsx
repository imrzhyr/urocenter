import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LiveBackgroundProps {
  className?: string;
}

export const LiveBackground = ({ className }: LiveBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Create particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.2 + 0.1,
      });
    }

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 132, 255, ${particle.opacity * 2})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      particles.forEach((particle) => {
        const dx = x - particle.x;
        const dy = y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) * 0.003;
          particle.speedX -= Math.cos(angle) * force;
          particle.speedY -= Math.sin(angle) * force;
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.8 }}
      />
      <motion.div
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-br from-[#0A84FF]/5 to-transparent"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
    </div>
  );
}; 