const data = window.COVERAGE_DATA;
const q = (s) => document.querySelector(s);
const fmt = (n) => String(n).replace('.', ',');
const fc = data.functionalCoverage;
q('#score').style.setProperty('--score', fc.scenarios.rate);
q('#scoreValue').textContent = fmt(fc.scenarios.rate) + '%';
const cards = [
  ['Fonctionnalités couvertes', fc.features.covered + '/' + fc.features.total, fc.features.rate],
  ['Scénarios automatisés', fc.scenarios.automated + '/' + fc.scenarios.planned, fc.scenarios.rate],
  ['Matrice de couverture', fc.matrix.covered + '/' + fc.matrix.total, fc.matrix.rate],
  ['Tests E2E', data.e2e.total, 'Couverture E2E'],
];
q('#kpis').innerHTML = cards
  .map(
    (c, i) =>
      '<article class="card" style="--accent:' +
      ['var(--lime)', 'var(--cyan)', 'var(--orange)', 'var(--red)'][i] +
      '"><small>' +
      c[0] +
      '</small><strong>' +
      c[1] +
      '</strong><span>' +
      (typeof c[2] === 'number' ? fmt(c[2]) + ' %' : c[2]) +
      '</span></article>',
  )
  .join('');
q('#summary').textContent =
  'Le taux d’automatisation du périmètre fonctionnel défini est de ' +
  fmt(fc.scenarios.rate) +
  ' % : ' +
  fc.features.covered +
  ' fonctionnalités sur ' +
  fc.features.total +
  ' et ' +
  fc.scenarios.automated +
  ' scénarios sur ' +
  fc.scenarios.planned +
  ' sont couverts par des tests Playwright automatisés. La matrice Passant / Non passant / Erreur est également couverte à ' +
  fmt(fc.matrix.rate) +
  ' % sur les ' +
  fc.features.total +
  ' domaines fonctionnels.';
q('#matrix').innerHTML = data.matrix
  .map(
    (r) =>
      '<tr><td>' +
      r.feature +
      '</td>' +
      data.axes
        .map((a) => '<td class="' + (r.cells[a] ? 'yes' : 'no') + '">' + (r.cells[a] ? '✓' : '—') + '</td>')
        .join('') +
      '<td>' +
      fmt(r.rate) +
      ' %</td></tr>',
  )
  .join('');
q('#types').innerHTML = ['positive', 'negative', 'error']
  .map(
    (t, i) =>
      '<article class="bar"><span>@' +
      t +
      '</span><strong>' +
      data.tags[t] +
      '</strong><div class="track"><span style="--accent:' +
      ['var(--lime)', 'var(--orange)', 'var(--red)'][i] +
      ';--width:' +
      (data.tags[t] / data.scenarios.length) * 100 +
      '%"></span></div></article>',
  )
  .join('');
q('#suites').innerHTML = [
  ['Smoke', data.tags.smoke],
  ['Regression', data.tags.regression],
  ['E2E', data.e2e.total],
]
  .map((x) => '<article class="suite"><span>' + x[0] + '</span><strong>' + x[1] + '</strong></article>')
  .join('');
const feature = q('#featureFilter'),
  type = q('#typeFilter');
[...new Set(data.scenarios.map((s) => s.feature))].forEach((v) => feature.add(new Option(v, v)));
data.axes.forEach((v) => type.add(new Option(v, v)));
function render() {
  const term = q('#search').value.toLowerCase(),
    f = feature.value,
    t = type.value,
    status = q('#statusFilter').value;
  q('#scenarioList').innerHTML = data.scenarios
    .filter(
      (s) =>
        (!term || JSON.stringify(s).toLowerCase().includes(term)) &&
        (!f || s.feature === f) &&
        (!t || s.type === t) &&
        (!status || String(s.automated) === status),
    )
    .map(
      (s) =>
        '<article class="scenario"><div><strong>' +
        s.id +
        '</strong><div class="meta">' +
        s.feature +
        ' · ' +
        s.type +
        ' · ' +
        s.priority +
        '</div></div><div><h3>' +
        s.name +
        '</h3><div class="tags">' +
        s.tags.map((tag) => '<span class="tag">' + tag + '</span>').join('') +
        '</div></div><span class="status ' +
        (s.automated ? '' : 'missing') +
        '">' +
        (s.automated ? 'Automatisé' : 'Manquant') +
        '</span></article>',
    )
    .join('');
}
['search', 'featureFilter', 'typeFilter', 'statusFilter'].forEach((id) =>
  q('#' + id).addEventListener(id === 'search' ? 'input' : 'change', render),
);
render();
q('#theme').addEventListener(
  'click',
  () => (document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'),
);
q('#print').addEventListener('click', () => window.print());
q('#generatedAt').textContent = new Date(data.generatedAt).toLocaleString('fr-FR');
