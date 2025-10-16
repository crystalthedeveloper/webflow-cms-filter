/*!
 * webflow-cms-filter – multi-tag supported
 * usage: add data-filter-scope wrapper, buttons with data-filter, cards with data-filter-value="tag1, tag2"
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
      defaultToAll: true,
      activeStyles: null,
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

        // ✅ updated: reads active styles from each button (not scope)
        function setActive(btn) {
          buttons.forEach(b => {
            b.removeAttribute("aria-pressed");
            b.style.cssText = b.dataset._prevStyle || "";
          });

          if (btn) {
            btn.setAttribute("aria-pressed", "true");
            btn.dataset._prevStyle = btn.style.cssText;

            const activeBg = btn.getAttribute("data-active-bg");
            const activeColor = btn.getAttribute("data-active-color");
            const activeBorder = btn.getAttribute("data-active-border");

            if (activeBg) btn.style.backgroundColor = activeBg;
            if (activeColor) btn.style.color = activeColor;
            if (activeBorder) btn.style.border = activeBorder;
          }
        }

        // ✅ multi-tag supported filtering
        function apply(filterRaw) {
          const filter = s(filterRaw);
          let visible = 0;

          items().forEach(el => {
            const values = s(el.getAttribute("data-filter-value"))
              .split(",")
              .map(v => s(v.toLowerCase()));

            const show =
              filter === "all" ||
              filter === "" ||
              values.includes(filter.toLowerCase());

            el.style.display = show ? "" : "none";
            if (show) visible++;
          });

          if (emptyEl) {
            const none = visible === 0;
            emptyEl.style.display = none ? "" : "none";
            if (none) {
              emptyEl.textContent =
                filter && filter !== "all"
                  ? `No items found for ${filter}.`
                  : cfg.emptyText;
            }
          }
        }

        // ✅ click event listener
        scope.addEventListener("click", e => {
          const btn = e.target.closest(cfg.buttonSelector);
          if (!btn || !scope.contains(btn)) return;
          setActive(btn);
          apply(btn.getAttribute("data-filter"));
        });

        // ✅ initialization (URL or default)
        let initFilter = null;
        if (cfg.readURL) {
          const q = new URLSearchParams(location.search);
          initFilter =
            q.get("filter") ||
            (location.hash.startsWith("#filter=")
              ? location.hash.slice(8)
              : null);
        }

        if (initFilter) {
          const btn = buttons.find(
            b => s(b.getAttribute("data-filter")) === s(initFilter)
          );
          setActive(btn || null);
          apply(initFilter);
        } else if (cfg.defaultToAll) {
          const allBtn = buttons.find(
            b => s(b.getAttribute("data-filter")) === "all"
          );
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

  init();
  global.WebflowCMSFilter = { init };
})(window);
