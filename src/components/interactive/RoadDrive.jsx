import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, useMotionValueEvent } from 'framer-motion';
import usePerfMode from '../../hooks/usePerfMode.js';

// A winding road path. Precomputed once as a string so no layout work happens on drag.
const ROAD_D =
  'M 20 170 C 90 170 90 90 170 90 C 250 90 250 200 340 200 C 430 200 430 60 520 60 C 600 60 610 150 680 150';

const stops = [
  { at: 0.02, label: 'Gilgit', alt: '1,500 m' },
  { at: 0.34, label: 'Karimabad', alt: '2,400 m' },
  { at: 0.66, label: 'Passu', alt: '2,800 m' },
  { at: 0.98, label: 'Khunjerab', alt: '4,693 m' },
];

export default function RoadDrive() {
  const pathRef = useRef(null);
  const trackRef = useRef(null);
  const reduceFx = usePerfMode();
  const [activeStop, setActiveStop] = useState(stops[0]);

  // progress is a plain 0–1 motion value driven directly by pointer position;
  // no framer "drag" offset math needed since the hit area spans the whole
  // track (see pointer handlers below) — keeps the math a single division.
  const progress = useMotionValue(0);

  // Derive the jeep's screen position straight from the SVG path — native,
  // cheap (getPointAtLength), and keeps everything on compositor-friendly
  // transforms instead of re-laying-out React state every frame.
  // viewBox is 700x220 user units; convert to the track's actual pixel box
  // (which always shares the same aspect ratio, see aspect-[700/220] below)
  // so the jeep lands exactly on the rendered road, at any screen size.
  const jeepX = useTransform(progress, (p) => {
    const path = pathRef.current;
    const el = trackRef.current;
    if (!path || !el) return 0;
    const len = path.getTotalLength();
    const scale = el.offsetWidth / 700;
    return path.getPointAtLength(p * len).x * scale;
  });
  const jeepY = useTransform(progress, (p) => {
    const path = pathRef.current;
    const el = trackRef.current;
    if (!path || !el) return 0;
    const len = path.getTotalLength();
    const scale = el.offsetHeight / 220;
    return path.getPointAtLength(p * len).y * scale;
  });
  useMotionValueEvent(progress, 'change', (p) => {
    const nearest = stops.reduce((a, b) => (Math.abs(b.at - p) < Math.abs(a.at - p) ? b : a));
    setActiveStop((prev) => (prev.label === nearest.label ? prev : nearest));
  });

  const setFromClientX = useCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = (clientX - rect.left) / rect.width;
    progress.set(Math.min(Math.max(p, 0), 1));
  }, [progress]);

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
  };

  const snapTo = (p) => {
    animate(progress, p, { type: 'spring', stiffness: 260, damping: 28 });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mb-10">
        <p className="text-sunset-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3">Drag the jeep</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold">Drive the Karakoram Highway</h2>
        <p className="text-pine-200/70 mt-3 text-sm sm:text-base">
          Swipe or drag the jeep along the route — it rides the real road curve, not just a straight line.
        </p>
      </div>

      <div className="rounded-3xl card-border bg-pine-900/40 p-4 sm:p-8">
        <div ref={trackRef} className="relative w-full aspect-[700/220] select-none touch-none">
          <svg viewBox="0 0 700 220" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* base road */}
            <path ref={pathRef} d={ROAD_D} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round" />
            {/* traveled portion — framer's pathLength prop drives stroke-dasharray for us */}
            <motion.path
              d={ROAD_D}
              fill="none"
              stroke="#f2994a"
              strokeWidth="10"
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>

          {/* waypoint labels, positioned with plain CSS percentages (cheap) */}
          {stops.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => snapTo(s.at)}
              style={{ left: `${s.at * 100}%` }}
              className="absolute z-20 -translate-x-1/2 top-1 flex flex-col items-center gap-1 group"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${
                  activeStop.label === s.label ? 'bg-sunset-400 border-sunset-400' : 'bg-transparent border-white/30'
                }`}
              />
              <span className="text-[10px] sm:text-xs text-pine-200/60 group-hover:text-pine-100 whitespace-nowrap">
                {s.label}
              </span>
            </button>
          ))}

          {/* full-area drag catcher — grab anywhere on the road, not just a
              tiny handle. Plain pointer events + a single division per move
              keep this cheap even on low-end phones. */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
          />

          {/* visual jeep, decoupled from the drag catcher and placed purely
              from the path math above — keeps dragging butter-smooth since
              nothing here triggers a React re-render, only transform writes */}
          <motion.div
            style={{ x: jeepX, y: jeepY }}
            whileTap={{ scale: 1.08 }}
            className={`pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-sunset-400 flex items-center justify-center text-xl will-change-transform ${
              reduceFx ? '' : 'shadow-lg shadow-black/30'
            }`}
          >
            🚙
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-pine-300/70">Now passing</p>
            <p className="font-display font-semibold text-lg text-pine-50">{activeStop.label}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-pine-300/70">Altitude</p>
            <p className="font-display font-semibold text-lg text-gradient">{activeStop.alt}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
