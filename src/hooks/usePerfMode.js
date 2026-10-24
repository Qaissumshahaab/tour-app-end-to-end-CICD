import { useEffect, useState } from 'react';

/**
 * Detects low-end devices / reduced-motion preference so heavy visual
 * effects (parallax, blur, background animation) can be dialed down.
 * This keeps the app smooth on low-spec phones.
 */
export default function usePerfMode() {
  const [reduceFx, setReduceFx] = useState(() => {
    if (typeof window === 'undefined') return false;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const saveData = navigator.connection?.saveData;
    const slowNet = ['slow-2g', '2g'].includes(navigator.connection?.effectiveType);
    const mqInit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return mqInit || cores <= 4 || mem <= 4 || !!saveData || slowNet;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const saveData = navigator.connection?.saveData;
    const slowNet = ['slow-2g', '2g'].includes(navigator.connection?.effectiveType);
    const deviceLow = cores <= 4 || mem <= 4 || !!saveData || slowNet;

    const handler = (e) => setReduceFx(e.matches || deviceLow);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-fx', reduceFx);
  }, [reduceFx]);

  return reduceFx;
}
