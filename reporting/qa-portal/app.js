const paths = { build: './build-info.json', coverage: './coverage/data.json', quality: './quality/summary.json' };
const byId = (id) => document.getElementById(id);

function setText(id, value) {
  const element = byId(id);
  if (element) element.textContent = value;
}

function setBadge(id, status) {
  const badge = byId(id);
  if (!badge) return;
  const normalized = String(status ?? '').toLowerCase();
  const labels = {
    passed: 'PASS',
    pass: 'PASS',
    failed: 'ÉCHEC',
    fail: 'ÉCHEC',
    available: 'DISPONIBLE',
    planned: 'PLANIFIÉ',
    unavailable: 'INDISPONIBLE',
  };
  const style = ['passed', 'pass'].includes(normalized)
    ? 'pass'
    : ['failed', 'fail'].includes(normalized)
      ? 'fail'
      : ['available', 'planned'].includes(normalized)
        ? normalized
        : 'unavailable';
  badge.className = `badge ${style}`;
  badge.textContent = labels[normalized] ?? 'INDISPONIBLE';
}

async function loadJson(path) {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return 'Indisponible';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? 'Indisponible' : date.toLocaleString('fr-FR');
}

function applyBuildInfo(build) {
  if (!build) return;
  setText('branch', build.branch || 'Indisponible');
  setText('commit', build.commit || 'Indisponible');
  setText('generated-at', formatDate(build.generatedAt));
  setBadge('global-badge', build.status);
  setText(
    'hero-status',
    ['passed', 'pass'].includes(build.status)
      ? 'PASS'
      : ['failed', 'fail'].includes(build.status)
        ? 'ÉCHEC'
        : 'INDISPONIBLE',
  );
  const workflowLink = byId('workflow-link');
  if (build.workflowUrl && workflowLink) {
    workflowLink.href = build.workflowUrl;
    workflowLink.hidden = false;
  }
  for (const reportName of ['coverage', 'functional', 'allure', 'quality']) {
    const report = build.reports?.[reportName];
    if (!report) continue;
    const status = report.status || (report.available ? 'available' : 'unavailable');
    setBadge(`${reportName}-status`, status);
    setText(
      `${reportName}-metric`,
      report.available
        ? ['passed', 'pass'].includes(status)
          ? 'PASS'
          : ['failed', 'fail'].includes(status)
            ? 'ÉCHEC'
            : 'Disponible'
        : 'Non généré',
    );
  }
}

function applyCoverage(data) {
  const coverage = data?.functionalCoverage;
  if (!coverage) return;
  const { features, scenarios, matrix } = coverage;
  const rate = scenarios?.rate ?? features?.rate;
  setBadge('coverage-status', rate === 100 ? 'passed' : 'available');
  setText('coverage-metric', Number.isFinite(rate) ? `${rate} %` : 'Disponible');
  setText('coverage-detail', `${scenarios?.automated ?? '—'} / ${scenarios?.planned ?? '—'} scénarios automatisés`);
  setText('matrix-detail', `${matrix?.covered ?? '—'} / ${matrix?.total ?? '—'} cellules de matrice`);
  setText('summary-coverage', Number.isFinite(rate) ? `${rate} %` : '—');
  setText('summary-scenarios', `${scenarios?.automated ?? '—'} / ${scenarios?.planned ?? '—'}`);
  setText('summary-matrix', `${matrix?.covered ?? '—'} / ${matrix?.total ?? '—'}`);
  setText('summary-e2e', Number.isFinite(data.e2e?.total) ? String(data.e2e.total) : '—');
  if (features && scenarios && matrix)
    setText(
      'coverage-sentence',
      `${features.covered} fonctionnalités sur ${features.total} et ${scenarios.automated} scénarios sur ${scenarios.planned} sont couverts. La matrice Passant / Non passant / Erreur est couverte sur ${matrix.covered} cellules sur ${matrix.total}.`,
    );
  if (byId('generated-at')?.textContent === 'Indisponible') setText('generated-at', formatDate(data.generatedAt));
}

function applyQuality(data) {
  if (!data) return;
  setBadge('quality-status', data.status);
  setText(
    'quality-metric',
    ['passed', 'pass'].includes(data.status)
      ? 'PASS'
      : ['failed', 'fail'].includes(data.status)
        ? 'ÉCHEC'
        : 'Disponible',
  );
  setText(
    'quality-detail',
    `ESLint ${String(data.eslint?.status ?? 'indisponible').toUpperCase()} · ${data.eslint?.errors ?? '—'} erreurs · ${data.eslint?.warnings ?? '—'} warnings · Prettier ${String(data.prettier?.status ?? 'indisponible').toUpperCase()}`,
  );
  setText('summary-quality', String(data.status ?? '—').toUpperCase());
  if (byId('generated-at')?.textContent === 'Indisponible') setText('generated-at', formatDate(data.generatedAt));
}

function setupTheme() {
  const root = document.documentElement;
  const button = byId('theme-toggle');
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('qa-portal-theme');
  } catch {
    /* Local storage can be blocked under file://. */
  }
  root.dataset.theme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const updateLabel = () =>
    button?.setAttribute(
      'aria-label',
      root.dataset.theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre',
    );
  updateLabel();
  button?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('qa-portal-theme', root.dataset.theme);
    } catch {
      /* The active theme still changes without persistence. */
    }
    updateLabel();
  });
}

async function initialize() {
  setupTheme();
  const [build, coverage, quality] = await Promise.all([
    loadJson(paths.build),
    loadJson(paths.coverage),
    loadJson(paths.quality),
  ]);
  applyBuildInfo(build);
  applyCoverage(coverage);
  applyQuality(quality);
}

void initialize();
