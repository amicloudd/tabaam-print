"use client";

import { useState } from "react";
import { CHINA_UPCOMING, DESIGNER_PAPERS } from "@/lib/tag-pricing";

export default function ChinaPreview() {
  const [toggles, setToggles] = useState({});
  const [density, setDensity] = useState(250);
  const [paper, setPaper] = useState(null);

  return (
    <div className="tag-preview">
      <div className="tag-preview-head">
        <span className="tag-preview-badge">Скоро</span>
        <span className="rc-hint" style={{ margin: 0 }}>
          Пока эти параметры не влияют на стоимость — просто предпросмотр.
        </span>
      </div>

      <div className="tag-preview-grid">
        {CHINA_UPCOMING.map((item) => {
          if (item.kind === "toggle") {
            return (
              <label className="rc-toggle tag-preview-toggle" key={item.id}>
                <input
                  type="checkbox"
                  checked={!!toggles[item.id]}
                  onChange={(e) => setToggles((prev) => ({ ...prev, [item.id]: e.target.checked }))}
                />
                <span>{item.label}</span>
              </label>
            );
          }
          if (item.kind === "slider") {
            return (
              <div className="tag-preview-slider" key={item.id}>
                <span className="tag-preview-slider-label">{item.label}</span>
                <div className="rc-slider-row">
                  <input
                    type="range"
                    min={160}
                    max={350}
                    step={10}
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                  />
                  <span className="rc-slider-value">{density} г/м²</span>
                </div>
              </div>
            );
          }
          if (item.kind === "swatches") {
            return (
              <div className="tag-preview-swatches" key={item.id}>
                <span className="tag-preview-slider-label">{item.label}</span>
                <div className="tag-paper-row">
                  {DESIGNER_PAPERS.map((name) => (
                    <button
                      type="button"
                      key={name}
                      className={"tag-paper-swatch" + (paper === name ? " is-active" : "")}
                      onClick={() => setPaper(name === paper ? null : name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
