import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ParallaxHero from '../components/ParallaxHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { packages } from '../data/content.js';

const initial = { name: '', email: '', phone: '', package: packages[0].id, travelers: 2, message: '' };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please tell us your name';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address';
  if (!/^[0-9+\s-]{7,15}$/.test(values.phone)) errors.phone = 'Enter a valid phone number';
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      setValues(initial);
    }
  };

  return (
    <div>
      <ParallaxHero
        compact
        eyebrow="Plan your trip"
        title={<>Let's get you to the <span className="text-gradient">mountains</span></>}
        subtitle="Share a few details and our travel desk will reply within one business day with a full itinerary and quote."
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-5 gap-10">
        <Reveal className="lg:col-span-3 rounded-3xl card-border bg-pine-900/40 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  className="mx-auto h-16 w-16 rounded-full bg-pine-400/20 flex items-center justify-center text-3xl"
                >
                  ✓
                </motion.div>
                <h3 className="font-display text-2xl font-bold mt-6">Request received!</h3>
                <p className="text-pine-200/70 mt-2 max-w-sm mx-auto">
                  Thank you — our travel desk will reach out shortly with a tailored itinerary.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-sunset-400 hover:underline"
                >
                  Send another request
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="Ayesha Raza" />
                  <Field label="Phone number" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} placeholder="+92 3xx xxxxxxx" />
                </div>
                <Field label="Email address" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-pine-200/80 mb-1.5" htmlFor="package">
                      Interested package
                    </label>
                    <select
                      id="package"
                      name="package"
                      value={values.package}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-pine-950/60 border border-white/10 px-4 py-3 text-sm text-pine-50 focus:outline-none focus:ring-2 focus:ring-sunset-400"
                    >
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pine-200/80 mb-1.5" htmlFor="travelers">
                      Travelers
                    </label>
                    <input
                      id="travelers"
                      type="number"
                      min={1}
                      max={20}
                      name="travelers"
                      value={values.travelers}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-pine-950/60 border border-white/10 px-4 py-3 text-sm text-pine-50 focus:outline-none focus:ring-2 focus:ring-sunset-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pine-200/80 mb-1.5" htmlFor="message">
                    Tell us about your trip
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={values.message}
                    onChange={handleChange}
                    placeholder="Preferred dates, special occasions, must-see spots..."
                    className="w-full rounded-xl bg-pine-950/60 border border-white/10 px-4 py-3 text-sm text-pine-50 focus:outline-none focus:ring-2 focus:ring-sunset-400 resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-sunset-400 text-pine-950 font-semibold hover:bg-sunset-300 transition-colors"
                >
                  Send Request
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2 space-y-5">
          <InfoCard icon="📍" title="Office" lines={['Jutial, Gilgit', 'Gilgit-Baltistan, Pakistan']} />
          <InfoCard icon="📞" title="Call us" lines={['+92 300 0000000', 'Daily, 9am – 8pm PKT']} />
          <InfoCard icon="✉️" title="Email" lines={['hello@shimaaltours.pk', 'bookings@shimaaltours.pk']} />
          <InfoCard icon="🗓️" title="Best season" lines={['April – October for most valleys', 'June – Sept for high passes']} />
        </Reveal>
      </section>
    </div>
  );
}

function Field({ label, name, value, onChange, error, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-pine-200/80 mb-1.5" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl bg-pine-950/60 border px-4 py-3 text-sm text-pine-50 placeholder:text-pine-400/40 focus:outline-none focus:ring-2 transition-colors ${
          error ? 'border-red-400/60 focus:ring-red-400/50' : 'border-white/10 focus:ring-sunset-400'
        }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-red-300 mt-1.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({ icon, title, lines }) {
  return (
    <div className="rounded-2xl card-border bg-pine-900/40 p-5 flex items-start gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-display font-semibold text-pine-50">{title}</p>
        {lines.map((l) => (
          <p key={l} className="text-sm text-pine-200/70">{l}</p>
        ))}
      </div>
    </div>
  );
}
