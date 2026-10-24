import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function DestinationCard({ d, index = 0 }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      className="group relative rounded-3xl overflow-hidden card-border bg-pine-900/40 will-change-transform"
    >
      <div className={`relative h-48 sm:h-56 bg-gradient-to-br ${d.gradient} overflow-hidden`}>
        <svg viewBox="0 0 400 220" className="absolute bottom-0 w-full opacity-70" preserveAspectRatio="none">
          <path d="M0 170 L80 90 L140 150 L220 60 L300 160 L400 100 L400 220 L0 220 Z" fill="rgba(7,20,15,0.55)" />
        </svg>
        <div className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-black/30 backdrop-blur px-2 py-1 rounded-full text-pine-50">
          {d.altitude}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[11px] uppercase tracking-widest text-pine-100/80">{d.region}</p>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{d.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold text-sunset-400 mb-1">{d.tagline}</p>
        <p className="text-sm text-pine-200/75 leading-relaxed">{d.desc}</p>
      </div>
    </motion.div>
  );
}
