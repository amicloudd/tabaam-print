"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BRIEF_SECTIONS, BRIEF_MATERIALS, BRIEF_DOCX } from "@/lib/brief";

const WHATSAPP_PHONE = "79282699936";
const STORAGE_KEY = "tabaam-brief-v1";
const CLARIFY_ID = "10.clarify";

const ALL_QUESTIONS = BRIEF_SECTIONS.flatMap((s, si) =>
  s.questions.map((q) => ({ ...q, sectionId: s.id, sectionNo: si + 1 }))
);
const REQUIRED = ALL_QUESTIONS.filter((q) => q.required);

function isAnswered(a) {
  if (!a) return false;
  return Boolean(a.text?.trim()) || (a.picks?.length ?? 0) > 0 || Boolean(a.scales);
}

function scaleLabel([left, right], value) {
  if (value <= 20) return left.toLowerCase();
  if (value < 40) return `скорее ${left.toLowerCase()}`;
  if (value <= 60) return `между «${left.toLowerCase()}» и «${right.toLowerCase()}»`;
  if (value < 80) return `скорее ${right.toLowerCase()}`;
  return right.toLowerCase();
}

function formatAnswer(q, a) {
  if (!isAnswered(a)) return null;
  const parts = [];
  if (a.picks?.length) parts.push(a.picks.join(", "));
  if (a.scales && q.scales) parts.push(q.scales.map((pair, i) => scaleLabel(pair, a.scales[i])).join("; "));
  if (a.text?.trim()) parts.push(a.text.trim());
  return parts.join(". ");
}

function buildText(answers, materials) {
  const lines = ["БРИФ НА ФИРМЕННЫЙ СТИЛЬ — tabaam.print", ""];
  BRIEF_SECTIONS.forEach((s, si) => {
    lines.push(`${si + 1}. ${s.title.toUpperCase()}`);
    s.questions.forEach((q) => {
      lines.push(`${q.id} ${q.q}${q.required ? "*" : ""}`);
      lines.push(`— ${formatAnswer(q, answers[q.id]) ?? "нет ответа"}`);
    });
    lines.push("");
  });
  lines.push("10. МАТЕРИАЛЫ И ЧТО УТОЧНИТЬ");
  BRIEF_MATERIALS.forEach((m, i) => lines.push(`${materials[i] ? "[x]" : "[ ]"} ${m}`));
  const clarify = answers[CLARIFY_ID]?.text?.trim();
  if (clarify) {
    lines.push("Что уточнить:");
    lines.push(clarify);
  }
  return lines.join("\n");
}

function Icon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "check":
      return <svg {...common}><path d="m5 12 5 5L19 7" /></svg>;
    case "arrow":
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "back":
      return <svg {...common}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case "download":
      return <svg {...common}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>;
    case "copy":
      return <svg {...common}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
    case "reset":
      return <svg {...common}><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" /></svg>;
    case "doc":
      return <svg {...common}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>;
    default:
      return null;
  }
}

function Ring({ value, done }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg className={`bf-ring${done ? " is-done" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r={r} className="bf-ring-track" />
      <circle
        cx="12"
        cy="12"
        r={r}
        className="bf-ring-fill"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
      />
      {done && <path d="m8.5 12.2 2.4 2.4 4.6-4.8" className="bf-ring-check" />}
    </svg>
  );
}

function AutoTextarea({ value, onChange, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return <textarea ref={ref} rows={2} value={value} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

function LogoPreview({ text }) {
  const word = text.split("\n")[0].trim();
  if (!word) return null;
  return (
    <div className="bf-logo-preview" aria-label="Предпросмотр написания">
      <span className="bf-logo-preview-label">Так это может выглядеть</span>
      <div className="bf-logo-preview-row">
        <span className="bf-logo-serif">{word}</span>
        <span className="bf-logo-caps">{word}</span>
        <span className="bf-logo-light">{word.toLowerCase()}</span>
      </div>
    </div>
  );
}

function Question({ q, answer, onChange }) {
  const a = answer ?? {};
  const answered = isAnswered(a);
  const update = (patch) => onChange(q.id, { ...a, ...patch });

  const togglePick = (opt) => {
    const picks = a.picks ?? [];
    if (q.kind === "choice") {
      update({ picks: picks[0] === opt ? [] : [opt] });
    } else {
      update({ picks: picks.includes(opt) ? picks.filter((p) => p !== opt) : [...picks, opt] });
    }
  };

  const scales = a.scales ?? q.scales?.map(() => 50);

  return (
    <div className={`bf-q${answered ? " is-answered" : ""}`} id={`q-${q.id}`}>
      <div className="bf-q-head">
        <span className="bf-q-no">{q.id}</span>
        <label className="bf-q-text" htmlFor={`a-${q.id}`}>
          {q.q}
          {q.required && <span className="bf-req" title="Обязательный вопрос">*</span>}
        </label>
        <span className="bf-q-mark" aria-hidden="true"><Icon name="check" /></span>
      </div>

      {(q.kind === "choice" || q.kind === "multi") && (
        <div className="bf-chips" role="group" aria-label={q.kind === "multi" ? "Можно выбрать несколько" : "Выберите один вариант"}>
          {q.options.map((opt) => {
            const on = a.picks?.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                className={`bf-chip${on ? " is-on" : ""}`}
                aria-pressed={on}
                onClick={() => togglePick(opt)}
              >
                {q.kind === "multi" && <span className="bf-chip-box" aria-hidden="true"><Icon name="check" /></span>}
                {opt}
              </button>
            );
          })}
          {q.kind === "multi" && <span className="bf-chips-hint">можно несколько</span>}
        </div>
      )}

      {q.kind === "scales" && (
        <div className="bf-scales">
          {q.scales.map(([left, right], i) => (
            <div className="bf-scale" key={left}>
              <span className={`bf-scale-pole${scales[i] < 40 ? " is-lead" : ""}`}>{left}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={scales[i]}
                aria-label={`${left} — ${right}`}
                onChange={(e) => {
                  const next = [...scales];
                  next[i] = Number(e.target.value);
                  update({ scales: next });
                }}
              />
              <span className={`bf-scale-pole${scales[i] > 60 ? " is-lead" : ""}`}>{right}</span>
            </div>
          ))}
        </div>
      )}

      <AutoTextarea
        id={`a-${q.id}`}
        className="bf-input"
        value={a.text ?? ""}
        onChange={(text) => update({ text })}
        placeholder={q.placeholder ?? (q.kind ? "Комментарий, если нужно" : "Ваш ответ")}
      />

      {q.preview && <LogoPreview text={a.text ?? ""} />}
    </div>
  );
}

export default function Brief() {
  const [answers, setAnswers] = useState({});
  const [materials, setMaterials] = useState(() => BRIEF_MATERIALS.map(() => false));
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(BRIEF_SECTIONS[0].id);
  const [copied, setCopied] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.answers) setAnswers(saved.answers);
      if (Array.isArray(saved?.materials)) setMaterials(saved.materials);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, materials }));
    } catch {}
  }, [answers, materials, loaded]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.dataset.section);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    document.querySelectorAll("[data-section]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // keep the active chip visible in the horizontal mobile nav
  useEffect(() => {
    const nav = navRef.current;
    const el = nav?.querySelector(`[data-nav="${active}"]`);
    if (!nav || !el || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const stats = useMemo(() => {
    const perSection = BRIEF_SECTIONS.map((s) => {
      const done = s.questions.filter((q) => isAnswered(answers[q.id])).length;
      return { id: s.id, done, total: s.questions.length };
    });
    const answered = ALL_QUESTIONS.filter((q) => isAnswered(answers[q.id])).length;
    const missing = REQUIRED.filter((q) => !isAnswered(answers[q.id]));
    return { perSection, answered, missing };
  }, [answers]);

  const materialsDone = materials.filter(Boolean).length;
  const progress = stats.answered / ALL_QUESTIONS.length;
  const text = useMemo(() => buildText(answers, materials), [answers, materials]);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    `Здравствуйте! Заполнил(а) бриф на фирменный стиль.\n\n${text}`
  )}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "бриф-tabaam-print.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (!window.confirm("Очистить все ответы брифа?")) return;
    setAnswers({});
    setMaterials(BRIEF_MATERIALS.map(() => false));
  };

  const navItems = [
    ...BRIEF_SECTIONS.map((s, i) => ({ id: s.id, no: i + 1, title: s.title, ...stats.perSection[i] })),
    { id: "materials", no: 10, title: "Материалы", done: materialsDone, total: BRIEF_MATERIALS.length },
  ];

  return (
    <section className="content-section bf-section">
      <div className="bf-layout">
        <aside className="bf-aside">
          <div className="bf-progress">
            <div className="bf-progress-top">
              <span className="bf-progress-value">{Math.round(progress * 100)}%</span>
              <span className="bf-progress-label">
                {stats.answered} из {ALL_QUESTIONS.length} ответов
              </span>
            </div>
            <div className="bf-progress-bar"><span style={{ transform: `scaleX(${progress})` }} /></div>
            <span className="bf-progress-req">
              {stats.missing.length === 0
                ? "Все обязательные заполнены"
                : `Обязательных осталось: ${stats.missing.length}`}
            </span>
          </div>

          <nav className="bf-nav" ref={navRef} aria-label="Разделы брифа">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#s-${item.id}`}
                data-nav={item.id}
                className={`bf-nav-item${active === item.id ? " is-active" : ""}`}
              >
                <Ring value={item.done / item.total} done={item.done === item.total} />
                <span className="bf-nav-no">{String(item.no).padStart(2, "0")}</span>
                <span className="bf-nav-title">{item.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="bf-main">
          {BRIEF_SECTIONS.map((s, si) => {
            const st = stats.perSection[si];
            return (
              <article className="bf-card" id={`s-${s.id}`} data-section={s.id} key={s.id}>
                <header className="bf-card-head">
                  <span className="bf-card-no">{String(si + 1).padStart(2, "0")}</span>
                  <div className="bf-card-titles">
                    <h2>{s.title}</h2>
                    <p>{s.lede}</p>
                  </div>
                  <span className={`bf-card-count${st.done === st.total ? " is-done" : ""}`}>
                    {st.done}/{st.total}
                  </span>
                </header>

                {s.quote && (
                  <blockquote className="bf-quote">
                    <span aria-hidden="true">“</span>
                    {s.quote}
                  </blockquote>
                )}

                <div className="bf-questions">
                  {s.questions.map((q) => (
                    <Question key={q.id} q={q} answer={answers[q.id]} onChange={setAnswer} />
                  ))}
                </div>
              </article>
            );
          })}

          <article className="bf-card" id="s-materials" data-section="materials">
            <header className="bf-card-head">
              <span className="bf-card-no">10</span>
              <div className="bf-card-titles">
                <h2>Материалы и что уточнить</h2>
                <p>Что клиент передаёт до старта работы. Отмечайте то, что уже готово.</p>
              </div>
              <span className={`bf-card-count${materialsDone === BRIEF_MATERIALS.length ? " is-done" : ""}`}>
                {materialsDone}/{BRIEF_MATERIALS.length}
              </span>
            </header>

            <ul className="bf-materials">
              {BRIEF_MATERIALS.map((m, i) => (
                <li key={m}>
                  <label className={`bf-material${materials[i] ? " is-on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={materials[i]}
                      onChange={() => setMaterials((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                    />
                    <span className="bf-material-box" aria-hidden="true"><Icon name="check" /></span>
                    <span>{m}</span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="bf-q bf-q--plain">
              <label className="bf-q-text" htmlFor="a-clarify">
                Что уточнить у клиента — сюда дизайнер переносит вопросы без ответа после встречи
              </label>
              <AutoTextarea
                id="a-clarify"
                className="bf-input"
                value={answers[CLARIFY_ID]?.text ?? ""}
                onChange={(t) => setAnswer(CLARIFY_ID, { text: t })}
                placeholder="Вопросы, которые остались открытыми"
              />
            </div>
          </article>

          <div className="bf-finish">
            <span className="eyebrow">Готово?</span>
            <h2 className="bf-finish-title">Отправьте бриф дизайнеру</h2>

            {stats.missing.length > 0 ? (
              <div className="bf-missing">
                <span className="bf-missing-title">Без этих ответов работу не начинаем:</span>
                <div className="bf-missing-list">
                  {stats.missing.map((q) => (
                    <a key={q.id} href={`#q-${q.id}`} className="bf-missing-chip">
                      {q.id}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <p className="bf-finish-ok">
                <Icon name="check" /> Все обязательные вопросы заполнены — можно отправлять.
              </p>
            )}

            <div className="bf-actions">
              <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <span>Отправить в WhatsApp</span>
                <span className="btn-arrow" aria-hidden="true"><Icon name="arrow" /></span>
              </a>
              <button type="button" className="bf-btn-ghost" onClick={copy}>
                <Icon name={copied ? "check" : "copy"} />
                <span>{copied ? "Скопировано" : "Скопировать ответы"}</span>
              </button>
              <button type="button" className="bf-btn-ghost" onClick={download}>
                <Icon name="download" />
                <span>Скачать ответы .txt</span>
              </button>
            </div>

            <p className="bf-finish-note">
              Ответы сохраняются в этом браузере автоматически — можно закрыть страницу и вернуться позже.{" "}
              <button type="button" className="bf-reset" onClick={reset}>
                <Icon name="reset" /> Очистить
              </button>
            </p>
          </div>

          <a className="bf-docx" href={BRIEF_DOCX} download="Бриф на фирменный стиль — tabaam.print.docx">
            <span className="bf-docx-icon"><Icon name="doc" /></span>
            <span className="bf-docx-body">
              <span className="bf-docx-title">Бриф на фирменный стиль</span>
              <span className="bf-docx-meta">Документ Word · удобно заполнить офлайн или распечатать</span>
            </span>
            <span className="bf-docx-dl"><Icon name="download" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
