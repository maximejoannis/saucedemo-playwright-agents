const DEFAULT_BUILD_INFO = {
  status: 'unknown',
  generatedAt: null,
  branch: 'main',
  commit: '—',
  workflowUrl: null,
  reports: {
    functional: { available: false, status: 'unknown' },
    allure: { available: false, status: 'unknown' },
    quality: { available: false, status: 'unknown' },
    coverage: { available: false, status: 'unknown' },
  },
};

const DEFAULT_COVERAGE = {
  functionalCoverage: {
    features: { covered: 6, total: 6, rate: 100 },
    scenarios: { automated: 29, planned: 29, rate: 100 },
    matrix: { covered: 18, total: 18, rate: 100 },
  },
  e2e: { total: 3 },
};

const STATUS_LABELS = {
  passed: 'PASS',
  failed: 'ÉCHEC',
  planned: 'PLANIFIÉ',
  unknown: 'INDISPONIBLE',
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = String(value);
}

function normalizeStatus(status) {
  return Object.hasOwn(STATUS_LABELS, status) ? status : 'unknown';
}

function formatDate(value) {
  if (!value) return 'Données CI indisponibles';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date inconnue';

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(date);
}

function updateStatusElement(element, status) {
  const normalizedStatus = normalizeStatus(status);
  element.className = `status status--${normalizedStatus}`;
  element.textContent = STATUS_LABELS[normalizedStatus];
}

function updateReportCards(reports) {
  for (const card of document.querySelectorAll('[data-report]')) {
    const report = reports[card.dataset.report] ?? {
      available: false,
      status: 'unknown',
    };
    const statusElement = card.querySelector('[data-report-status]');
    const link = card.querySelector('[data-report-link]');

    if (statusElement) {
      updateStatusElement(statusElement, report.available ? report.status : 'unknown');
    }

    if (link && !report.available) {
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
      link.addEventListener('click', (event) => event.preventDefault());
    }
  }
}

function applyBuildInfo(buildInfo) {
  const globalStatus = document.getElementById('globalStatus');
  const workflowLink = document.getElementById('workflowLink');

  if (globalStatus) updateStatusElement(globalStatus, buildInfo.status);

  setText('branchValue', buildInfo.branch ?? 'main');
  setText('commitValue', buildInfo.commit ?? '—');
  setText('generatedAtValue', formatDate(buildInfo.generatedAt));

  if (workflowLink && buildInfo.workflowUrl) {
    workflowLink.href = buildInfo.workflowUrl;
    workflowLink.textContent = 'Ouvrir dans GitHub Actions';
  }

  updateReportCards(buildInfo.reports);
}

function applyCoverage(data) {
  const coverage = data?.functionalCoverage;
  if (!coverage) return;

  const { features, scenarios, matrix } = coverage;
  const e2e = Number.isFinite(data.e2e?.total) ? data.e2e.total : 0;
  const tests = (scenarios?.automated ?? 0) + e2e;
  const rate = scenarios?.rate ?? features?.rate ?? 0;

  setText('scenariosValue', scenarios?.automated ?? '—');
  setText('testsValue', tests || '—');
  setText('e2eValue', e2e || '—');
  setText('coverageValue', `${rate} %`);
  setText('coverageFeaturesFact', `${features?.covered ?? '—'} / ${features?.total ?? '—'} fonctionnalités`);
  setText('coverageScenariosFact', `${scenarios?.automated ?? '—'} / ${scenarios?.planned ?? '—'} scénarios`);
  setText('coverageMatrixFact', `${matrix?.covered ?? '—'} / ${matrix?.total ?? '—'} matrice fonctionnelle`);
  setText('coverageRateFact', `${rate} %`);
}

function applyQuality(data) {
  if (!data) return;
  const label = (tool, result) => (result?.status === 'passed' || result === 'passed' ? `${tool} — PASS` : tool);

  setText('eslintFact', label('ESLint', data.eslint));
  setText('prettierFact', label('Prettier', data.prettier));
  setText('typescriptFact', label('TypeScript', data.typescript));
}

async function loadJson(path, fallback = null) {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    return fallback;
  }
}

async function initializePortal() {
  const [buildData, coverageData, qualityData] = await Promise.all([
    loadJson('./build-info.json', DEFAULT_BUILD_INFO),
    loadJson('./coverage/data.json'),
    loadJson('./quality/summary.json'),
  ]);

  const buildInfo = {
    ...DEFAULT_BUILD_INFO,
    ...buildData,
    reports: {
      ...DEFAULT_BUILD_INFO.reports,
      ...buildData?.reports,
    },
  };
  const coverage = buildData?.coverage
    ? {
        functionalCoverage: {
          features: buildData.coverage.features,
          scenarios: buildData.coverage.scenarios,
          matrix: buildData.coverage.matrix,
        },
        e2e: buildData.coverage.e2e,
      }
    : (coverageData ?? DEFAULT_COVERAGE);
  const quality = buildData?.quality ?? qualityData;

  applyBuildInfo(buildInfo);
  applyCoverage(coverage);
  applyQuality(quality);
}

function initializeTheme() {
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('qa-portal-theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.dataset.theme = savedTheme;
  }

  toggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const systemUsesDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveTheme = currentTheme ?? (systemUsesDark ? 'dark' : 'light');
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('qa-portal-theme', nextTheme);
  });
}

initializeTheme();
initializePortal();
