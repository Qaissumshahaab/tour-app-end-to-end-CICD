import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import usePerfMode from '../../hooks/usePerfMode.js';

const frames = [
  { title: 'Sunrise over Rakaposhi', place: 'Hunza', gradient: 'from-sunset-500 to-pine-700' },
  { title: 'Glacier switchbacks', place: 'Karakoram Highway', gradient: 'from-glacier-500 to-pine-800' },
  { title: 'Alpine lake, dead calm', place: 'Naltar', gradient: 'from-pine-400 to-glacier-500' },
  { title: 'Wildflower plateau', place: 'Deosai', gradient: 'from-sunset-400 to-pine-700' },
  { title: 'Fort at dusk', place: 'Hunza', gradient: 'from-pine-600 to-glacier-500' },
  { title: 'Pine-forest river', place: 'Swat', gradient: 'from-pine-500 to-pine-900' },
  { title: 'Base camp view', place: 'Fairy Meadows', gradient: 'from-glacier-400 to-pine-800' },
];

export default function DragFilmstrip() {
  const reduceFx = usePerfMode();
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [constraint, setConstraint] = useState(0);

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      const t = trackRef.current;
      if (!c || !t) return;
      setConstraint(Math.max(0, t.scrollWidth - c.offsetWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
        <p className="text-sunset-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3">Swipe through</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold">Drag the filmstrip</h2>
        <p className="text-pine-200/70 mt-3 text-sm sm:text-base max-w-xl">
          Flick it like a real strip of film — it carries momentum and eases to a stop.
        </p>
      </div>

      <div ref={containerRef} className="overflow-hidden pl-4 sm:pl-6">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -constraint, right: 0 }}
          dragElastic={0.08}
          dragMomentum={!reduceFx}
          dragTransition={{ power: 0.25, timeConstant: 200 }}
          whileTap={{ cursor: 'grabbing' }}
          style={{ touchAction: 'pan-y' }}
          className="flex gap-4 sm:gap-6 cursor-grab will-change-transform pr-4 sm:pr-6"
        >
          {frames.map((f) => (
            <div
              key={f.title}
              className={`relative shrink-0 w-[72vw] sm:w-[340px] h-56 sm:h-72 rounded-3xl overflow-hidden bg-gradient-to-br ${f.gradient} select-none`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 p-5 pointer-events-none">
                <p className="font-display font-semibold text-white text-base sm:text-lg">{f.title}</p>
                <p className="text-white/70 text-xs sm:text-sm">{f.place}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
