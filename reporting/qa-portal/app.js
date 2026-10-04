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
  setText('snapshot-title', 'Dernière exécution CI/CD');
  setText('snapshot-message', 'Dernière exécution CI/CD publiée automatiquement.');

  if (playwright) {
    setText('playwright-status', playwright.status);
    setText('playwright-score', `${playwright.passed} / ${playwright.total}`);
    setText('playwright-failed', playwright.failed);
    setText('playwright-report-status', `${playwright.passed} PASS · ${playwright.failed} FAIL`);
    setText('coverage-playwright', playwright.total);
    for (const id of ['playwright-status', 'playwright-report-status']) {
      const status = document.getElementById(id);
      status?.classList.remove('ready');
      status?.classList.toggle('pass', playwright.status === 'PASS');
      status?.classList.toggle('fail', playwright.status !== 'PASS');
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
    setText('trace-features', ratio(coverage.features, 'covered'));
    setText('trace-stories', ratio(coverage.userStories, 'covered'));
    setText('trace-ac', ratio(coverage.acceptanceCriteria, 'covered'));
    setText('trace-tc', ratio(coverage.testCases, 'automated'));
    if (playwright) {
      setText('playwright-functional', coverage.testCases.total);
      setText('playwright-e2e', Math.max(0, playwright.total - coverage.testCases.total));
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
