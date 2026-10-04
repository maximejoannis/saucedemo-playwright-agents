(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const key = 'saucedemo-qa-theme';
  const preferred = () => {
    const saved = localStorage.getItem(key);
    return saved === 'light' || saved === 'dark'
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  };
  const apply = (theme) => {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    toggle?.setAttribute('aria-pressed', String(dark));
    toggle?.setAttribute('aria-label', `Activer le thème ${dark ? 'clair' : 'sombre'}`);
  };
  apply(preferred());
  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(key, next);
    apply(next);
  });
  const data = window.__QA_PORTAL_DATA__;
  if (!data) return;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element && value !== undefined && value !== null) element.textContent = String(value);
  };
  const ratio = (value, firstKey) => `${value[firstKey]}/${value.total}`;
  const playwright = data.playwright;
  const quality = data.qualityGate;
  const coverage = data.coverage;

  document.body.dataset.portalGeneratedAt = String(data.generatedAt);
  setText(
    'snapshot-title',
    playwright?.lastExecutionAvailable ? 'Dernière exécution Playwright' : 'Exécution Playwright non disponible',
  );
  setText(
    'snapshot-message',
    playwright?.lastExecutionAvailable
      ? 'Résultats issus d’une campagne réellement exécutée.'
      : 'Les données disponibles proviennent d’une collecte --list ; elles ne prouvent pas une exécution.',
  );

  if (playwright) {
    setText('playwright-status', playwright.status);
    setText(
      'playwright-score',
      playwright.lastExecutionAvailable ? `${playwright.passed} / ${playwright.executed}` : 'Non disponible',
    );
    setText('playwright-failed', playwright.lastExecutionAvailable ? playwright.failed : '—');
    setText(
      'playwright-report-status',
      playwright.lastExecutionAvailable
        ? `${playwright.passed} PASS · ${playwright.failed} FAIL`
        : 'RÉSULTATS INDISPONIBLES',
    );
    setText('coverage-playwright', playwright.defined);
    setText('execution-defined', playwright.defined);
    setText('execution-collected', playwright.collected);
    setText('execution-executed', playwright.lastExecutionAvailable ? playwright.executed : '—');
    setText('execution-source', playwright.source);
    for (const id of ['playwright-status', 'playwright-report-status']) {
      const status = document.getElementById(id);
      status?.classList.remove('ready');
      status?.classList.toggle('pass', playwright.status === 'PASS');
      status?.classList.toggle('fail', playwright.status === 'FAIL');
    }
  }

  if (quality) {
    setText('quality-status', `${quality.passed}/${quality.total} ${quality.status}`);
    const status = document.getElementById('quality-status');
    status?.classList.toggle('pass', quality.status === 'PASS');
    status?.classList.toggle('fail', quality.status !== 'PASS');
  }

  if (coverage) {
    setText('coverage-features', coverage.features.total);
    setText('coverage-stories', coverage.userStories.total);
    setText('coverage-ac', ratio(coverage.acceptanceCriteria, 'covered'));
    setText('coverage-tc-total', coverage.testCases.total);
    setText('coverage-tc', ratio(coverage.testCases, 'automated'));
    setText('coverage-exploratory', `${coverage.exploratoryCharters.completed}/${coverage.exploratoryCharters.total}`);
    setText('coverage-automation-rate', `${coverage.automationRate} %`);
    const riskSummary = coverage.riskSummary;
    setText('risk-total', riskSummary.total);
    setText('risk-critical', riskSummary.critical);
    setText('risk-high', riskSummary.high);
    setText('risk-covered', riskSummary.covered);
    setText('risk-partial', riskSummary.partiallyCovered);
    setText('risk-multiple', riskSummary.significantWithMultipleControls);
    setText('risk-single', riskSummary.significantWithSingleControl);
    setText('risk-additional', riskSummary.significantNeedingAdditionalCoverage);
    setText('p0-defined', coverage.priorities?.P0 ?? '—');
    setText('exploratory-planned', coverage.exploratoryCharters.total);
    setText('exploratory-completed', coverage.exploratoryCharters.completed);
    setText('exploratory-remaining', coverage.exploratoryCharters.remaining);
    const riskRows = document.getElementById('risk-rows');
    if (riskRows) {
      riskRows.innerHTML = coverage.criticalAndHighRisks
        .map(
          (risk) => `
        <tr>
          <th scope="row">${risk.id}</th>
          <td>${risk.consequence}</td>
          <td>${risk.level}</td>
          <td>${risk.coverageStatus}</td>
          <td>${risk.independentDefenses}</td>
          <td>${risk.residualRisk}</td>
        </tr>`,
        )
        .join('');
    }
    setText('trace-features', ratio(coverage.features, 'covered'));
    setText('trace-stories', ratio(coverage.userStories, 'covered'));
    setText('trace-ac', ratio(coverage.acceptanceCriteria, 'covered'));
    setText('trace-tc', ratio(coverage.testCases, 'automated'));
    if (playwright) {
      setText('playwright-functional', coverage.testCases.total);
      setText('playwright-e2e', Math.max(0, playwright.defined - coverage.testCases.total));
    }
  }

  const metadata = document.getElementById('ci-meta');
  const generatedAt = new Date(data.generatedAt);
  if (metadata && !Number.isNaN(generatedAt.valueOf())) {
    const shortCommit = String(data.commitSha ?? '').slice(0, 7);
    metadata.textContent = `${data.branch} · ${shortCommit} · ${new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(generatedAt)}`;
    metadata.hidden = false;
  }
})();
