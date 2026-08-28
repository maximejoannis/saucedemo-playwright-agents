import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, '..', '..');
const outputDirectory = path.join(root, 'quality-report');
const eslintCli = path.join(root, 'node_modules', 'eslint', 'bin', 'eslint.js');
const prettierCli = path.join(root, 'node_modules', 'prettier', 'bin', 'prettier.cjs');

async function run(command, args) {
  try {
    const result = await execFileAsync(command, args, {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return { exitCode: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      exitCode: typeof error.code === 'number' ? error.code : 1,
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? error.message,
    };
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const eslintRun = await run(process.execPath, [eslintCli, '.', '--format', 'json']);
function parseEslintFiles(output) {
  try {
    return JSON.parse(output || '[]');
  } catch {
    return [];
  }
}

const eslintFiles = parseEslintFiles(eslintRun.stdout);

const eslintIssues = eslintFiles.flatMap((file) =>
  file.messages.map((issue) => ({
    file: path.relative(root, file.filePath),
    line: issue.line ?? null,
    column: issue.column ?? null,
    ruleId: issue.ruleId ?? null,
    message: issue.message,
    severity: issue.severity === 2 ? 'error' : 'warning',
  })),
);
const eslintErrors = eslintFiles.reduce((total, file) => total + file.errorCount, 0);
const eslintWarnings = eslintFiles.reduce((total, file) => total + file.warningCount, 0);
const eslintPassed = eslintRun.exitCode === 0 && eslintErrors === 0;

const prettierRun = await run(process.execPath, [prettierCli, '.', '--list-different']);
const prettierOutput = `${prettierRun.stdout}\n${prettierRun.stderr}`;
const nonCompliantFiles = [
  ...new Set(
    prettierOutput
      .split(/\r?\n/u)
      .map((line) => line.trim().replace(/^\[warn\]\s*/u, ''))
      .filter((line) => line && !line.startsWith('>') && !line.startsWith('Checking formatting'))
      .filter((line) => /\.[cm]?[jt]sx?$|\.json$|\.md$|\.css$|\.html$|\.ya?ml$/iu.test(line)),
  ),
];
const prettierPassed = prettierRun.exitCode === 0;
const passedChecks = Number(eslintPassed) + Number(prettierPassed);
const generatedAt = new Date().toISOString();

// Stable, intentionally compact contract for the QA portal and CI workflows.
const summary = {
  generatedAt,
  status: eslintPassed && prettierPassed ? 'passed' : 'failed',
  eslint: {
    status: eslintPassed ? 'passed' : 'failed',
    errors: eslintErrors,
    warnings: eslintWarnings,
    filesAnalyzed: eslintFiles.length,
  },
  prettier: {
    status: prettierPassed ? 'passed' : 'failed',
    nonCompliantFiles: nonCompliantFiles.length,
  },
};

const badge = (passed) => `<span class="badge ${passed ? 'pass' : 'fail'}">${passed ? 'PASS' : 'FAIL'}</span>`;
const issueRows = eslintIssues.length
  ? eslintIssues
      .map(
        (issue) =>
          `<tr><td>${escapeHtml(issue.file)}</td><td>${issue.line ?? '—'}:${issue.column ?? '—'}</td><td>${escapeHtml(issue.ruleId ?? '—')}</td><td>${escapeHtml(issue.message)}</td><td><span class="level ${issue.severity}">${issue.severity}</span></td></tr>`,
      )
      .join('')
  : '<tr><td colspan="5" class="empty">Aucun problème ESLint détecté.</td></tr>';
const prettierDetails = nonCompliantFiles.length
  ? `<ul>${nonCompliantFiles.map((file) => `<li><code>${escapeHtml(file)}</code></li>`).join('')}</ul>`
  : '<p class="empty">Tous les fichiers analysés respectent le formatage Prettier.</p>';

const legacyHtml = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SD · QA Quality</title><style>
:root{--bg:#090c0b;--panel:#111614;--panel-2:#171d1a;--text:#f3f7f1;--muted:#9ba69e;--line:#29312c;--lime:#c7ff4a;--cyan:#4be5ff;--orange:#ffac4b;--red:#ff6b72}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,sans-serif}.shell{width:min(1160px,calc(100% - 32px));margin:auto}header{border-bottom:1px solid var(--line);padding:22px 0}.brand{display:flex;align-items:center;gap:14px}.logo{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--lime);color:var(--bg);font-weight:900}.brand strong{font-size:20px}.muted{color:var(--muted)}header .shell{display:flex;justify-content:space-between;align-items:center}.hero{padding:58px 0 34px}.eyebrow{color:var(--lime);font-weight:800;letter-spacing:.16em}.hero h1{font-size:clamp(52px,10vw,108px);line-height:.9;margin:18px 0}.hero p{max-width:720px;color:var(--muted);font-size:17px}.badge{display:inline-block;border:1px solid currentColor;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:900;letter-spacing:.08em}.pass{color:var(--lime)}.fail,.error{color:var(--red)}.warning{color:var(--orange)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card,.section{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:24px}.card .metric{font-size:36px;font-weight:850;margin:12px 0 6px}.section{margin:16px 0 32px}.section h2{margin-top:0}table{width:100%;border-collapse:collapse}th,td{text-align:left;border-bottom:1px solid var(--line);padding:12px 10px;vertical-align:top}th{color:var(--muted);font-size:12px;text-transform:uppercase}.level{font-weight:800}.empty{color:var(--muted)}code{color:var(--cyan)}footer{color:var(--muted);padding:12px 0 42px}@media(max-width:760px){.grid{grid-template-columns:1fr}header .shell{align-items:flex-start;gap:16px;flex-direction:column}.section{overflow:auto}}
</style></head><body><header><div class="shell"><div class="brand"><div class="logo">SD</div><div><strong>QA Quality</strong><div class="muted">ESLint + Prettier</div></div></div><time class="muted">Généré le ${escapeHtml(new Date(generatedAt).toLocaleString('fr-FR'))}</time></div></header>
<main class="shell"><section class="hero"><div class="eyebrow">QUALITÉ DU CODE</div><h1>${summary.status === 'passed' ? 'PASS' : 'FAIL'}</h1><p>Le quality gate vérifie la conformité statique du code TypeScript/JavaScript et son formatage.</p></section>
<section class="grid"><article class="card"><div class="muted">ESLint</div><div class="metric">${eslintErrors} erreurs</div><div>${eslintWarnings} warnings · ${eslintFiles.length} fichiers analysés</div><p>${badge(eslintPassed)}</p></article><article class="card"><div class="muted">Prettier</div><div class="metric">${nonCompliantFiles.length ? `${nonCompliantFiles.length} non conforme${nonCompliantFiles.length > 1 ? 's' : ''}` : 'Tous conformes'}</div><div>Contrôle réel via format:check</div><p>${badge(prettierPassed)}</p></article><article class="card"><div class="muted">Quality Gate</div><div class="metric">${passedChecks} / 2</div><div>contrôles réussis</div><p>${badge(summary.status === 'passed')}</p></article></section>
<section class="section"><h2>Détails ESLint</h2><table><thead><tr><th>Fichier</th><th>Position</th><th>Règle</th><th>Message</th><th>Niveau</th></tr></thead><tbody>${issueRows}</tbody></table></section>
<section class="section"><h2>Détails Prettier</h2>${prettierDetails}</section>
<section class="section"><h2>Scope analysé</h2><p class="muted">Les contrôles utilisent la configuration réelle du projet et couvrent notamment <code>tests/</code>, <code>reporting/</code> et <code>playwright.config.ts</code>. Les artefacts et chemins déclarés dans les configurations d’exclusion ne sont pas analysés.</p></section></main><footer class="shell">SauceDemo Playwright Automation · Rapport autonome HTML/CSS natif</footer></body></html>`;

void legacyHtml;

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>Qualité du code — SauceDemo</title><style>
:root{color-scheme:light;--background:#f5f7fc;--surface:#fff;--surface-muted:#eef3fb;--text:#172033;--text-muted:#647089;--border:#dbe3f1;--primary:#245af5;--primary-hover:#173fb9;--primary-soft:#eaf1ff;--violet:#6d46e8;--success:#08783e;--success-soft:#e5f8ed;--danger:#ba2537;--danger-soft:#ffeaed;--warning:#9a6200;--warning-soft:#fff3d5;--unknown:#5e687c;--unknown-soft:#edf0f5;--shadow:0 20px 60px rgb(35 61 112 / 10%)}:root[data-theme=dark]{color-scheme:dark;--background:#0c111c;--surface:#141c2a;--surface-muted:#101827;--text:#eef3ff;--text-muted:#aab5cb;--border:#2a3750;--primary:#7da4ff;--primary-hover:#a6c0ff;--primary-soft:#1a2b50;--violet:#a68aff;--success:#60d894;--success-soft:#143b29;--danger:#ff8f9c;--danger-soft:#492029;--warning:#ffd173;--warning-soft:#493817;--unknown:#c0c8d8;--unknown-soft:#273145;--shadow:0 20px 60px rgb(0 0 0 / 30%)}@media(prefers-color-scheme:dark){:root:not([data-theme=light]){color-scheme:dark;--background:#0c111c;--surface:#141c2a;--surface-muted:#101827;--text:#eef3ff;--text-muted:#aab5cb;--border:#2a3750;--primary:#7da4ff;--primary-hover:#a6c0ff;--primary-soft:#1a2b50;--violet:#a68aff;--success:#60d894;--success-soft:#143b29;--danger:#ff8f9c;--danger-soft:#492029;--warning:#ffd173;--warning-soft:#493817;--unknown:#c0c8d8;--unknown-soft:#273145;--shadow:0 20px 60px rgb(0 0 0 / 30%)}}*{box-sizing:border-box}body{margin:0;color:var(--text);background:var(--background);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}a{color:inherit}a:focus-visible,button:focus-visible{outline:3px solid var(--primary);outline-offset:4px}.skip-link{position:fixed;z-index:100;top:12px;left:12px;padding:10px 14px;border-radius:8px;color:#fff;background:#172033;transform:translateY(-160%)}.skip-link:focus{transform:none}.container{width:min(1200px,calc(100% - 36px));margin:auto}.topbar{position:sticky;z-index:30;top:0;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--surface) 88%,transparent);backdrop-filter:blur(18px)}.topbar__content{display:flex;align-items:center;justify-content:space-between;min-height:76px;gap:28px}.brand{display:flex;align-items:center;gap:13px;text-decoration:none}.brand__icon{display:grid;width:42px;height:42px;place-items:center;border-radius:13px;color:#fff;background:linear-gradient(135deg,#245af5,#6d46e8);box-shadow:0 12px 28px rgb(36 90 245 / 28%);font-weight:900}.brand>span:last-child{display:grid;gap:2px}.brand small{color:var(--text-muted);font-size:.72rem;font-weight:650;letter-spacing:.08em;text-transform:uppercase}.topbar__navigation{display:flex;align-items:center;gap:22px}.topbar__navigation a{color:var(--text-muted);font-size:.9rem;font-weight:750;text-decoration:none}.theme-toggle{display:grid;width:40px;height:40px;padding:0;place-items:center;border:1px solid var(--border);border-radius:12px;color:var(--text);background:var(--surface);cursor:pointer}.hero{border-bottom:1px solid var(--border);background:radial-gradient(circle at 10% 10%,rgb(36 90 245 / 16%),transparent 32rem),radial-gradient(circle at 92% 25%,rgb(109 70 232 / 12%),transparent 28rem),var(--background)}.hero__content{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(300px,.75fr);align-items:center;gap:72px;min-height:500px;padding-block:72px}.eyebrow{margin:0 0 14px;color:var(--primary);font-size:.76rem;font-weight:900;letter-spacing:.19em;text-transform:uppercase}h1{margin:0;font-size:clamp(2.7rem,6vw,5rem);line-height:.99;letter-spacing:-.055em}.hero__description{max-width:720px;margin:24px 0 0;color:var(--text-muted);font-size:1.12rem;line-height:1.75}.summary-card,.card,.section{padding:25px;border:1px solid var(--border);border-radius:20px;background:var(--surface);box-shadow:var(--shadow)}.summary-card__label,.card__category{color:var(--primary);font-size:.72rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.summary-card strong{display:block;margin:10px 0 18px;font-size:2.4rem}.status,.badge{display:inline-flex;width:fit-content;padding:7px 11px;border:0;border-radius:999px;font-size:.74rem;font-weight:900;letter-spacing:.03em}.pass{color:var(--success);background:var(--success-soft)}.fail,.error{color:var(--danger);background:var(--danger-soft)}.warning{color:var(--warning)}.content{display:grid;gap:24px;padding-block:72px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.card__topline{display:flex;align-items:center;justify-content:space-between;gap:16px}.metric{margin:20px 0 6px;font-size:2rem;font-weight:850}.muted,.empty{color:var(--text-muted)}.section h2{margin:0 0 20px;font-size:clamp(1.7rem,3vw,2.5rem)}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse}th,td{padding:12px 10px;text-align:left;vertical-align:top;border-bottom:1px solid var(--border)}th{color:var(--text-muted);font-size:.75rem;text-transform:uppercase}code{color:var(--primary)}.footer{padding-block:28px;color:var(--text-muted);background:var(--surface)}.footer__content{display:flex;justify-content:space-between;gap:24px}.footer p{margin:0}.footer a{color:var(--primary);font-weight:800}@media(max-width:900px){.hero__content{grid-template-columns:1fr;gap:42px}.grid{grid-template-columns:1fr}}@media(max-width:520px){.container{width:min(100% - 24px,1200px)}.brand small,.topbar__navigation>a:last-of-type{display:none}.topbar__content{padding-block:15px}.hero__content{min-height:auto;padding-block:54px}.footer__content{flex-direction:column}.section{padding:20px}}
</style></head><body><a class="skip-link" href="#main-content">Aller au contenu principal</a><header class="topbar"><div class="container topbar__content"><a class="brand" href="../"><span class="brand__icon">Q</span><span><strong>SauceDemo</strong><small>Portail d'assurance qualité</small></span></a><nav class="topbar__navigation" aria-label="Liens du projet"><a href="../">Retour au portail</a><a href="https://github.com/maximejoannis/saucedemo-playwright-agents">Dépôt GitHub</a><button id="themeToggle" class="theme-toggle" aria-label="Changer le thème">◐</button></nav></div></header><main id="main-content"><section class="hero"><div class="container hero__content"><div><p class="eyebrow">Qualité du code</p><h1>Contrôles qualité</h1><p class="hero__description">Consultez les résultats des contrôles ESLint et Prettier appliqués au projet d'automatisation.</p></div><aside class="summary-card"><p class="summary-card__label">Statut global</p><strong>${passedChecks} / 2 contrôles</strong>${badge(summary.status === 'passed')}</aside></div></section><div class="container content"><section class="grid"><article class="card"><div class="card__topline"><span class="card__category">ESLint</span>${badge(eslintPassed)}</div><div class="metric">${eslintErrors} erreur${eslintErrors > 1 ? 's' : ''}</div><div class="muted">${eslintWarnings} avertissement${eslintWarnings > 1 ? 's' : ''} · ${eslintFiles.length} fichiers analysés</div></article><article class="card"><div class="card__topline"><span class="card__category">Prettier</span>${badge(prettierPassed)}</div><div class="metric">${nonCompliantFiles.length ? `${nonCompliantFiles.length} non conforme${nonCompliantFiles.length > 1 ? 's' : ''}` : 'Tous conformes'}</div><div class="muted">Contrôle réel du formatage</div></article><article class="card"><div class="card__topline"><span class="card__category">Statut global</span>${badge(summary.status === 'passed')}</div><div class="metric">${passedChecks} / 2</div><div class="muted">contrôles réussis</div></article></section><section class="section"><h2>Détails ESLint</h2><div class="table-wrap"><table><thead><tr><th>Fichier</th><th>Position</th><th>Règle</th><th>Message</th><th>Niveau</th></tr></thead><tbody>${issueRows}</tbody></table></div></section><section class="section"><h2>Détails Prettier</h2>${prettierDetails}</section><section class="section"><h2>Périmètre analysé</h2><p class="muted">Les contrôles utilisent la configuration réelle du projet et couvrent notamment <code>tests/</code>, <code>reporting/</code> et <code>playwright.config.ts</code>.</p><p class="muted">Généré le ${escapeHtml(new Date(generatedAt).toLocaleString('fr-FR'))}</p></section></div></main><footer class="footer"><div class="container footer__content"><p>Rapport généré automatiquement à partir des contrôles ESLint et Prettier.</p><a href="../">Retour au portail QA</a></div></footer><script>(()=>{const key='qa-portal-theme';const saved=localStorage.getItem(key);if(saved==='light'||saved==='dark')document.documentElement.dataset.theme=saved;document.getElementById('themeToggle').addEventListener('click',()=>{const current=document.documentElement.dataset.theme;const dark=matchMedia('(prefers-color-scheme: dark)').matches;const next=current?(current==='dark'?'light':'dark'):(dark?'light':'dark');document.documentElement.dataset.theme=next;localStorage.setItem(key,next)})})()</script></body></html>`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, 'index.html'), html, 'utf8');
await writeFile(path.join(outputDirectory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

console.log(`Quality report generated: quality-report/index.html
ESLint: ${eslintPassed ? 'PASS' : 'FAIL'} (${eslintErrors} errors, ${eslintWarnings} warnings, ${eslintFiles.length} files)
Prettier: ${prettierPassed ? 'PASS' : 'FAIL'} (${nonCompliantFiles.length} non-compliant files)
Quality Gate: ${summary.status === 'passed' ? 'PASS' : 'FAIL'} (${passedChecks}/2 checks passed)`);

if (summary.status !== 'passed') process.exitCode = 1;
