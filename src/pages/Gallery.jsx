import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ParallaxHero from '../components/ParallaxHero.jsx';
import DragFilmstrip from '../components/interactive/DragFilmstrip.jsx';
import { gallery } from '../data/content.js';

const palette = [
  'from-pine-600 to-glacier-500',
  'from-sunset-500 to-pine-700',
  'from-pine-500 to-pine-900',
  'from-glacier-500 to-pine-800',
  'from-pine-400 to-glacier-500',
  'from-sunset-400 to-pine-700',
];

export default function Gallery() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <ParallaxHero
        compact
        eyebrow="Gallery"
        title={<>Moments from the <span className="text-gradient">trail</span></>}
        subtitle="A few frames from past trips — tap any photo for a closer look."
      />

      <DragFilmstrip />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="columns-2 sm:columns-3 gap-4 [column-fill:_balance]">
          {gallery.map((g, i) => (
            <motion.button
              type="button"
              key={g.id}
              layoutId={`photo-${g.id}`}
              onClick={() => setActive(g)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
              className={`mb-4 w-full block rounded-2xl overflow-hidden relative bg-gradient-to-br ${palette[i % palette.length]} ${
                g.tall ? 'h-72 sm:h-96' : 'h-44 sm:h-56'
              }`}
            >
              <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-left">
                <p className="text-white font-display font-semibold text-sm sm:text-base">{g.title}</p>
                <p className="text-white/70 text-xs">{g.place}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={`photo-${active.id}`}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-xl rounded-3xl overflow-hidden bg-gradient-to-br ${
                palette[gallery.findIndex((g) => g.id === active.id) % palette.length]
              } h-[70vh]`}
            >
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-display text-xl font-bold">{active.title}</p>
                <p className="text-white/70 text-sm">{active.place}</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur hover:bg-black/60"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
