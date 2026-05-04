import { useState, useEffect, useRef, useCallback } from 'react';

interface TiltOffset {
  x: number;
  y: number;
}

export function useDeviceTilt(maxOffset = 18, reducedMotion = false): TiltOffset {
  const [offset, setOffset] = useState<TiltOffset>({ x: 0, y: 0 });
  const smoothRef = useRef<TiltOffset>({ x: 0, y: 0 });
  const targetRef = useRef<TiltOffset>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const listeningRef = useRef(false);

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const beta = e.beta ?? 45;
    const gamma = e.gamma ?? 0;
    targetRef.current = {
      x: Math.max(-1, Math.min(1, gamma / 25)) * maxOffset,
      y: Math.max(-1, Math.min(1, (beta - 45) / 25)) * maxOffset,
    };
  }, [maxOffset]);

  const startListening = useCallback(() => {
    if (listeningRef.current) return;
    listeningRef.current = true;
    window.addEventListener('deviceorientation', handleOrientation);
  }, [handleOrientation]);

  useEffect(() => {
    if (reducedMotion) return;

    // Animate loop
    const animate = () => {
      smoothRef.current = {
        x: smoothRef.current.x + (targetRef.current.x - smoothRef.current.x) * 0.04,
        y: smoothRef.current.y + (targetRef.current.y - smoothRef.current.y) * 0.04,
      };
      setOffset({ ...smoothRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // iOS 13+ requires user gesture for permission
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission === 'function') {
      // Attach to first user tap — iOS only allows permission from gesture
      const onTap = async () => {
        try {
          const result = await doe.requestPermission!();
          if (result === 'granted') startListening();
        } catch { /* denied */ }
        document.removeEventListener('touchstart', onTap);
      };
      document.addEventListener('touchstart', onTap, { once: true });
    } else {
      // Android / desktop — no permission needed
      startListening();
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('deviceorientation', handleOrientation);
      listeningRef.current = false;
    };
  }, [reducedMotion, handleOrientation, startListening]);

  return offset;
}
