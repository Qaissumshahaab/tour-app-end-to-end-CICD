import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Reveal from './Reveal.jsx';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative bg-pine-950 border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <Reveal>
          <Logo className="h-10 w-10" />
          <p className="mt-4 text-sm text-pine-200/80 leading-relaxed max-w-xs">
            Local experts guiding travelers through Hunza, Skardu, Swat and beyond — small groups,
            real roads, unforgettable skies.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h4 className="font-display font-semibold mb-4 text-pine-100">Explore</h4>
          <ul className="space-y-2 text-sm text-pine-200/80">
            <li><Link to="/destinations" className="hover:text-sunset-400 transition-colors">Destinations</Link></li>
            <li><Link to="/packages" className="hover:text-sunset-400 transition-colors">Tour Packages</Link></li>
            <li><Link to="/gallery" className="hover:text-sunset-400 transition-colors">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-sunset-400 transition-colors">Book Now</Link></li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <h4 className="font-display font-semibold mb-4 text-pine-100">Company</h4>
          <ul className="space-y-2 text-sm text-pine-200/80">
            <li>About Shimaal Tours</li>
            <li>Travel Safety</li>
            <li>Responsible Tourism</li>
            <li>Careers</li>
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <h4 className="font-display font-semibold mb-4 text-pine-100">Get in touch</h4>
          <ul className="space-y-2 text-sm text-pine-200/80">
            <li>Gilgit-Baltistan, Pakistan</li>
            <li>+92 300 0000000</li>
            <li>hello@shimaaltours.pk</li>
          </ul>
        </Reveal>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-pine-300/60">
        © {currentYear} Shimaal Tours & Treks. All rights reserved.
      </div>
    </footer>
  );
}
