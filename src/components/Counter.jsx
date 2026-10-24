import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export default function Counter({ to = 100, suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 24, stiffness: 60 });
  const display = useRef(null);

  useEffect(() => {
    if (inView) motionVal.set(to);
  }, [inView, to, motionVal]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      if (display.current) display.current.textContent = Math.round(v).toLocaleString();
    });
    return unsub;
  }, [spring]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl sm:text-4xl font-bold text-gradient">
        <span ref={display}>0</span>
        {suffix}
      </p>
      <p className="mt-1 text-xs sm:text-sm text-pine-200/70 uppercase tracking-wider">{label}</p>
    </div>
  );
}
