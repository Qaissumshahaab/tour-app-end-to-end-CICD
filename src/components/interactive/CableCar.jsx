import { useCallback, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useMotionValueEvent } from 'framer-motion';
import usePerfMode from '../../hooks/usePerfMode.js';

const stations = [
  { at: 0, label: 'Base Camp', alt: '2,200 m' },
  { at: 0.5, label: 'Pine Ridge', alt: '2,950 m' },
  { at: 1, label: 'Summit Deck', alt: '3,700 m' },
];

export default function CableCar() {
  const reduceFx = usePerfMode();
  const trackRef = useRef(null);
  const [station, setStation] = useState(stations[0]);

  // 0 = bottom, 1 = top. Pointer-driven, single division per move.
  const progress = useMotionValue(0);
  const carTop = useTransform(progress, (p) => `${(1 - p) * 100}%`);
  const cableFill = useTransform(progress, (p) => `${p * 100}%`);
  const carRotate = useTransform(progress, [0, 1], [-4, 4]);

  useMotionValueEvent(progress, 'change', (p) => {
    const nearest = stations.reduce((a, b) => (Math.abs(b.at - p) < Math.abs(a.at - p) ? b : a));
    setStation((prev) => (prev.label === nearest.label ? prev : nearest));
  });

  const setFromClientY = useCallback((clientY) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = 1 - (clientY - rect.top) / rect.height;
    progress.set(Math.min(Math.max(p, 0), 1));
  }, [progress]);

  const dragging = useRef(false);
  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientY(e.clientY);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setFromClientY(e.clientY);
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };
  const snapTo = (p) => animate(progress, p, { type: 'spring', stiffness: 240, damping: 26 });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-2">
          <p className="text-sunset-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3">Drag the chairlift</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Ride up to the ridge</h2>
          <p className="text-pine-200/70 mt-3 text-sm sm:text-base">
            Pull the car up or let it coast back down — each stop reveals a different altitude on the slope.
          </p>
          <div className="mt-8 rounded-2xl card-border bg-pine-900/40 p-5">
            <p className="text-xs uppercase tracking-wider text-pine-300/70">Current station</p>
            <p className="font-display font-semibold text-xl text-pine-50 mt-1">{station.label}</p>
            <p className="text-sm text-gradient font-semibold mt-1">{station.alt}</p>
            <div className="flex gap-2 mt-4">
              {stations.map((s) => (
                <button
                  key={s.label}
                  onClick={() => snapTo(s.at)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    station.label === s.label
                      ? 'bg-glacier-400/20 border-glacier-400/50 text-glacier-300'
                      : 'border-white/10 text-pine-200/60 hover:border-white/20'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-3xl card-border bg-pine-900/40 p-4 sm:p-8">
          <div
            ref={trackRef}
            className="relative h-[360px] sm:h-[420px] w-full max-w-xs mx-auto touch-none select-none"
          >
            {/* mountain slope backdrop */}
            <svg viewBox="0 0 200 420" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path d="M0 420 L40 300 L80 420 Z" fill="#103021" opacity="0.6" />
              <path d="M90 420 L150 180 L200 420 Z" fill="#0b1f17" opacity="0.8" />
            </svg>

            {/* cable: full line + filled progress */}
            <div className="absolute left-1/2 top-6 bottom-6 w-[3px] -translate-x-1/2 bg-white/15 rounded-full" />
            <motion.div
              style={{ height: cableFill }}
              className="absolute left-1/2 bottom-6 w-[3px] -translate-x-1/2 bg-glacier-400 rounded-full origin-bottom"
            />

            {/* station markers */}
            {stations.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => snapTo(s.at)}
                style={{ bottom: `calc(${s.at * 100}% + 1.3rem)` }}
                className="absolute z-20 left-1/2 -translate-x-1/2 flex items-center gap-2 group"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${
                    station.label === s.label ? 'bg-glacier-400 border-glacier-400' : 'bg-transparent border-white/30'
                  }`}
                />
                <span className="text-[10px] text-pine-200/60 group-hover:text-pine-100 whitespace-nowrap">
                  {s.label}
                </span>
              </button>
            ))}

            {/* full-column drag catcher */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
            />

            {/* cable car */}
            <motion.div
              style={{ top: carTop, rotate: reduceFx ? 0 : carRotate }}
              whileTap={{ scale: 1.08 }}
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-12 rounded-xl bg-glacier-400 flex items-center justify-center text-xl will-change-transform ${
                reduceFx ? '' : 'shadow-lg shadow-black/30'
              }`}
            >
              🚡
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
