function hexToHsl(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16) / 255;
  const g = parseInt(value.substring(2, 4), 16) / 255;
  const b = parseInt(value.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function fileCardHtml(f, categories = []) {
  const isExternal = /^https?:\/\//.test(f.fichier);
  const linkAttrs = isExternal
    ? `target="_blank" rel="noopener noreferrer"`
    : `download`;
  const category = categories.find((c) => c.id === f.categorie);
  const cardStyle = category
    ? (() => {
        const { h, s, l } = hexToHsl(category.color);
        return `--card-h:${h}; --card-s:${s}%; --card-l:${l}%; border-color: hsl(${h} ${s}% ${l}%);`;
      })()
    : "border-color: transparent;";

  return `
    <a href="${f.fichier}" ${linkAttrs} class="download-btn">
      <li class="file-card" style="${cardStyle}">
        <h3>${f.nom}</h3>
        <div class="file-tags">${f.motsCles.map((m) => `<span class="tag">${m}</span>`).join("")}</div>
      </li>
    </a>
  `;
}

export function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
