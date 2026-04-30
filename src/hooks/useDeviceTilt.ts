import { useState, useEffect, useRef } from 'react';

interface TiltOffset {
  x: number;
  y: number;
}

export function useDeviceTilt(maxOffset = 20, reducedMotion = false): TiltOffset {
  const [offset, setOffset] = useState<TiltOffset>({ x: 0, y: 0 });
  const smoothRef = useRef<TiltOffset>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const targetRef = useRef<TiltOffset>({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0;   // -180 to 180 (front-back tilt)
      const gamma = e.gamma ?? 0;  // -90 to 90 (left-right tilt)

      // Normalize: neutral position is ~beta=45 (phone held upright)
      const normalizedX = Math.max(-1, Math.min(1, gamma / 30));
      const normalizedY = Math.max(-1, Math.min(1, (beta - 45) / 30));

      targetRef.current = {
        x: normalizedX * maxOffset,
        y: normalizedY * maxOffset,
      };
    };

    const animate = () => {
      const lerpFactor = 0.05; // slow, spring-like
      smoothRef.current = {
        x: smoothRef.current.x + (targetRef.current.x - smoothRef.current.x) * lerpFactor,
        y: smoothRef.current.y + (targetRef.current.y - smoothRef.current.y) * lerpFactor,
      };
      setOffset({ ...smoothRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    const requestPermission = async () => {
      // iOS 13+ requires permission
      const doe = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof doe.requestPermission === 'function') {
        try {
          const permission = await doe.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch {
          // permission denied or not available — no tilt effect
          return;
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    requestPermission();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, maxOffset]);

  return offset;
}
