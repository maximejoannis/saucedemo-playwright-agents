const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const templatePath = path.join(root, 'reporting', 'coverage');
const specsPath = path.join(root, 'tests', 'specs');
const outputPath = path.join(root, 'coverage-report');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const plan = read('tests', 'specs', 'plan-tests-fonctionnels-saucedemo.md');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}
const rate = (part, total) => (total ? Number(((part / total) * 100).toFixed(1)) : 0);
function assertUnique(values, label) {
  const duplicates = [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
  if (duplicates.length) throw new Error(`${label} dupliqué(s) : ${duplicates.join(', ')}`);
}
const featureHeadings = [...plan.matchAll(/^## (?!Périmètre|Matrice|Données|Stratégie|Critères)(.+)$/gmu)];
const scenarios = [];
for (let index = 0; index < featureHeadings.length; index += 1) {
  const feature = featureHeadings[index][1].trim();
  const start = featureHeadings[index].index + featureHeadings[index][0].length;
  const end = featureHeadings[index + 1]?.index ?? plan.length;
  const section = plan.slice(start, end);
  const headings = [...section.matchAll(/^### (TC-[A-Z]+-\d+)\s+[—-]\s+(.+)$/gmu)];
  for (let scenarioIndex = 0; scenarioIndex < headings.length; scenarioIndex += 1) {
    const heading = headings[scenarioIndex];
    const block = section.slice(
      heading.index + heading[0].length,
      headings[scenarioIndex + 1]?.index ?? section.length,
    );
    scenarios.push({
      id: heading[1],
      name: heading[2].trim(),
      feature,
      type: block.match(/\*\*Type\s*:\*\*\s*([^\r\n]+)/u)?.[1].trim() ?? 'Non renseigné',
      priority: block.match(/\*\*Priorité\s*:\*\*\s*([^\r\n]+)/u)?.[1].trim() ?? 'Non renseignée',
      tags: [...block.matchAll(/@[\w-]+/gu)].map((match) => match[0]),
    });
  }
}
assertUnique(
  scenarios.map(({ id }) => id),
  'Test Case dans le plan fonctionnel',
);

const specFiles = walk(specsPath).filter((file) => file.endsWith('.spec.ts'));
const functionalFiles = specFiles.filter((file) => !file.split(path.sep).includes('e2e'));
const functionalSource = functionalFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const e2eSource = specFiles
  .filter((file) => file.split(path.sep).includes('e2e'))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n');
const automatedIds = new Set(functionalSource.match(/TC-[A-Z]+-\d+/gu) ?? []);
const e2eIds = new Set(e2eSource.match(/E2E-\d+/gu) ?? []);
for (const scenario of scenarios) scenario.automated = automatedIds.has(scenario.id);
const features = [...new Set(scenarios.map(({ feature }) => feature))];
const axes = ['Passant', 'Non passant', 'Erreur'];
const matrix = features.map((feature) => {
  const cells = Object.fromEntries(
    axes.map((axis) => [
      axis,
      scenarios.some((scenario) => scenario.feature === feature && scenario.type === axis && scenario.automated),
    ]),
  );
  return { feature, cells, rate: rate(Object.values(cells).filter(Boolean).length, axes.length) };
});
const coveredFeatures = features.filter((feature) =>
  scenarios.some((scenario) => scenario.feature === feature && scenario.automated),
).length;
const automatedScenarios = scenarios.filter(({ automated }) => automated).length;
const coveredCells = matrix.reduce((total, row) => total + Object.values(row.cells).filter(Boolean).length, 0);
const tags = Object.fromEntries(
  ['positive', 'negative', 'error', 'smoke', 'regression'].map((tag) => [
    tag,
    scenarios.filter((scenario) => scenario.automated && scenario.tags.includes(`@${tag}`)).length,
  ]),
);
const data = {
  generatedAt: new Date().toISOString(),
  functionalCoverage: {
    features: { covered: coveredFeatures, total: features.length, rate: rate(coveredFeatures, features.length) },
    scenarios: {
      automated: automatedScenarios,
      planned: scenarios.length,
      rate: rate(automatedScenarios, scenarios.length),
    },
    matrix: {
      covered: coveredCells,
      total: features.length * axes.length,
      rate: rate(coveredCells, features.length * axes.length),
    },
  },
  tags,
  e2e: { total: e2eIds.size },
  axes,
  matrix,
  scenarios,
};

fs.mkdirSync(outputPath, { recursive: true });
for (const asset of ['index.html', 'styles.css', 'app.js'])
  fs.copyFileSync(path.join(templatePath, asset), path.join(outputPath, asset));
fs.writeFileSync(path.join(outputPath, 'data.json'), `${JSON.stringify(data, null, 2)}\n`);
fs.writeFileSync(path.join(outputPath, 'coverage-data.js'), `window.COVERAGE_DATA = ${JSON.stringify(data)};\n`);
console.log(
  `Functional coverage report generated\n\nFeatures: ${coveredFeatures}/${features.length} (${rate(coveredFeatures, features.length)}%)\nScenarios: ${automatedScenarios}/${scenarios.length} (${rate(automatedScenarios, scenarios.length)}%)\nMatrix: ${coveredCells}/${features.length * axes.length} (${rate(coveredCells, features.length * axes.length)}%)\nE2E: ${e2eIds.size}`,
);
