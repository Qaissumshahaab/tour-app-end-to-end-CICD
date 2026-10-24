import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParallaxHero from '../components/ParallaxHero.jsx';
import Reveal from '../components/Reveal.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import Counter from '../components/Counter.jsx';
import RoadDrive from '../components/interactive/RoadDrive.jsx';
import { destinations, testimonials } from '../data/content.js';

const perks = [
  { title: 'Local Guides', desc: 'Born and raised in the valleys you\u2019ll visit.', icon: '🧭' },
  { title: 'Small Groups', desc: 'Max 12 travelers so every road stays flexible.', icon: '🏔️' },
  { title: 'Fair Pricing', desc: 'No hidden fees, transparent itinerary costs.', icon: '💳' },
  { title: '24/7 Support', desc: 'A real person on call throughout your trip.', icon: '📞' },
];

export default function Home() {
  return (
    <div>
      <ParallaxHero
        eyebrow="Northern Pakistan · Est. 2015"
        title={<>Discover the <span className="text-gradient">roof of the world</span></>}
        subtitle="Small-group journeys through Hunza, Skardu, Swat and the glacier valleys of the Karakoram — planned by people who grew up there."
      >
        <Link
          to="/packages"
          className="px-6 py-3 rounded-full bg-sunset-400 text-pine-950 font-semibold hover:bg-sunset-300 transition-colors"
        >
          View Tour Packages
        </Link>
        <Link
          to="/destinations"
          className="px-6 py-3 rounded-full glass text-pine-50 font-semibold hover:bg-white/10 transition-colors"
        >
          Explore Destinations
        </Link>
      </ParallaxHero>

      {/* Stats */}
      <section className="relative -mt-10 sm:-mt-14 z-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto glass rounded-3xl py-8 px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Counter to={9} suffix="+" label="Years Running" />
          <Counter to={4200} suffix="+" label="Travelers Guided" />
          <Counter to={30} suffix="+" label="Valleys Covered" />
          <Counter to={98} suffix="%" label="Would Travel Again" />
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-xl">
          <p className="text-sunset-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3">Why travel with us</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Built by people who live where the road ends</h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="rounded-2xl card-border bg-pine-900/40 p-6 hover:bg-pine-900/70 transition-colors">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="font-display font-semibold text-lg mt-4">{p.title}</h3>
              <p className="text-sm text-pine-200/70 mt-2 leading-relaxed">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <RoadDrive />

      {/* Featured destinations */}
      <section className="bg-pine-950/60 border-y border-white/5 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <Reveal className="max-w-xl">
              <p className="text-sunset-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3">Signature valleys</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">Featured destinations</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/destinations" className="text-sm font-semibold text-pine-100 hover:text-sunset-400 transition-colors">
                See all destinations →
              </Link>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 3).map((d, i) => (
              <DestinationCard key={d.id} d={d} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <Reveal className="max-w-xl mx-auto text-center">
          <p className="text-sunset-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3">Traveler stories</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">What our guests say</h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1} className="rounded-2xl card-border bg-pine-900/40 p-6">
              <p className="text-pine-100/90 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sunset-400 to-pine-500 flex items-center justify-center font-display font-bold text-pine-950">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-pine-50">{t.name}</p>
                  <p className="text-xs text-pine-300/70">{t.trip}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-4 sm:mx-6 mb-20 sm:mb-28 rounded-3xl overflow-hidden bg-aurora">
        <div className="relative z-10 px-6 sm:px-14 py-16 sm:py-20 text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl sm:text-4xl font-bold text-pine-50"
          >
            Your mountains are waiting
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-pine-100/80"
          >
            Tell us your dates and we'll build an itinerary around them.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/contact"
              className="inline-block mt-8 px-8 py-3.5 rounded-full bg-sunset-400 text-pine-950 font-semibold hover:bg-sunset-300 transition-colors"
            >
              Start Planning →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
