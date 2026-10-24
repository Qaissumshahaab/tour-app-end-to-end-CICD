import "@testing-library/jest-dom/vitest";

// Mock matchMedia for components that check browser preferences.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  }),
});

// Mock scrolling because JSDOM does not implement it.
window.scrollTo = () => {};

// Mock IntersectionObserver for Framer Motion viewport animations.
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    this.callback(
      [{ isIntersecting: false, target, intersectionRatio: 0 }],
      this,
    );
  }

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

// Mock SVG path measurements used by RoadDrive.
if (typeof SVGElement !== "undefined") {
  if (!SVGElement.prototype.getTotalLength) {
    SVGElement.prototype.getTotalLength = () => 700;
  }

  if (!SVGElement.prototype.getPointAtLength) {
    SVGElement.prototype.getPointAtLength = (length) => ({
      x: length,
      y: 0,
    });
  }
}
