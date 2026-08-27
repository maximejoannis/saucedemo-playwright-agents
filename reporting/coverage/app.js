const data = window.COVERAGE_DATA;
const q = (selector) => document.querySelector(selector);
const fmt = (number) => String(number).replace('.', ',');
const fc = data.functionalCoverage;
const req = data.requirements;
q('#score').style.setProperty('--score', fc.scenarios.rate);
q('#scoreValue').textContent = `${fmt(fc.scenarios.rate)}%`;
q('#requirementsScore').textContent = `${fmt(req.acceptanceCriteria.rate)}%`;
const cards = [
  ['User Stories', `${req.userStories.covered}/${req.userStories.total}`, req.userStories.rate],
  [
    'Acceptance Criteria',
    `${req.acceptanceCriteria.covered}/${req.acceptanceCriteria.total}`,
    req.acceptanceCriteria.rate,
  ],
  ['Requirements Coverage', `${fmt(req.acceptanceCriteria.rate)}%`, 'Critères couverts'],
  ['Scénarios fonctionnels', `${fc.scenarios.automated}/${fc.scenarios.planned}`, fc.scenarios.rate],
  ['Matrice', `${fc.matrix.covered}/${fc.matrix.total}`, fc.matrix.rate],
  ['E2E', data.e2e.total, 'Couche transverse'],
];
q('#kpis').innerHTML = cards
  .map(
    (card, index) =>
      `<article class="card" style="--accent:${['var(--lime)', 'var(--cyan)', 'var(--orange)'][index % 3]}"><small>${card[0]}</small><strong>${card[1]}</strong><span>${typeof card[2] === 'number' ? `${fmt(card[2])} %` : card[2]}</span></article>`,
  )
  .join('');
q('#summary').textContent =
  `Le taux d’automatisation du périmètre fonctionnel est de ${fmt(fc.scenarios.rate)} % : ${fc.features.covered} fonctionnalités sur ${fc.features.total} et ${fc.scenarios.automated} scénarios sur ${fc.scenarios.planned} sont couverts. La matrice Passant / Non passant / Erreur est couverte à ${fmt(fc.matrix.rate)} %.`;
q('#requirementsSummary').textContent =
  `Les ${req.userStories.covered} User Stories reconstituées sont couvertes par l’automatisation. Les ${req.acceptanceCriteria.covered} critères d’acceptation disposent tous d’au moins un test automatisé, soit une Requirements Coverage de ${fmt(req.acceptanceCriteria.rate)} %. Les ${fc.scenarios.planned} scénarios fonctionnels sont tous tracés : ${req.traceability.requirementValidation} valident directement des exigences et ${req.traceability.characterization} caractérisent des comportements observés.`;
q('#matrix').innerHTML = data.matrix
  .map(
    (row) =>
      `<tr><td>${row.feature}</td>${data.axes.map((axis) => `<td class="${row.cells[axis] ? 'yes' : 'no'}">${row.cells[axis] ? '✓' : '—'}</td>`).join('')}<td>${fmt(row.rate)} %</td></tr>`,
  )
  .join('');
q('#types').innerHTML = ['positive', 'negative', 'error']
  .map(
    (type, index) =>
      `<article class="bar"><span>@${type}</span><strong>${data.tags[type]}</strong><div class="track"><span style="--accent:${['var(--lime)', 'var(--orange)', 'var(--red)'][index]};--width:${(data.tags[type] / data.scenarios.length) * 100}%"></span></div></article>`,
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
const rtmFilters = [
  ['usFilter', 'userStory'],
  ['natureFilter', 'nature'],
  ['rtmTypeFilter', 'type'],
];
rtmFilters.forEach(([id, property]) =>
  [...new Set(data.traceability.map((row) => row[property]))].forEach((value) =>
    q(`#${id}`).add(new Option(value, value)),
  ),
);
function renderTraceability() {
  const filters = Object.fromEntries(rtmFilters.map(([id, property]) => [property, q(`#${id}`).value]));
  const status = q('#rtmStatusFilter').value;
  q('#traceability').innerHTML = data.traceability
    .filter(
      (row) =>
        Object.entries(filters).every(([property, value]) => !value || row[property] === value) &&
        (!status || String(row.automated) === status),
    )
    .map(
      (row) =>
        `<tr><td>${row.userStory}</td><td>${row.acceptanceCriterion}</td><td>${row.testCase}</td><td>${row.type}</td><td>${row.priority}</td><td class="${row.nature === 'Characterization' ? 'nature-characterization' : 'nature-validation'}">${row.nature === 'Characterization' ? 'CHARACTERIZATION' : row.nature}</td><td class="${row.automated ? 'yes' : 'no'}">${row.automated ? '✓' : 'UNTRACED'}</td></tr>`,
    )
    .join('');
}
[...rtmFilters.map(([id]) => id), 'rtmStatusFilter'].forEach((id) =>
  q(`#${id}`).addEventListener('change', renderTraceability),
);
renderScenarios();
renderTraceability();
q('#theme').addEventListener('click', () => {
  document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
});
q('#print').addEventListener('click', () => window.print());
q('#generatedAt').textContent = new Date(data.generatedAt).toLocaleString('fr-FR');
