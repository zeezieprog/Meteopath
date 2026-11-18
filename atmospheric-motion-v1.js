/* METEOPATH / cinematic atmospheric background — lightweight motion controller */
(() => {
  "use strict";
  const boot = () => {
    const hero = document.querySelector(".hero");
    const layer = hero?.querySelector(".motion-atmosphere");
    if (!hero || !layer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let onScreen = true;
    const updatePause = () => {
      const paused = document.hidden || !onScreen;
      layer.classList.toggle("motion-paused", paused);
    };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        onScreen = !!entries[0]?.isIntersecting;
        updatePause();
      }, { threshold: 0.01 });
      observer.observe(hero);
    }
    document.addEventListener("visibilitychange", updatePause, { passive: true });
    updatePause();

    // Gentle pointer parallax for desktop only; does not alter text position.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = null;
    const setOffset = (x, y) => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        layer.style.setProperty("--motion-x", x + "px");
        layer.style.setProperty("--motion-y", y + "px");
        frame = null;
      });
    };
    hero.addEventListener("pointermove", event => {
      if (event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      setOffset(Math.round(-x * 12), Math.round(-y * 8));
    }, { passive: true });
    hero.addEventListener("pointerleave", () => setOffset(0, 0), { passive: true });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();