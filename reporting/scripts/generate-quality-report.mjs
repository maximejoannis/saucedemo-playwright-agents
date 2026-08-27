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

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SD · QA Quality</title><style>
:root{--bg:#090c0b;--panel:#111614;--panel-2:#171d1a;--text:#f3f7f1;--muted:#9ba69e;--line:#29312c;--lime:#c7ff4a;--cyan:#4be5ff;--orange:#ffac4b;--red:#ff6b72}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,sans-serif}.shell{width:min(1160px,calc(100% - 32px));margin:auto}header{border-bottom:1px solid var(--line);padding:22px 0}.brand{display:flex;align-items:center;gap:14px}.logo{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--lime);color:var(--bg);font-weight:900}.brand strong{font-size:20px}.muted{color:var(--muted)}header .shell{display:flex;justify-content:space-between;align-items:center}.hero{padding:58px 0 34px}.eyebrow{color:var(--lime);font-weight:800;letter-spacing:.16em}.hero h1{font-size:clamp(52px,10vw,108px);line-height:.9;margin:18px 0}.hero p{max-width:720px;color:var(--muted);font-size:17px}.badge{display:inline-block;border:1px solid currentColor;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:900;letter-spacing:.08em}.pass{color:var(--lime)}.fail,.error{color:var(--red)}.warning{color:var(--orange)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card,.section{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:24px}.card .metric{font-size:36px;font-weight:850;margin:12px 0 6px}.section{margin:16px 0 32px}.section h2{margin-top:0}table{width:100%;border-collapse:collapse}th,td{text-align:left;border-bottom:1px solid var(--line);padding:12px 10px;vertical-align:top}th{color:var(--muted);font-size:12px;text-transform:uppercase}.level{font-weight:800}.empty{color:var(--muted)}code{color:var(--cyan)}footer{color:var(--muted);padding:12px 0 42px}@media(max-width:760px){.grid{grid-template-columns:1fr}header .shell{align-items:flex-start;gap:16px;flex-direction:column}.section{overflow:auto}}
</style></head><body><header><div class="shell"><div class="brand"><div class="logo">SD</div><div><strong>QA Quality</strong><div class="muted">ESLint + Prettier</div></div></div><time class="muted">Généré le ${escapeHtml(new Date(generatedAt).toLocaleString('fr-FR'))}</time></div></header>
<main class="shell"><section class="hero"><div class="eyebrow">QUALITÉ DU CODE</div><h1>${summary.status === 'passed' ? 'PASS' : 'FAIL'}</h1><p>Le quality gate vérifie la conformité statique du code TypeScript/JavaScript et son formatage.</p></section>
<section class="grid"><article class="card"><div class="muted">ESLint</div><div class="metric">${eslintErrors} erreurs</div><div>${eslintWarnings} warnings · ${eslintFiles.length} fichiers analysés</div><p>${badge(eslintPassed)}</p></article><article class="card"><div class="muted">Prettier</div><div class="metric">${nonCompliantFiles.length ? `${nonCompliantFiles.length} non conforme${nonCompliantFiles.length > 1 ? 's' : ''}` : 'Tous conformes'}</div><div>Contrôle réel via format:check</div><p>${badge(prettierPassed)}</p></article><article class="card"><div class="muted">Quality Gate</div><div class="metric">${passedChecks} / 2</div><div>contrôles réussis</div><p>${badge(summary.status === 'passed')}</p></article></section>
<section class="section"><h2>Détails ESLint</h2><table><thead><tr><th>Fichier</th><th>Position</th><th>Règle</th><th>Message</th><th>Niveau</th></tr></thead><tbody>${issueRows}</tbody></table></section>
<section class="section"><h2>Détails Prettier</h2>${prettierDetails}</section>
<section class="section"><h2>Scope analysé</h2><p class="muted">Les contrôles utilisent la configuration réelle du projet et couvrent notamment <code>tests/</code>, <code>reporting/</code> et <code>playwright.config.ts</code>. Les artefacts et chemins déclarés dans les configurations d’exclusion ne sont pas analysés.</p></section></main><footer class="shell">SauceDemo Playwright Automation · Rapport autonome HTML/CSS natif</footer></body></html>`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, 'index.html'), html, 'utf8');
await writeFile(path.join(outputDirectory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

console.log(`Quality report generated: quality-report/index.html
ESLint: ${eslintPassed ? 'PASS' : 'FAIL'} (${eslintErrors} errors, ${eslintWarnings} warnings, ${eslintFiles.length} files)
Prettier: ${prettierPassed ? 'PASS' : 'FAIL'} (${nonCompliantFiles.length} non-compliant files)
Quality Gate: ${summary.status === 'passed' ? 'PASS' : 'FAIL'} (${passedChecks}/2 checks passed)`);

if (summary.status !== 'passed') process.exitCode = 1;
