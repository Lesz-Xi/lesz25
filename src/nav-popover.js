// Liquid popover — menu01 engine lifted verbatim from the technique library
// (liquid_popover.md). Dependency-free: SDF smooth-union of trigger + panel
// traced into an SVG path per frame, driven by a hand-rolled spring integrator.
// Do not reimplement; adapt only via CSS custom properties on .menu-demo.

export function menu01(scope = document) {
  const roots = scope.querySelectorAll("[data-menu-01]");

  roots.forEach((root) => {
    if (root.dataset.menu01Initialized === "true") return;

    const trigger = root.querySelector("[data-menu-trigger]");
    const panel = root.querySelector("[data-menu-panel]");
    const blob = root.querySelector("[data-menu-blob]");
    const blobPath = root.querySelector("[data-menu-blob-path]");
    if (!trigger || !panel || !blob || !blobPath) return;

    root.dataset.menu01Initialized = "true";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const focusableSelector =
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const managesTriggerLabel =
      trigger.hasAttribute("data-open-label") ||
      trigger.hasAttribute("data-close-label");
    const openLabel =
      trigger.dataset.openLabel ||
      trigger.getAttribute("aria-label") ||
      "Open menu";
    const closeLabel = trigger.dataset.closeLabel || "Close menu";

    const STIFFNESS = { cx: 400, cy: 400, hw: 240, hh: 400, r: 400, shape: 160 };
    const DAMPING = { cx: 28, cy: 28, hw: 22, hh: 28, r: 28, shape: 25 };
    const REST_DIST = { cx: 0.1, cy: 0.1, hw: 0.1, hh: 0.1, r: 0.1, shape: 0.002 };
    const REST_SPEED = { cx: 1, cy: 1, hw: 1, hh: 1, r: 1, shape: 0.02 };
    const MAX_FRAME_DT = 1 / 30;
    const SUB_DT = 1 / 120;

    const NECK_SCALE = 1.6;
    const WALK_STEP = 4;
    const MAX_WALK_STEPS = 512;
    const PATH_POINTS = 96;

    const RECT_KEYS = ["cx", "cy", "hw", "hh", "r", "shape"];
    const rect = { cx: 0, cy: 0, hw: 0, hh: 0, r: 0, shape: 0 };
    const velocity = { cx: 0, cy: 0, hw: 0, hh: 0, r: 0, shape: 0 };
    const target = { cx: 0, cy: 0, hw: 0, hh: 0, r: 0, shape: 0 };

    let geometry = null;
    let effectiveR = 0;
    let animationFrame = 0;
    let resizeFrame = 0;
    let hoverCanSlide = false;
    let hoveredItem = null;
    let lastTime = 0;
    let onSettle = () => {};

    const clamp = (value, min = 0, max = 1) =>
      Math.min(max, Math.max(min, value));
    const clampRange = (value, min, max) =>
      Math.min(Math.max(value, min), Math.max(min, max));
    const format = (value) => Number(value.toFixed(2));

    const getItems = () => [...panel.querySelectorAll(focusableSelector)];
    const isOpen = () => root.classList.contains("is-open");

    const readPixelValue = (styles, name, fallback) => {
      const value = Number.parseFloat(styles.getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };

    const readLength = (value, relativeTo, fallback = 0) => {
      const trimmed = String(value).trim();
      const parsed = Number.parseFloat(trimmed);
      if (!Number.isFinite(parsed)) return fallback;
      if (trimmed.endsWith("%")) return (parsed / 100) * relativeTo;
      return parsed;
    };

    const readRadius = (element, width, height) => {
      const styles = getComputedStyle(element);
      const raw = styles.borderTopLeftRadius.split(" ")[0];
      const radius = readLength(raw, Math.min(width, height), 0);
      return clamp(radius, 0, Math.min(width, height) / 2);
    };

    const measurePanel = () => {
      const wasHidden = panel.hidden;
      const wasInert = panel.inert;

      panel.classList.add("is-measuring");
      panel.hidden = false;
      panel.inert = true;

      const bounds = panel.getBoundingClientRect();
      const size = {
        width: Math.max(1, Math.ceil(bounds.width)),
        height: Math.max(1, Math.ceil(bounds.height)),
      };

      panel.hidden = wasHidden;
      panel.inert = wasInert;
      panel.classList.remove("is-measuring");

      return size;
    };

    const getGeometry = () => {
      const styles = getComputedStyle(root);
      const gap = readPixelValue(styles, "--menu-gap", 12);
      const padding = readPixelValue(styles, "--blob-padding", 44);
      const viewportPadding = readPixelValue(styles, "--viewport-padding", 20);
      const placement = root.dataset.placement === "bottom" ? "bottom" : "top";
      const align = ["start", "end"].includes(root.dataset.align)
        ? root.dataset.align
        : "center";

      const rootBounds = root.getBoundingClientRect();
      const triggerBounds = trigger.getBoundingClientRect();
      const panelSize = measurePanel();
      const panelWidth = panelSize.width;
      const panelHeight = panelSize.height;

      const triggerBox = {
        left: triggerBounds.left - rootBounds.left,
        top: triggerBounds.top - rootBounds.top,
        width: Math.max(1, triggerBounds.width),
        height: Math.max(1, triggerBounds.height),
      };
      triggerBox.right = triggerBox.left + triggerBox.width;
      triggerBox.bottom = triggerBox.top + triggerBox.height;

      let panelLeft = triggerBox.left + triggerBox.width / 2 - panelWidth / 2;
      if (align === "start") panelLeft = triggerBox.left;
      if (align === "end") panelLeft = triggerBox.right - panelWidth;

      let panelTop =
        placement === "bottom"
          ? triggerBox.bottom + gap
          : triggerBox.top - gap - panelHeight;

      const minLeft = viewportPadding - rootBounds.left;
      const maxLeft =
        window.innerWidth - viewportPadding - rootBounds.left - panelWidth;
      const minTop = viewportPadding - rootBounds.top;
      const maxTop =
        window.innerHeight - viewportPadding - rootBounds.top - panelHeight;

      panelLeft = clampRange(panelLeft, minLeft, maxLeft);
      panelTop = clampRange(panelTop, minTop, maxTop);

      const panelBox = {
        left: panelLeft,
        top: panelTop,
        width: panelWidth,
        height: panelHeight,
      };
      panelBox.right = panelBox.left + panelBox.width;
      panelBox.bottom = panelBox.top + panelBox.height;

      const unionLeft = Math.min(triggerBox.left, panelBox.left) - padding;
      const unionTop = Math.min(triggerBox.top, panelBox.top) - padding;
      const unionRight = Math.max(triggerBox.right, panelBox.right) + padding;
      const unionBottom = Math.max(triggerBox.bottom, panelBox.bottom) + padding;

      const triggerRadius = readRadius(
        trigger,
        triggerBox.width,
        triggerBox.height,
      );
      const panelRadius = readRadius(panel, panelBox.width, panelBox.height);

      return {
        width: Math.ceil(unionRight - unionLeft),
        height: Math.ceil(unionBottom - unionTop),
        originLeft: unionLeft,
        originTop: unionTop,
        neckK: Math.max(
          8,
          Math.min(triggerBox.width, triggerBox.height) * 0.5 * NECK_SCALE,
        ),
        trigger: {
          cx: triggerBox.left + triggerBox.width / 2 - unionLeft,
          cy: triggerBox.top + triggerBox.height / 2 - unionTop,
          hw: triggerBox.width / 2,
          hh: triggerBox.height / 2,
          r: triggerRadius,
        },
        panel: {
          left: panelBox.left,
          top: panelBox.top,
          x: panelBox.left - unionLeft,
          y: panelBox.top - unionTop,
          cx: panelBox.left + panelBox.width / 2 - unionLeft,
          cy: panelBox.top + panelBox.height / 2 - unionTop,
          hw: panelBox.width / 2,
          hh: panelBox.height / 2,
          r: panelRadius,
        },
      };
    };

    const closedRect = () => ({
      cx: geometry.trigger.cx,
      cy: geometry.trigger.cy,
      hw: geometry.trigger.hw,
      hh: geometry.trigger.hh,
      r: geometry.trigger.r,
      shape: 0,
    });

    const openRect = () => ({
      cx: geometry.panel.cx,
      cy: geometry.panel.cy,
      hw: geometry.panel.hw,
      hh: geometry.panel.hh,
      r: geometry.panel.r,
      shape: 1,
    });

    const sdRoundRect = (px, py, cx, cy, hw, hh, r) => {
      const safeR = clamp(r, 0, Math.min(hw, hh));
      const qx = Math.abs(px - cx) - hw + safeR;
      const qy = Math.abs(py - cy) - hh + safeR;
      return (
        Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
        Math.min(Math.max(qx, qy), 0) -
        safeR
      );
    };

    const smin = (a, b, k) => {
      if (k <= 0) return Math.min(a, b);
      const h = Math.max(k - Math.abs(a - b), 0) / k;
      return Math.min(a, b) - (h * h * h * k) / 6;
    };

    const field = (x, y, k) => {
      const triggerField = sdRoundRect(
        x,
        y,
        geometry.trigger.cx,
        geometry.trigger.cy,
        geometry.trigger.hw,
        geometry.trigger.hh,
        geometry.trigger.r,
      );
      const panelField = sdRoundRect(
        x,
        y,
        rect.cx,
        rect.cy,
        rect.hw,
        rect.hh,
        effectiveR,
      );
      return smin(triggerField, panelField, k);
    };

    const traceOutline = (k) => {
      const maxRay = Math.hypot(geometry.width, geometry.height) + WALK_STEP;
      let inside = 0;
      let outside = -1;
      for (let i = 1; i <= 48; i += 1) {
        const distance = (i / 48) * maxRay;
        if (field(rect.cx + distance, rect.cy, k) >= 0) {
          outside = distance;
          break;
        }
        inside = distance;
      }
      if (outside < 0) outside = maxRay;
      for (let i = 0; i < 12; i += 1) {
        const mid = (inside + outside) / 2;
        if (field(rect.cx + mid, rect.cy, k) < 0) inside = mid;
        else outside = mid;
      }

      const seedX = rect.cx + (inside + outside) / 2;
      const seedY = rect.cy;
      const closeDistance = WALK_STEP * WALK_STEP * 1.44;
      const points = [];
      let x = seedX;
      let y = seedY;

      for (let i = 0; i < MAX_WALK_STEPS; i += 1) {
        let gx = field(x + 0.5, y, k) - field(x - 0.5, y, k);
        let gy = field(x, y + 0.5, k) - field(x, y - 0.5, k);
        const length = Math.hypot(gx, gy) || 1;
        x += (-gy / length) * WALK_STEP;
        y += (gx / length) * WALK_STEP;

        for (let j = 0; j < 2; j += 1) {
          const distance = field(x, y, k);
          if (Math.abs(distance) < 0.05) break;
          gx = field(x + 0.5, y, k) - field(x - 0.5, y, k);
          gy = field(x, y + 0.5, k) - field(x, y - 0.5, k);
          const squared = gx * gx + gy * gy;
          if (squared < 1e-9) break;
          x -= (distance * gx) / squared;
          y -= (distance * gy) / squared;
        }

        points.push({ x, y });

        if (i > 16) {
          const dx = x - seedX;
          const dy = y - seedY;
          if (dx * dx + dy * dy < closeDistance) break;
        }
      }

      const count = points.length;
      if (count < 5) return points;

      const smoothed = points.map((point, index) => {
        const previous = points[(index - 1 + count) % count];
        const next = points[(index + 1) % count];
        return {
          x: point.x * 0.5 + (previous.x + next.x) * 0.25,
          y: point.y * 0.5 + (previous.y + next.y) * 0.25,
        };
      });
      const stride = Math.max(1, Math.round(count / PATH_POINTS));
      if (stride === 1) return smoothed;

      const decimated = [];
      for (let i = 0; i < count; i += stride) decimated.push(smoothed[i]);
      return decimated;
    };

    const buildPath = (points, dx, dy) => {
      const length = points.length;
      if (!length) return "";
      let path = `M ${format(points[0].x + dx)} ${format(points[0].y + dy)}`;

      for (let index = 0; index < length; index += 1) {
        const previous = points[(index - 1 + length) % length];
        const current = points[index];
        const next = points[(index + 1) % length];
        const afterNext = points[(index + 2) % length];
        const cp1x = current.x + (next.x - previous.x) / 6;
        const cp1y = current.y + (next.y - previous.y) / 6;
        const cp2x = next.x - (afterNext.x - current.x) / 6;
        const cp2y = next.y - (afterNext.y - current.y) / 6;

        path += ` C ${format(cp1x + dx)} ${format(cp1y + dy)} ${format(cp2x + dx)} ${format(cp2y + dy)} ${format(next.x + dx)} ${format(next.y + dy)}`;
      }

      return `${path} Z`;
    };

    const render = () => {
      if (!geometry) return;

      const progress = clamp(rect.shape);
      const bell = 4 * progress * (1 - progress);
      const k = geometry.neckK * bell;
      const maxR = Math.min(rect.hw, rect.hh);
      const baseR = clamp(rect.r, 0, maxR);
      const radiusResolve = clamp((progress - 0.3) / 0.55);
      const radiusEase = radiusResolve * radiusResolve * (3 - 2 * radiusResolve);
      const extraRoundness = Math.sin(Math.PI * progress) * (1 - radiusEase);
      effectiveR = baseR + (maxR - baseR) * extraRoundness;

      const points = traceOutline(k);
      const path = buildPath(points, 0, 0);
      if (!path) return;

      blobPath.setAttribute("d", path);
      panel.style.clipPath = `path("${buildPath(
        points,
        -geometry.panel.x,
        -geometry.panel.y,
      )}")`;
    };

    const measure = () => {
      geometry = getGeometry();
      blob.setAttribute("viewBox", `0 0 ${geometry.width} ${geometry.height}`);
      blob.style.left = `${geometry.originLeft}px`;
      blob.style.top = `${geometry.originTop}px`;
      blob.style.width = `${geometry.width}px`;
      blob.style.height = `${geometry.height}px`;
      panel.style.left = `${geometry.panel.left}px`;
      panel.style.top = `${geometry.panel.top}px`;
    };

    const setTarget = (next) => {
      RECT_KEYS.forEach((key) => {
        target[key] = next[key];
      });
    };

    const snapToTarget = () => {
      RECT_KEYS.forEach((key) => {
        rect[key] = target[key];
        velocity[key] = 0;
      });
    };

    const tick = (now) => {
      animationFrame = 0;
      const dt = Math.min((now - lastTime) / 1000, MAX_FRAME_DT) || SUB_DT;
      lastTime = now;
      const steps = Math.max(1, Math.ceil(dt / SUB_DT));
      const h = dt / steps;

      for (let i = 0; i < steps; i += 1) {
        RECT_KEYS.forEach((key) => {
          velocity[key] +=
            (STIFFNESS[key] * (target[key] - rect[key]) -
              DAMPING[key] * velocity[key]) *
            h;
          rect[key] += velocity[key] * h;
        });
      }

      const atRest = RECT_KEYS.every(
        (key) =>
          Math.abs(target[key] - rect[key]) < REST_DIST[key] &&
          Math.abs(velocity[key]) < REST_SPEED[key],
      );

      if (atRest) {
        snapToTarget();
        render();
        onSettle();
        return;
      }

      render();
      animationFrame = window.requestAnimationFrame(tick);
    };

    const animateTo = (next, settle = () => {}) => {
      onSettle = settle;
      setTarget(next);

      if (reduceMotion.matches) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        snapToTarget();
        render();
        settle();
        return;
      }

      if (!animationFrame) {
        lastTime = performance.now();
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    const setPanelHidden = (hidden) => {
      panel.hidden = hidden;
      panel.inert = hidden;
    };

    const setTriggerOpen = (open) => {
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      if (!managesTriggerLabel) return;

      trigger.setAttribute("aria-label", open ? closeLabel : openLabel);
    };

    const setHoverPosition = (item) => {
      hoveredItem = item;
      panel.style.setProperty("--menu-hover-y", `${item.offsetTop}px`);
    };

    const snapHoverTo = (item) => {
      panel.classList.add("is-hover-instant");
      setHoverPosition(item);
      panel.offsetHeight;
      panel.classList.remove("is-hover-instant");
    };

    const activateHover = (item) => {
      if (hoverCanSlide) {
        setHoverPosition(item);
      } else {
        panel.classList.remove("is-hover-visible");
        snapHoverTo(item);
      }

      panel.classList.add("is-hover-visible");
      hoverCanSlide = true;
    };

    const resetHover = () => {
      hoverCanSlide = false;
      hoveredItem = null;
      panel.classList.remove("is-hover-instant", "is-hover-visible");
    };

    const focusEdgeItem = (edge) => {
      const items = getItems();
      const item = edge === "last" ? items[items.length - 1] : items[0];

      item?.focus({ preventScroll: true });
    };

    const focusItem = (direction) => {
      const items = getItems();
      if (!items.length) return;

      const activeIndex = items.indexOf(document.activeElement);
      const nextIndex =
        direction === "previous"
          ? (activeIndex - 1 + items.length) % items.length
          : (activeIndex + 1) % items.length;

      items[nextIndex].focus({ preventScroll: true });
    };

    const openMenu = ({ focusFirst = false, focusLast = false } = {}) => {
      if (isOpen()) {
        if (focusFirst) focusEdgeItem("first");
        if (focusLast) focusEdgeItem("last");
        return;
      }

      root.classList.remove("is-closing");
      measure();
      if (!animationFrame) {
        setTarget(closedRect());
        snapToTarget();
        render();
      }

      setPanelHidden(false);
      root.classList.add("is-open");
      setTriggerOpen(true);
      animateTo(openRect());

      if (focusFirst) focusEdgeItem("first");
      if (focusLast) focusEdgeItem("last");
    };

    const closeMenu = ({ restoreFocus = false } = {}) => {
      if (!isOpen()) return;

      resetHover();
      root.classList.add("is-closing");
      root.classList.remove("is-open");
      panel.inert = true;
      setTriggerOpen(false);

      if (restoreFocus) {
        trigger.focus({ preventScroll: true });
      }

      animateTo(closedRect(), () => {
        if (!isOpen()) {
          setPanelHidden(true);
          root.classList.remove("is-closing");
        }
      });
    };

    trigger.addEventListener("click", (event) => {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu({ focusFirst: event.detail === 0 });
      }
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      event.preventDefault();
      openMenu({
        focusFirst: event.key === "ArrowDown",
        focusLast: event.key === "ArrowUp",
      });
    });

    if (finePointer.matches) {
      // Hover intent: entering the trigger opens the menu; leaving the whole
      // root (trigger + panel) closes it after a short grace period so the
      // pointer can cross the gap between the two without a flicker.
      let closeTimer = 0;
      const cancelClose = () => {
        if (!closeTimer) return;
        window.clearTimeout(closeTimer);
        closeTimer = 0;
      };
      const scheduleClose = () => {
        cancelClose();
        closeTimer = window.setTimeout(() => {
          closeTimer = 0;
          closeMenu();
        }, 220);
      };

      root.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "touch") return;
        cancelClose();
        openMenu();
      });

      root.addEventListener("pointerleave", (event) => {
        if (event.pointerType === "touch") return;
        scheduleClose();
      });

      getItems().forEach((item) => {
        item.addEventListener("pointerenter", () => {
          activateHover(item);
        });
      });

      panel.addEventListener("pointerleave", resetHover);
    }

    panel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("[data-menu-item]")) return;

      closeMenu({ restoreFocus: true });
    });

    panel.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        window.setTimeout(() => {
          if (isOpen() && !panel.contains(document.activeElement)) {
            closeMenu();
          }
        });
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu({ restoreFocus: true });
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        focusItem(event.key === "ArrowUp" ? "previous" : "next");
        return;
      }

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        focusEdgeItem(event.key === "End" ? "last" : "first");
      }
    });

    root.addEventListener("focusout", (event) => {
      if (!isOpen()) return;

      const next = event.relatedTarget;
      if (
        next === trigger ||
        (next instanceof Node && panel.contains(next))
      ) {
        return;
      }

      closeMenu();
    });

    document.addEventListener("pointerdown", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!isOpen() || root.contains(target)) return;

      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !isOpen()) return;

      event.preventDefault();
      closeMenu({ restoreFocus: true });
    });

    const refreshGeometry = () => {
      measure();
      setTarget(isOpen() ? openRect() : closedRect());
      if (!animationFrame) {
        snapToTarget();
        render();
      }

      if (hoveredItem) snapHoverTo(hoveredItem);
    };

    const queueGeometryRefresh = () => {
      if (resizeFrame) return;

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        refreshGeometry();
      });
    };

    window.addEventListener("resize", queueGeometryRefresh, { passive: true });
    document.fonts?.ready.then(queueGeometryRefresh);

    setPanelHidden(true);
    setTriggerOpen(false);
    refreshGeometry();
  });
}

export function initNavPopover() {
  menu01();
}
