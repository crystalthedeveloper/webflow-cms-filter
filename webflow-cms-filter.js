/*!
 * webflow-cms-filter – single-file
 * usage: add data-filter-scope wrapper, buttons with data-filter, cards with data-filter-value
 */
(function (global) {
  function ready(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive")
      requestAnimationFrame(fn);
    else
      document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(fn));
  }

  const s = v => String(v || "").trim();

  function init(opts = {}) {
    const cfg = {
      scopeSelector: "[data-filter-scope]",
      buttonSelector: "[data-filter]",
      itemSelector: "[data-filter-value]",
      emptySelector: "[data-empty]",
      readURL: true,
      defaultToAll: true, // shows all items by default
      activeStyles: null, // now handled by attributes
      createEmptyIfMissing: false,
      emptyText: "No items found.",
      ...opts
    };

    ready(() => {
      document.querySelectorAll(cfg.scopeSelector).forEach(scope => {
        const buttons = [...scope.querySelectorAll(cfg.buttonSelector)];
        if (!buttons.length) return;

        let emptyEl = scope.querySelector(cfg.emptySelector);
        if (!emptyEl && cfg.createEmptyIfMissing) {
          emptyEl = document.createElement("p");
          emptyEl.setAttribute("data-empty", "");
          emptyEl.style.display = "none";
          emptyEl.textContent = cfg.emptyText;
          scope.appendChild(emptyEl);
        }

        const items = () => [...scope.querySelectorAll(cfg.itemSelector)];

        function setActive(btn) {
          const activeBg = scope.getAttribute("data-active-bg") || "#000";
          const activeColor = scope.getAttribute("data-active-color") || "#fff";
          const activeBorder = scope.getAttribute("data-active-border") || "";

          buttons.forEach(b => {
            b.removeAttribute("aria-pressed");
            b.style.cssText = b.dataset._prevStyle || "";
          });

          if (btn) {
            btn.setAttribute("aria-pressed", "true");
            btn.dataset._prevStyle = btn.style.cssText;
            btn.style.backgroundColor = activeBg;
            btn.style.color = activeColor;
            if (activeBorder) btn.style.border = activeBorder;
          }
        }

        function apply(filterRaw) {
          const filter = s(filterRaw);
          let visible = 0;
          items().forEach(el => {
            const show = (filter === "all" || filter === "" || s(el.getAttribute("data-filter-value")) === filter);
            el.style.display = show ? "" : "none";
            if (show) visible++;
          });

          if (emptyEl) {
            const none = visible === 0;
            emptyEl.style.display = none ? "" : "none";
            if (none) {
              emptyEl.textContent =
                (filter && filter !== "all")
                  ? `No items found for ${filter}.`
                  : cfg.emptyText;
            }
          }
        }

        scope.addEventListener("click", e => {
          const btn = e.target.closest(cfg.buttonSelector);
          if (!btn || !scope.contains(btn)) return;
          setActive(btn);
          apply(btn.getAttribute("data-filter"));
        });

        // init
        let initFilter = null;
        if (cfg.readURL) {
          const q = new URLSearchParams(location.search);
          initFilter = q.get("filter") || (location.hash.startsWith("#filter=") ? location.hash.slice(8) : null);
        }

        if (initFilter) {
          const btn = buttons.find(b => s(b.getAttribute("data-filter")) === s(initFilter));
          setActive(btn || null);
          apply(initFilter);
        } else if (cfg.defaultToAll) {
          const allBtn = buttons.find(b => s(b.getAttribute("data-filter")) === "all");
          if (allBtn) {
            setActive(allBtn);
            apply("all");
          } else {
            apply("all");
          }
        } else {
          buttons[0]?.click();
        }
      });
    });
  }

  // auto-init with defaults; expose for custom init if needed
  init();
  global.WebflowCMSFilter = { init };
})(window);
