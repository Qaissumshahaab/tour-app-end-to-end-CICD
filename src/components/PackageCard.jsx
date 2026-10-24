import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const diffColor = {
  Easy: 'bg-pine-400/20 text-pine-300',
  Moderate: 'bg-sunset-400/20 text-sunset-400',
  Challenging: 'bg-red-400/20 text-red-300',
};

export default function PackageCard({ pkg, index = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07 }}
      className="rounded-3xl card-border bg-pine-900/40 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${diffColor[pkg.difficulty]}`}>
              {pkg.difficulty}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-pine-100">
              {pkg.days} Days
            </span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-pine-50">{pkg.name}</h3>
          <p className="text-sm text-pine-200/70 mt-1 max-w-md">{pkg.desc}</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <p className="font-display text-xl font-bold text-gradient">
            Rs {pkg.price.toLocaleString()}
          </p>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pine-100"
          >
            ↓
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/10">
              <p className="text-xs uppercase tracking-wider text-pine-300 mb-3 mt-4">Trip highlights</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {pkg.highlights.map((h) => (
                  <span key={h} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-pine-100/85">
                    {h}
                  </span>
                ))}
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-sunset-400 text-pine-950 px-5 py-2.5 rounded-full hover:bg-sunset-300 transition-colors"
              >
                Reserve this trip →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
