/* global window, document */

(() => {
  const data = window.QUALITY_GATE_DATA;
  const status = document.querySelector('#global-status');
  const checks = document.querySelector('#checks');
  const generatedAt = document.querySelector('#generated-at');
  if (!data || !status || !checks || !generatedAt) {
    if (status) status.textContent = 'Rapport indisponible';
    return;
  }
  status.classList.add(`verdict--${data.status.toLowerCase()}`);
  status.innerHTML = `<strong>${data.passed} / ${data.total} ${data.status}</strong><span>Quality Gate : ${data.status}</span>`;
  generatedAt.textContent = `Généré le ${new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'medium' }).format(new Date(data.generatedAt))}`;
  for (const check of data.checks) {
    const card = document.createElement('article');
    card.className = `check check--${check.status.toLowerCase()}`;
    const output = [check.stdout, check.stderr].filter(Boolean).join('\n\n') || 'Aucune sortie.';
    card.innerHTML = `<div class="check__heading"><h3>${escapeHtml(check.name)}</h3><span class="badge badge--${check.status.toLowerCase()}">${check.status}</span></div><dl><div><dt>Commande</dt><dd><code>${escapeHtml(check.command)}</code></dd></div><div><dt>Durée</dt><dd>${formatDuration(check.durationMs)}</dd></div><div><dt>Code de sortie</dt><dd>${check.exitCode}</dd></div></dl><details><summary>Sortie de la commande</summary><pre>${escapeHtml(output)}</pre></details>`;
    checks.append(card);
  }
  function formatDuration(milliseconds) {
    return milliseconds < 1000 ? `${milliseconds} ms` : `${(milliseconds / 1000).toFixed(2)} s`;
  }
  function escapeHtml(value) {
    const element = document.createElement('span');
    element.textContent = String(value);
    return element.innerHTML;
  }
})();
