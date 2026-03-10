import { useEffect, useRef } from 'react';

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number>();
  const isCleanedUpRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset cleanup flag
    isCleanedUpRef.current = false;

    const setCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const stars: Array<{ x: number; y: number; radius: number; opacity: number; speed: number }> = [];
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      // Check if component was cleaned up
      if (isCleanedUpRef.current) return;

      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.opacity += star.speed * 0.01;
        if (star.opacity > 1 || star.opacity < 0) {
          star.speed = -star.speed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      if (!isCleanedUpRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Set cleanup flag
      isCleanedUpRef.current = true;

      // Cancel animation frame
      if (animationFrameIdRef.current !== undefined) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = undefined;
      }

      // Remove event listener
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
}