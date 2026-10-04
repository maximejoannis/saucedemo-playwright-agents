const q = (selector) => document.querySelector(selector);
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/gu,
    (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character],
  );
const ratio = (item, left = 'covered', right = 'total') => `${item[left]} / ${item[right]}`;
const badge = (ok, yes = 'PASS', no = 'MANQUANT') =>
  `<span class="badge ${ok ? 'pass' : 'fail'}">${ok ? yes : no}</span>`;
async function loadReport() {
  const response = await fetch('data.json');
  if (!response.ok) throw new Error(`data.json indisponible (${response.status})`);
  const data = await response.json();
  const summary = data.summary;
  q('#score').textContent = `${summary.automationRate} %`;
  const cards = [
    ['Fonctionnalités', ratio(summary.features)],
    ['User Stories', ratio(summary.userStories)],
    ['Critères d’acceptation', ratio(summary.acceptanceCriteria)],
    ['Cas de test fonctionnels', ratio(summary.functionalTestCases, 'automated')],
    ['TC manuels', summary.functionalTestCases.manual],
    ['Candidats à l’automatisation', summary.functionalTestCases.candidates],
    ['Risques tracés', ratio(summary.risks, 'traced')],
    ['Risques couverts', summary.riskCoverage.Couvert],
    ['Risques partiellement couverts', summary.riskCoverage['Partiellement couvert']],
    ['Risques non couverts', summary.riskCoverage['Non couvert']],
    ['Risques acceptés / hors périmètre', summary.riskCoverage['Accepté / hors périmètre']],
    ['Risques critiques/élevés en Smoke', ratio(summary.significantRisks, 'smoke')],
    [
      'Risques critiques/élevés avec plusieurs contrôles réellement différents',
      ratio(summary.significantRisks, 'multipleDefenses'),
    ],
    [
      'Risques critiques/élevés avec un seul contrôle réellement différent',
      ratio(summary.significantRisks, 'singleDefense'),
    ],
    [
      'Risques critiques/élevés nécessitant une couverture supplémentaire',
      ratio(summary.significantRisks, 'needingAdditionalCoverage'),
    ],
    [
      'Tests exploratoires',
      `${summary.exploratoryCharters.completed} exécuté sur ${summary.exploratoryCharters.total} prévus`,
    ],
    ['Couverture vérifiée par exploration', summary.exploratoryCharters.verifiedRiskCoverage],
    ['E2E complémentaires', summary.e2e],
    ['Tests Playwright', summary.playwrightTests],
  ];
  q('#kpis').innerHTML = cards
    .map(
      ([label, value]) =>
        `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${label.includes('exploratoire') || label.includes('Charters') ? 'Hors couverture automatisée' : label.startsWith('Risques') ? 'Couverture des risques distincte' : label === 'E2E complémentaires' ? 'Couche transverse' : 'Couverture automatisée'}</small></article>`,
    )
    .join('');
  q('#types').innerHTML = Object.entries(summary.types)
    .map(([type, count]) => `<div class="stat"><span>${escapeHtml(type)}</span><strong>${count}</strong></div>`)
    .join('');
  q('#suites').innerHTML = [
    ['Smoke fonctionnelle', summary.functionalSmoke],
    ['Regression fonctionnelle', summary.functionalRegression],
    ['P0 — essentiels', summary.priorities.P0],
    ['P1 — régression', summary.priorities.P1],
    ['P2 — priorité moindre', summary.priorities.P2],
    ['Smoke E2E', summary.e2eSmoke],
    ['Regression E2E', summary.e2eRegression],
    ['Smoke globale', summary.globalSmoke],
    ['Regression globale', summary.globalRegression],
  ]
    .map(([label, count]) => `<div class="stat"><span>${label}</span><strong>${count}</strong></div>`)
    .join('');
  q('#techniques').innerHTML = Object.entries(summary.techniques)
    .map(([technique, count]) => `<div class="stat"><span>${technique}</span><strong>${count}</strong></div>`)
    .join('');
  q('#featureCards').innerHTML = data.features
    .map(
      (feature) =>
        `<article class="feature"><div><p>${feature.userStory}</p><h3>${escapeHtml(feature.name)}</h3></div>${badge(feature.acceptanceCriteria.covered === feature.acceptanceCriteria.total)}<dl><div><dt>AC</dt><dd>${ratio(feature.acceptanceCriteria)}</dd></div><div><dt>TC</dt><dd>${ratio(feature.testCases, 'automated')}</dd></div><div><dt>Passants</dt><dd>${feature.types.Passant}</dd></div><div><dt>Non passants</dt><dd>${feature.types['Non passant']}</dd></div><div><dt>Erreurs</dt><dd>${feature.types.Erreur}</dd></div><div><dt>Smoke / Regression</dt><dd>${feature.smoke} / ${feature.regression}</dd></div></dl></article>`,
    )
    .join('');
  q('#storyRows').innerHTML = data.userStories
    .map(
      (story) =>
        `<tr><td><strong>${story.id}</strong></td><td>${escapeHtml(story.title)}</td><td>${escapeHtml(story.feature)}</td><td>${story.coveredAcceptanceCriteria} / ${story.acceptanceCriteria.length}</td><td>${story.automatedTestCases} / ${story.testCases.length}</td><td>${badge(story.status === 'PASS')}</td></tr>`,
    )
    .join('');
  q('#criterionList').innerHTML = data.acceptanceCriteria
    .map(
      (criterion) =>
        `<article><div><strong>${criterion.id}</strong>${badge(criterion.automated, 'AUTOMATISÉ')}</div><h3>${escapeHtml(criterion.title)}</h3><p>${escapeHtml(criterion.description)}</p><footer><span>${criterion.userStory}</span>${criterion.testCases.map((id) => `<code>${id}</code>`).join('')}</footer></article>`,
    )
    .join('');
  q('#riskCards').innerHTML = data.risks
    .map(
      (risk) =>
        `<article class="feature"><div><p>${risk.id}</p><h3>${escapeHtml(risk.feature)}</h3></div>${badge(risk.coverageStatus === 'Couvert', risk.coverageStatus, risk.coverageStatus)}<p>${escapeHtml(risk.scenario)}</p><dl><div><dt>Niveau</dt><dd>${escapeHtml(risk.level)}</dd></div><div><dt>Score</dt><dd>${risk.probability * risk.impact}</dd></div><div><dt>Contrôles réellement différents</dt><dd>${risk.independentDefenses}</dd></div><div><dt>TC liés</dt><dd>${risk.testCases.length}</dd></div><div><dt>E2E complémentaires</dt><dd>${risk.e2e.length}</dd></div></dl><p><strong>Gap / limite :</strong> ${escapeHtml(risk.defenseGap)}</p><p><strong>Résiduel :</strong> ${escapeHtml(risk.residualRisk)}</p><footer>${risk.testCases.map((id) => `<code>${id}</code>`).join('')}</footer></article>`,
    )
    .join('');
  q('#exploratoryCards').innerHTML = data.exploratoryCharters
    .map(
      (charter) =>
        `<article class="feature"><div><p>${charter.id}</p><h3>${escapeHtml(charter.title)}</h3></div>${badge(charter.status === 'Exploré', charter.status, charter.status)}<p>${escapeHtml(charter.objective)}</p><p><strong>Question QA :</strong> ${escapeHtml(charter.qaQuestion)}</p><dl><div><dt>Domaine</dt><dd>${escapeHtml(charter.domain)}</dd></div><div><dt>Risques à investiguer</dt><dd>${charter.risks.length}</dd></div><div><dt>Priorité exploratoire</dt><dd>${escapeHtml(charter.explorationPriority)}</dd></div><div><dt>Durée maximale</dt><dd>${charter.timeBoxMinutes} min</dd></div></dl><footer>${charter.risks.map((id) => `<code>${id}</code>`).join('')}</footer></article>`,
    )
    .join('');
  const renderCases = () => {
    const term = q('#filter').value.toLowerCase();
    q('#caseRows').innerHTML = data.testCases
      .filter((testCase) => !term || JSON.stringify(testCase).toLowerCase().includes(term))
      .map(
        (testCase) =>
          `<tr><td><strong>${testCase.id}</strong></td><td>${escapeHtml(testCase.feature)}</td><td>${testCase.userStory}</td><td>${testCase.acceptanceCriteria.map((id) => `<code>${id}</code>`).join(' ')}</td><td>${testCase.risks.map((id) => `<code>${id}</code>`).join(' ')}</td><td>${testCase.techniques.length ? testCase.techniques.map((id) => `<code>${id}</code>`).join(' ') : '—'}</td><td>${escapeHtml(testCase.executionMode)}</td><td>${escapeHtml(testCase.type)}</td><td>${testCase.priority}</td><td>${escapeHtml(testCase.potentialImpact ?? '—')}</td><td>${escapeHtml(testCase.expectedReference ?? '—')}</td><td>${escapeHtml(testCase.referenceType ?? '—')}</td><td>${escapeHtml(testCase.testJustification ?? '—')}</td><td>${escapeHtml(testCase.priorityJustification ?? '—')}</td><td>${escapeHtml(testCase.businessUncertainty ?? '—')}</td><td>${testCase.tags.includes('@smoke') ? 'Oui' : '—'}</td><td>${testCase.tags.includes('@regression') ? 'Oui' : '—'}</td><td>${badge(testCase.automated, 'OUI', 'NON')}</td></tr>`,
      )
      .join('');
  };
  q('#filter').addEventListener('input', renderCases);
  renderCases();
  q('#e2eCards').innerHTML = data.e2e
    .map(
      (test) =>
        `<article class="feature"><div><p>${escapeHtml(test.tags.join(' '))}</p><h3>${test.id} — ${escapeHtml(test.title)}</h3></div>${badge(test.automated, 'AUTOMATISÉ')}<p>${escapeHtml(test.transversalPath ?? 'Parcours transverse')}</p><small>${escapeHtml(test.file)}</small></article>`,
    )
    .join('');
  q('#generated').textContent = new Date(data.generatedAt).toLocaleString('fr-FR');
}
const preferred = localStorage.getItem('qa-report-theme');
if (preferred) document.documentElement.dataset.theme = preferred;
q('#theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('qa-report-theme', next);
});
loadReport().catch((error) => {
  q('#content').innerHTML =
    `<div class="shell error"><h1>Rapport indisponible</h1><p>${escapeHtml(error.message)}</p></div>`;
});
