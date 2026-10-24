import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxHero({ eyebrow, title, subtitle, children, compact = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const yBack = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const yMid = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const yFront = useTransform(scrollYProgress, [0, 1], ['0%', '55%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden bg-aurora ${compact ? 'min-h-[60vh]' : 'min-h-[92vh]'} flex items-end`}
    >
      {/* sky glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-6 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-sunset-400/30 blur-3xl parallax-layer" />
        <div className="absolute top-1/3 -left-16 h-56 w-56 rounded-full bg-glacier-400/20 blur-3xl parallax-layer" />
      </div>

      {/* layered mountain silhouettes for depth / parallax */}
      <motion.svg
        style={{ y: yBack }}
        className="parallax-layer absolute bottom-0 left-0 w-full opacity-60"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path d="M0 300 L180 140 L340 260 L520 90 L720 240 L900 120 L1100 260 L1280 160 L1440 280 L1440 400 L0 400 Z" fill="#0b1f17" />
      </motion.svg>
      <motion.svg
        style={{ y: yMid }}
        className="parallax-layer absolute bottom-0 left-0 w-full opacity-80"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path d="M0 340 L160 200 L300 300 L480 160 L660 310 L860 180 L1040 320 L1220 220 L1440 330 L1440 400 L0 400 Z" fill="#103021" />
      </motion.svg>
      <motion.svg
        style={{ y: yFront }}
        className="parallax-layer absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
      >
        <path d="M0 240 L200 120 L360 220 L560 80 L760 230 L980 110 L1180 240 L1440 150 L1440 300 L0 300 Z" fill="#07140f" />
      </motion.svg>

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 pt-32 w-full"
      >
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-[0.3em] text-xs sm:text-sm text-sunset-400 font-semibold mb-4"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-pine-50 max-w-3xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-pine-100/80 max-w-xl"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
