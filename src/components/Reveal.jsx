import { motion } from 'framer-motion';

const dirs = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { y: 0, x: 28 },
  right: { y: 0, x: -28 },
  none: { y: 0, x: 0 },
};

export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  dir = 'up',
  className = '',
  once = true,
  amount = 0.25,
}) {
  const Comp = motion[as] || motion.div;
  const offset = dirs[dir] || dirs.up;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
