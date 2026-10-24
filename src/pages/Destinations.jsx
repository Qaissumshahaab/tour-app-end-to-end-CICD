import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParallaxHero from '../components/ParallaxHero.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import Reveal from '../components/Reveal.jsx';
import CableCar from '../components/interactive/CableCar.jsx';
import { destinations } from '../data/content.js';

export default function Destinations() {
  const regions = useMemo(
    () => ['All', ...new Set(destinations.map((d) => d.region))],
    []
  );
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All' ? destinations : destinations.filter((d) => d.region === active);

  return (
    <div>
      <ParallaxHero
        compact
        eyebrow="Where to go"
        title={<>Valleys worth the <span className="text-gradient">long drive</span></>}
        subtitle="Six regions, each with its own color of water, shape of peak and pace of life."
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex flex-wrap gap-2 mb-10">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActive(r)}
              className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              {active === r && (
                <motion.span
                  layoutId="region-pill"
                  className="absolute inset-0 rounded-full bg-sunset-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${active === r ? 'text-pine-950' : 'text-pine-100/80 hover:text-pine-50'}`}>
                {r}
              </span>
              {active !== r && <span className="absolute inset-0 rounded-full border border-white/10" />}
            </button>
          ))}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d, i) => (
            <motion.div key={d.id} layout>
              <DestinationCard d={d} index={i} />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-pine-300/70 py-20">No destinations found in this region yet.</p>
        )}
      </section>

      <CableCar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <Reveal className="rounded-3xl card-border bg-pine-900/40 p-8 sm:p-12 text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-bold">Not sure which valley fits your trip?</h3>
          <p className="text-pine-200/75 mt-3 max-w-md mx-auto">
            Tell us how many days you have and what you love — altitude, lakes, forts or forests —
            and we'll point you to the right route.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-sunset-400 text-pine-950 font-semibold hover:bg-sunset-300 transition-colors"
          >
            Ask our travel desk
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
