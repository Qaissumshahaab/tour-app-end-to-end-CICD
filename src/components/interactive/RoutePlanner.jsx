import { useCallback, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import usePerfMode from '../../hooks/usePerfMode.js';

const waypoints = [
  { label: 'Islamabad', day: 'Day 0' },
  { label: 'Naran', day: 'Day 1' },
  { label: 'Gilgit', day: 'Day 2' },
  { label: 'Hunza', day: 'Day 4' },
  { label: 'Khunjerab', day: 'Day 6' },
];

export default function RoutePlanner() {
  const reduceFx = usePerfMode();
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const n = waypoints.length - 1;

  // progress 0..1 across n evenly-spaced waypoints
  const progress = useMotionValue(0);
  const planeX = useTransform(progress, (p) => `${p * 100}%`);
  const planeRotate = useTransform(progress, (p) => (p >= 1 ? 0 : -8));
  const lineFill = useTransform(progress, (p) => `${p * 100}%`);

  const commit = useCallback(
    (p) => {
      const nearestIdx = Math.round(p * n);
      animate(progress, nearestIdx / n, { type: 'spring', stiffness: 300, damping: 30 });
      setIndex(nearestIdx);
    },
    [progress, n]
  );

  const setFromClientX = useCallback(
    (clientX) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = (clientX - rect.left) / rect.width;
      progress.set(Math.min(Math.max(p, 0), 1));
    },
    [progress]
  );

  const dragging = useRef(false);
  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    commit(progress.get());
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mb-10">
        <p className="text-sunset-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3">Build your route</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold">Drag the plane to plan your stops</h2>
        <p className="text-pine-200/70 mt-3 text-sm sm:text-base">
          Let go anywhere on the line and it snaps to the nearest valley — the itinerary below fills in as you go.
        </p>
      </div>

      <div className="rounded-3xl card-border bg-pine-900/40 p-6 sm:p-10">
        <div ref={trackRef} className="relative h-16 w-full touch-none select-none">
          {/* dotted base line */}
          <div
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px]"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 6px, transparent 6px 14px)',
            }}
          />
          {/* filled progress line */}
          <motion.div
            style={{ width: lineFill }}
            className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-sunset-400 rounded-full origin-left"
          />

          {/* waypoint nodes */}
          {waypoints.map((w, i) => (
            <button
              key={w.label}
              type="button"
              onClick={() => commit(i / n)}
              style={{ left: `${(i / n) * 100}%` }}
              className="absolute z-20 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            >
              <span
                className={`h-3 w-3 rounded-full border-2 transition-colors ${
                  i <= index ? 'bg-sunset-400 border-sunset-400' : 'bg-pine-950 border-white/25'
                }`}
              />
              <span
                className={`text-[10px] sm:text-xs whitespace-nowrap transition-colors ${
                  i <= index ? 'text-pine-100' : 'text-pine-300/50'
                }`}
              >
                {w.label}
              </span>
            </button>
          ))}

          {/* full-width drag catcher */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute inset-y-[-16px] inset-x-0 cursor-grab active:cursor-grabbing touch-none"
          />

          {/* draggable plane */}
          <motion.div
            style={{ left: planeX, rotate: reduceFx ? 0 : planeRotate }}
            whileTap={{ scale: 1.15 }}
            className={`pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-sunset-400 flex items-center justify-center text-lg will-change-transform ${
              reduceFx ? '' : 'shadow-lg shadow-black/30'
            }`}
          >
            ✈️
          </motion.div>
        </div>

        {/* itinerary reveal */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {waypoints.map((w, i) => (
            <motion.div
              key={w.label}
              animate={{ opacity: i <= index ? 1 : 0.35, y: i <= index ? 0 : 4 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl border px-3 py-2.5 text-center ${
                i <= index ? 'border-sunset-400/40 bg-sunset-400/10' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider text-pine-300/60">{w.day}</p>
              <p className="text-sm font-semibold text-pine-50 mt-0.5">{w.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
