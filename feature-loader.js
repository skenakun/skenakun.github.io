(() => {
  "use strict";

  const loaded = new Map();

  function loadCss(href) {
    if (document.querySelector(`link[data-lazy-href="${href}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.lazyHref = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    if (document.querySelector(`script[data-lazy-src="${src}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.dataset.lazySrc = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function prepareFeature({ buttonId, css, js }) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const ensure = () => {
      if (!loaded.has(js)) {
        loaded.set(js, Promise.all([loadCss(css), loadScript(js)]).catch((error) => {
          loaded.delete(js);
          throw error;
        }));
      }
      return loaded.get(js);
    };

    // Preload only when the user shows intent. This avoids parsing large features
    // for visitors who only want to browse the gallery.
    button.addEventListener("pointerenter", ensure, { once: true, passive: true });
    button.addEventListener("focus", ensure, { once: true, passive: true });

    button.addEventListener("click", async (event) => {
      if (button.dataset.featureReady === "1") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      button.classList.add("feature-loading");
      button.setAttribute("aria-busy", "true");
      try {
        await ensure();
        button.dataset.featureReady = "1";
        button.classList.remove("feature-loading");
        button.removeAttribute("aria-busy");
        requestAnimationFrame(() => button.click());
      } catch (error) {
        console.error("Feature gagal dimuat", error);
        button.classList.remove("feature-loading");
        button.removeAttribute("aria-busy");
      }
    }, true);
  }

  prepareFeature({ buttonId: "miniGameBtn", css: "./minigame.css", js: "./minigame.js" });
  prepareFeature({ buttonId: "phoneSimBtn", css: "./androidsim.css", js: "./androidsim.js" });
})();
