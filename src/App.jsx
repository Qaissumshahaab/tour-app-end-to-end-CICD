import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import usePerfMode from './hooks/usePerfMode.js';
import Home from './pages/Home.jsx';
import Destinations from './pages/Destinations.jsx';
import Packages from './pages/Packages.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
}

function PageWrapper({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  usePerfMode();
  const location = useLocation();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-stone-950">
        <Navbar />
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/destinations" element={<PageWrapper><Destinations /></PageWrapper>} />
            <Route path="/packages" element={<PageWrapper><Packages /></PageWrapper>} />
            <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </MotionConfig>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-24">
      <p className="text-6xl font-display font-bold text-gradient">404</p>
      <p className="text-pine-200/70 mt-3">This trail doesn't exist. Let's head back to base camp.</p>
      <a href="/" className="mt-6 px-6 py-3 rounded-full bg-sunset-400 text-pine-950 font-semibold">Back home</a>
    </div>
  );
}
