export function fileCardHtml(f) {
  const isExternal = /^https?:\/\//.test(f.fichier);
  const linkAttrs = isExternal
    ? `target="_blank" rel="noopener noreferrer"`
    : `download`;

  return `
    <li class="file-card">
      <h3>${f.nom}</h3>
      <p class="file-description">${f.description}</p>
      <div class="file-tags">${f.motsCles.map((m) => `<span class="tag">${m}</span>`).join("")}</div>
      <a href="${f.fichier}" ${linkAttrs} class="download-btn">Télécharger le PDF</a>
    </li>
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
