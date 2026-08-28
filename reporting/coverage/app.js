const data = window.COVERAGE_DATA;
const q = (selector) => document.querySelector(selector);
const fmt = (number) => String(number).replace('.', ',');
const fc = data.functionalCoverage;
q('#score').style.setProperty('--score', fc.scenarios.rate);
q('#scoreValue').textContent = `${fmt(fc.scenarios.rate)}%`;
const cards = [
  ['Fonctionnalités couvertes', `${fc.features.covered}/${fc.features.total}`, fc.features.rate],
  ['Scénarios fonctionnels', `${fc.scenarios.automated}/${fc.scenarios.planned}`, fc.scenarios.rate],
  ['Matrice fonctionnelle', `${fc.matrix.covered}/${fc.matrix.total}`, fc.matrix.rate],
  ['Tests E2E', data.e2e.total, 'Couche transverse'],
];
q('#kpis').innerHTML = cards
  .map(
    (card) =>
      `<article class="card"><small>${card[0]}</small><strong>${card[1]}</strong><span>${typeof card[2] === 'number' ? `${fmt(card[2])} %` : card[2]}</span></article>`,
  )
  .join('');
q('#summary').textContent =
  `Le taux d’automatisation du périmètre fonctionnel est de ${fmt(fc.scenarios.rate)} % : ${fc.features.covered} fonctionnalités sur ${fc.features.total} et ${fc.scenarios.automated} scénarios sur ${fc.scenarios.planned} sont couverts. La matrice Passant / Non passant / Erreur est couverte à ${fmt(fc.matrix.rate)} %.`;
q('#matrix').innerHTML = data.matrix
  .map(
    (row) =>
      `<tr><td>${row.feature}</td>${data.axes.map((axis) => `<td class="${row.cells[axis] ? 'yes' : 'no'}">${row.cells[axis] ? '✓' : '—'}</td>`).join('')}<td>${fmt(row.rate)} %</td></tr>`,
  )
  .join('');
q('#types').innerHTML = ['positive', 'negative', 'error']
  .map(
    (type, index) =>
      `<article class="bar"><span>@${type}</span><strong>${data.tags[type]}</strong><div class="track"><span style="--accent:${['var(--primary)', 'var(--warning)', 'var(--danger)'][index]};--width:${(data.tags[type] / data.scenarios.length) * 100}%"></span></div></article>`,
  )
  .join('');
q('#suites').innerHTML = [
  ['Smoke', data.tags.smoke],
  ['Regression', data.tags.regression],
  ['E2E', data.e2e.total],
]
  .map((item) => `<article class="suite"><span>${item[0]}</span><strong>${item[1]}</strong></article>`)
  .join('');
const feature = q('#featureFilter');
const type = q('#typeFilter');
[...new Set(data.scenarios.map((scenario) => scenario.feature))].forEach((value) =>
  feature.add(new Option(value, value)),
);
data.axes.forEach((value) => type.add(new Option(value, value)));
function renderScenarios() {
  const term = q('#search').value.toLowerCase();
  q('#scenarioList').innerHTML = data.scenarios
    .filter(
      (scenario) =>
        (!term || JSON.stringify(scenario).toLowerCase().includes(term)) &&
        (!feature.value || scenario.feature === feature.value) &&
        (!type.value || scenario.type === type.value) &&
        (!q('#statusFilter').value || String(scenario.automated) === q('#statusFilter').value),
    )
    .map(
      (scenario) =>
        `<article class="scenario"><div><strong>${scenario.id}</strong><div class="meta">${scenario.feature} · ${scenario.type} · ${scenario.priority}</div></div><div><h3>${scenario.name}</h3><div class="tags">${scenario.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div></div><span class="status ${scenario.automated ? '' : 'missing'}">${scenario.automated ? 'Automatisé' : 'Manquant'}</span></article>`,
    )
    .join('');
}
['search', 'featureFilter', 'typeFilter', 'statusFilter'].forEach((id) =>
  q(`#${id}`).addEventListener(id === 'search' ? 'input' : 'change', renderScenarios),
);
renderScenarios();
const savedTheme = localStorage.getItem('qa-portal-theme');
if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;
q('#theme').addEventListener('click', () => {
  const currentTheme = document.documentElement.dataset.theme;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const nextTheme = currentTheme ? (currentTheme === 'dark' ? 'light' : 'dark') : systemDark ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem('qa-portal-theme', nextTheme);
});
q('#generatedAt').textContent = new Date(data.generatedAt).toLocaleString('fr-FR');
