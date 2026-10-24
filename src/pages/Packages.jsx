import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParallaxHero from '../components/ParallaxHero.jsx';
import PackageCard from '../components/PackageCard.jsx';
import Reveal from '../components/Reveal.jsx';
import RoutePlanner from '../components/interactive/RoutePlanner.jsx';
import { packages } from '../data/content.js';

const sorts = [
  { id: 'popular', label: 'Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'days-asc', label: 'Shortest First' },
];

export default function Packages() {
  const [sort, setSort] = useState('popular');

  const sorted = useMemo(() => {
    const arr = [...packages];
    if (sort === 'price-asc') arr.sort((a, b) => a.price - b.price);
    if (sort === 'days-asc') arr.sort((a, b) => a.days - b.days);
    return arr;
  }, [sort]);

  return (
    <div>
      <ParallaxHero
        compact
        eyebrow="Tour packages"
        title={<>Itineraries ready to <span className="text-gradient">roll</span></>}
        subtitle="Fixed departures or private groups — every package includes stays, transport and a dedicated guide."
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">{packages.length} packages available</h2>
          </Reveal>
          <div className="flex gap-2 flex-wrap">
            {sorts.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`text-xs sm:text-sm px-3.5 py-2 rounded-full border transition-colors ${
                  sort === s.id
                    ? 'bg-pine-400/20 border-pine-400/50 text-pine-200'
                    : 'border-white/10 text-pine-200/70 hover:border-white/20'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid gap-5">
          {sorted.map((p, i) => (
            <motion.div layout key={p.id}>
              <PackageCard pkg={p} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <RoutePlanner />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <Reveal className="rounded-3xl bg-aurora p-8 sm:p-12 text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-pine-50">Want a custom itinerary?</h3>
          <p className="text-pine-100/80 mt-3 max-w-md mx-auto">
            Private groups, honeymoon routes, photography trips — we design around your dates and pace.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-sunset-400 text-pine-950 font-semibold hover:bg-sunset-300 transition-colors"
          >
            Request a custom plan
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
