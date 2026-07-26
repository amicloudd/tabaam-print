"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LOGO } from "@/lib/assets";
import { MOCKUPS } from "@/lib/mockups";

const N = MOCKUPS.length;

function shortestDist(i, active) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

export default function Hero() {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const logoRef = useRef(null);
  const captionRef = useRef(null);
  const mockupRefs = useRef([]);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const stateRef = useRef({
    isAnimating: true,
    dragging: false,
    dragStartX: 0,
    dragCurX: 0,
    logoBaseWidth: 1,
    reduce: false,
  });

  const spacing = useCallback(() => {
    const w = stageRef.current ? stageRef.current.clientWidth : 0;
    return Math.max(140, Math.min(w * 0.24, 230));
  }, []);

  const layout = useCallback(
    (activeIndex, extraDeltaPx = 0) => {
      const sp = spacing();
      mockupRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = shortestDist(i, activeIndex);
        const off = d * sp + extraDeltaPx;
        const absd = Math.abs(d);
        const scale = Math.max(0.58, 1 - absd * 0.17);
        const op = absd <= 2 ? Math.max(0, 1 - absd * 0.42) : 0;
        el.style.setProperty("--offset", off.toFixed(1) + "px");
        el.style.setProperty("--scale", scale.toFixed(3));
        el.style.setProperty("--op", op.toFixed(3));
        el.style.zIndex = 100 - absd * 10;
        el.style.pointerEvents = absd <= 1 ? "auto" : "none";
      });
    },
    [spacing]
  );

  const measureLogo = useCallback(() => {
    const logo = logoRef.current;
    if (!logo) return;
    logo.style.setProperty("--ls", "1");
    stateRef.current.logoBaseWidth = logo.offsetWidth || 1;
  }, []);

  const logoTargetFor = useCallback((i) => {
    const el = mockupRefs.current[i];
    const m = MOCKUPS[i];
    if (!el) return { dx: 0, dy: 0, scale: 1 };
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const dx = (m.spotX / 100 - 0.5) * w;
    const dy = (m.spotY / 100 - 0.5) * h;
    const scale = ((m.spotW / 100) * w) / stateRef.current.logoBaseWidth;
    return { dx, dy, scale };
  }, []);

  const setLogoTransform = useCallback((dx, dy, scale, delayMs = 0) => {
    const logo = logoRef.current;
    if (!logo) return;
    logo.style.transitionDelay = delayMs + "ms";
    logo.style.setProperty("--lx", dx.toFixed(1) + "px");
    logo.style.setProperty("--ly", dy.toFixed(1) + "px");
    logo.style.setProperty("--ls", scale.toFixed(3));
  }, []);

  const goTo = useCallback(
    (rawIndex, opts = {}) => {
      const st = stateRef.current;
      if (st.isAnimating && !opts.force) return;
      const newActive = ((rawIndex % N) + N) % N;
      st.isAnimating = true;
      activeRef.current = newActive;
      layout(newActive, 0);

      if (captionRef.current) captionRef.current.classList.add("is-out");
      setTimeout(() => {
        setActive(newActive);
        if (captionRef.current) captionRef.current.classList.remove("is-out");
      }, st.reduce ? 0 : 170);

      const delay = opts.introDelay != null ? opts.introDelay : st.reduce ? 0 : 180;
      const t = logoTargetFor(newActive);
      setLogoTransform(t.dx, t.dy, t.scale, delay);

      const total = delay + (st.reduce ? 0 : 640) + 60;
      setTimeout(() => {
        st.isAnimating = false;
      }, total);
    },
    [layout, logoTargetFor, setLogoTransform]
  );

  const endDrag = useCallback(() => {
    const st = stateRef.current;
    if (!st.dragging) return;
    st.dragging = false;
    mockupRefs.current.forEach((el) => {
      if (el) el.style.transition = "";
    });
    if (logoRef.current) {
      logoRef.current.style.transition = "";
      logoRef.current.style.opacity = "";
    }
    const delta = st.dragCurX - st.dragStartX;
    const sp = spacing();
    if (Math.abs(delta) > sp * 0.22) {
      goTo(activeRef.current + (delta < 0 ? 1 : -1), { introDelay: st.reduce ? 0 : 120 });
    } else {
      layout(activeRef.current, 0);
      const t = logoTargetFor(activeRef.current);
      setLogoTransform(t.dx, t.dy, t.scale, 0);
    }
  }, [layout, logoTargetFor, setLogoTransform, spacing, goTo]);

  const handlePointerDown = useCallback((e) => {
    const st = stateRef.current;
    if (st.isAnimating) return;
    st.dragging = true;
    st.dragStartX = e.clientX;
    st.dragCurX = e.clientX;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      /* noop */
    }
    mockupRefs.current.forEach((el) => {
      if (el) el.style.transition = "none";
    });
    if (logoRef.current) logoRef.current.style.transition = "none";
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      const st = stateRef.current;
      if (!st.dragging) return;
      st.dragCurX = e.clientX;
      const delta = st.dragCurX - st.dragStartX;
      layout(activeRef.current, delta);
      const fade = Math.max(0, 1 - Math.abs(delta) / (spacing() * 0.6));
      if (logoRef.current) logoRef.current.style.opacity = fade.toFixed(3);
    },
    [layout, spacing]
  );

  const handlePointerUp = useCallback(() => endDrag(), [endDrag]);
  const handlePointerLeave = useCallback(() => {
    if (stateRef.current.dragging) endDrag();
  }, [endDrag]);

  // keyboard navigation
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "ArrowLeft") goTo(activeRef.current - 1);
      if (e.key === "ArrowRight") goTo(activeRef.current + 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo]);

  // resize
  useEffect(() => {
    function onResize() {
      measureLogo();
      layout(activeRef.current, 0);
      if (!stateRef.current.dragging) {
        const t = logoTargetFor(activeRef.current);
        if (logoRef.current) logoRef.current.style.transition = "none";
        setLogoTransform(t.dx, t.dy, t.scale, 0);
        requestAnimationFrame(() => {
          if (logoRef.current) logoRef.current.style.transition = "";
        });
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureLogo, layout, logoTargetFor, setLogoTransform]);

  // intro choreography: logo alone -> empty mockups fade in -> logo lands -> controls fade in
  useEffect(() => {
    let cancelled = false;
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stateRef.current.reduce = reduce;

    function boot() {
      if (cancelled) return;
      measureLogo();
      layout(activeRef.current, 0);

      if (reduce) {
        const t0 = logoTargetFor(activeRef.current);
        setLogoTransform(t0.dx, t0.dy, t0.scale, 0);
        hero.classList.add("logo-in", "mockups-in", "ready");
        stateRef.current.isAnimating = false;
        return;
      }

      const t0r = logoTargetFor(activeRef.current);
      const heroScale = t0r.scale * 1.85;
      logoRef.current.style.transition = "none";
      setLogoTransform(0, -stage.clientHeight * 0.09, heroScale, 0);

      requestAnimationFrame(() => {
        if (cancelled) return;
        logoRef.current.style.transition = "";
        hero.classList.add("logo-in");

        setTimeout(() => {
          if (cancelled) return;
          hero.classList.add("mockups-in");

          setTimeout(() => {
            if (cancelled) return;
            const t = logoTargetFor(activeRef.current);
            setLogoTransform(t.dx, t.dy, t.scale, 0);

            setTimeout(() => {
              if (cancelled) return;
              hero.classList.add("ready");
              stateRef.current.isAnimating = false;
            }, 660);
          }, 480);
        }, 900);
      });
    }

    function startWhenVisible(fn) {
      if (document.visibilityState === "visible") {
        requestAnimationFrame(() => requestAnimationFrame(fn));
        return;
      }
      function handler() {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", handler);
          requestAnimationFrame(() => requestAnimationFrame(fn));
        }
      }
      document.addEventListener("visibilitychange", handler);
    }

    startWhenVisible(boot);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="hero" ref={heroRef} aria-label="Витрина бренда tabaam.print">
      <div
        id="stage"
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <div id="mockups">
          {MOCKUPS.map((m, i) => (
            <div
              className="mockup"
              key={m.slug}
              ref={(el) => {
                mockupRefs.current[i] = el;
              }}
              onClick={() => {
                if (i !== activeRef.current) goTo(i);
              }}
            >
              <div className="mockup-card">
                <img src={m.src} alt={m.alt} />
              </div>
            </div>
          ))}
        </div>

        <div id="logoLayer" ref={logoRef} aria-hidden="true">
          <img src={LOGO} alt="" />
        </div>

        <button className="arrow prev" type="button" aria-label="Предыдущее изделие" onClick={() => goTo(activeRef.current - 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 L8 12 L15 19" />
          </svg>
        </button>
        <button className="arrow next" type="button" aria-label="Следующее изделие" onClick={() => goTo(activeRef.current + 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5 L16 12 L9 19" />
          </svg>
        </button>
      </div>

      <div className="meta-bar">
        <span className="eyebrow-label">Рассчитать стоимость</span>
        <a className="caption" ref={captionRef} href={`/catalog/${MOCKUPS[active].slug}`}>
          <span className="caption-text">{MOCKUPS[active].alt}</span>
          <span className="caption-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
        <div className="dots" role="tablist" aria-label="Выбор изделия">
          {MOCKUPS.map((m, i) => (
            <button
              key={m.slug}
              type="button"
              className={"dot" + (i === active ? " is-active" : "")}
              aria-label={`Изделие ${i + 1}: ${m.alt}`}
              onClick={() => {
                if (i !== activeRef.current) goTo(i);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
