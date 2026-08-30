import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '../..');
const sourceDirectory = path.join(projectRoot, 'reporting', 'quality');
const outputDirectory = path.join(projectRoot, 'quality-report');
const npmCli = process.env.npm_execpath;
const definitions = [
  { id: 'prettier', name: 'Prettier', script: 'format:check' },
  { id: 'eslint', name: 'ESLint', script: 'lint' },
  { id: 'typescript', name: 'TypeScript', script: 'typecheck' },
];

function executeCheck(definition) {
  const startedAt = process.hrtime.bigint();
  const executable = npmCli ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const arguments_ = npmCli ? [npmCli, 'run', definition.script] : ['run', definition.script];
  const result = spawnSync(executable, arguments_, {
    cwd: projectRoot,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    shell: false,
    windowsHide: true,
  });
  const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
  const exitCode = result.status ?? 1;
  return {
    id: definition.id,
    name: definition.name,
    command: `npm run ${definition.script}`,
    status: exitCode === 0 ? 'PASS' : 'FAIL',
    exitCode,
    durationMs: Math.round(durationMs),
    stdout: result.stdout?.trim() ?? '',
    stderr: [result.stderr?.trim(), result.error?.message].filter(Boolean).join('\n'),
  };
}

mkdirSync(outputDirectory, { recursive: true });
const checks = definitions.map((definition) => {
  const check = executeCheck(definition);
  console.log(`${check.name.padEnd(10)} ${check.status.padEnd(4)} ${check.durationMs} ms`);
  return check;
});
const passed = checks.filter((check) => check.status === 'PASS').length;
const failed = checks.length - passed;
const summary = {
  generatedAt: new Date().toISOString(),
  status: failed === 0 ? 'PASS' : 'FAIL',
  passed,
  failed,
  total: checks.length,
  checks,
};

for (const asset of ['index.html', 'styles.css', 'app.js']) {
  cpSync(path.join(sourceDirectory, asset), path.join(outputDirectory, asset));
}
writeFileSync(path.join(outputDirectory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
writeFileSync(
  path.join(outputDirectory, 'quality-data.js'),
  `window.QUALITY_GATE_DATA = ${JSON.stringify(summary)};\n`,
  'utf8',
);

const template = readFileSync(path.join(sourceDirectory, 'index.html'), 'utf8');
if (/\b3\s*\/\s*3\b/.test(template)) throw new Error('Le score doit provenir exclusivement des données générées.');

console.log(`\nQUALITY GATE: ${summary.status}`);
console.log(`${passed} / ${checks.length}`);
console.log(`Rapport: ${path.relative(projectRoot, path.join(outputDirectory, 'index.html'))}`);
if (failed > 0) process.exitCode = 1;
