const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const templatePath = path.join(root, 'reporting', 'coverage');
const specsPath = path.join(root, 'tests', 'specs');
const outputPath = path.join(root, 'coverage-report');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const plan = read('tests', 'specs', 'plan-tests-fonctionnels-saucedemo.md');
const requirementsSource = read('tests', 'specs', 'requirements', 'user-stories.md');
const rtmSource = read('tests', 'specs', 'requirements', 'traceability-matrix.md');

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
function markdownRows(source, headerStart) {
  const lines = source.split(/\r?\n/u);
  const headerIndex = lines.findIndex((line) => line.startsWith(headerStart));
  if (headerIndex < 0) throw new Error(`Table Markdown introuvable : ${headerStart}`);
  const rows = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.startsWith('|')) break;
    rows.push(
      line
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim()),
    );
  }
  return rows;
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

const userStoryIds = [...requirementsSource.matchAll(/^### (US-[A-Z]+-\d+)\s+[—-]/gmu)].map((match) => match[1]);
const acceptanceRows = [...requirementsSource.matchAll(/^\| (AC-[A-Z]+-\d+) \| (.+?) \| (.+?) \|$/gmu)].map(
  ([, id, criterion, tests]) => ({ id, criterion, testCases: tests.match(/TC-[A-Z]+-\d+/gu) ?? [] }),
);
assertUnique(userStoryIds, 'User Story');
assertUnique(
  acceptanceRows.map(({ id }) => id),
  'Acceptance Criterion',
);

const specFiles = walk(specsPath).filter((file) => file.endsWith('.spec.ts'));
const functionalFiles = specFiles.filter((file) => !file.split(path.sep).includes('e2e'));
const sourceByRelativeFile = new Map(
  specFiles.map((file) => [path.relative(root, file).split(path.sep).join('/'), fs.readFileSync(file, 'utf8')]),
);
const functionalSource = functionalFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const e2eSource = specFiles
  .filter((file) => file.split(path.sep).includes('e2e'))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n');
const automatedIds = new Set(functionalSource.match(/TC-[A-Z]+-\d+/gu) ?? []);
const e2eIds = new Set(e2eSource.match(/E2E-\d+/gu) ?? []);
const plannedIds = new Set(scenarios.map(({ id }) => id));
for (const acceptanceCriterion of acceptanceRows) {
  const missing = acceptanceCriterion.testCases.filter((id) => !plannedIds.has(id));
  if (missing.length) throw new Error(`${acceptanceCriterion.id} référence un TC inexistant : ${missing.join(', ')}`);
}

const traceability = markdownRows(rtmSource, '| User Story').map(
  ([userStory, acceptanceCriterion, testCase, type, priority, nature, declaredAutomated, playwrightFile]) => {
    const file = playwrightFile.replaceAll('`', '');
    if (!sourceByRelativeFile.has(file)) throw new Error(`Fichier Playwright inexistant dans la RTM : ${file}`);
    const automated = declaredAutomated.includes('✅') && sourceByRelativeFile.get(file).includes(testCase);
    return { userStory, acceptanceCriterion, testCase, type, priority, nature, automated, playwrightFile: file };
  },
);
assertUnique(
  traceability.map(({ testCase }) => testCase),
  'Test Case dans la RTM',
);
const userStorySet = new Set(userStoryIds);
const acceptanceSet = new Set(acceptanceRows.map(({ id }) => id));
for (const row of traceability) {
  if (!plannedIds.has(row.testCase)) throw new Error(`La RTM référence un TC inexistant : ${row.testCase}`);
  if (!userStorySet.has(row.userStory))
    throw new Error(`${row.testCase} référence une User Story inexistante : ${row.userStory}`);
  if (row.nature === 'Requirement validation' && !acceptanceSet.has(row.acceptanceCriterion))
    throw new Error(`TC de validation sans Acceptance Criterion : ${row.testCase}`);
  if (row.nature === 'Characterization' && row.acceptanceCriterion !== '—')
    throw new Error(`TC Characterization lié à tort à un Acceptance Criterion : ${row.testCase}`);
  if (!['Requirement validation', 'Characterization'].includes(row.nature))
    throw new Error(`Nature inconnue pour ${row.testCase} : ${row.nature}`);
}

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
const coveredAcceptanceCriteria = new Set(
  traceability
    .filter((row) => row.nature === 'Requirement validation' && row.automated)
    .map(({ acceptanceCriterion }) => acceptanceCriterion),
);
const acceptanceToUserStory = new Map(
  traceability
    .filter((row) => row.acceptanceCriterion !== '—')
    .map(({ acceptanceCriterion, userStory }) => [acceptanceCriterion, userStory]),
);
const coveredUserStories = new Set(
  [...coveredAcceptanceCriteria]
    .map((acceptanceCriterion) => acceptanceToUserStory.get(acceptanceCriterion))
    .filter(Boolean),
);
const requirementValidation = traceability.filter(({ nature }) => nature === 'Requirement validation').length;
const characterization = traceability.filter(({ nature }) => nature === 'Characterization').length;
const tracedIds = new Set(traceability.map(({ testCase }) => testCase));
const untraced = scenarios.filter(({ id }) => !tracedIds.has(id)).length;
const requirements = {
  userStories: {
    covered: coveredUserStories.size,
    total: userStoryIds.length,
    rate: rate(coveredUserStories.size, userStoryIds.length),
  },
  acceptanceCriteria: {
    covered: coveredAcceptanceCriteria.size,
    total: acceptanceRows.length,
    rate: rate(coveredAcceptanceCriteria.size, acceptanceRows.length),
  },
  traceability: { requirementValidation, characterization, untraced },
};
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
  requirements,
  tags,
  e2e: { total: e2eIds.size },
  axes,
  matrix,
  scenarios,
  traceability,
};

fs.mkdirSync(outputPath, { recursive: true });
for (const asset of ['index.html', 'styles.css', 'app.js'])
  fs.copyFileSync(path.join(templatePath, asset), path.join(outputPath, asset));
fs.writeFileSync(path.join(outputPath, 'data.json'), `${JSON.stringify(data, null, 2)}\n`);
fs.writeFileSync(path.join(outputPath, 'coverage-data.js'), `window.COVERAGE_DATA = ${JSON.stringify(data)};\n`);
console.log(
  `Functional coverage report generated\n\nFeatures: ${coveredFeatures}/${features.length} (${rate(coveredFeatures, features.length)}%)\nScenarios: ${automatedScenarios}/${scenarios.length} (${rate(automatedScenarios, scenarios.length)}%)\nMatrix: ${coveredCells}/${features.length * axes.length} (${rate(coveredCells, features.length * axes.length)}%)\nE2E: ${e2eIds.size}\n\nUser Stories: ${requirements.userStories.covered}/${requirements.userStories.total}\nAcceptance Criteria: ${requirements.acceptanceCriteria.covered}/${requirements.acceptanceCriteria.total}\nRequirements Coverage: ${requirements.acceptanceCriteria.rate}%\nRequirement validation tests: ${requirementValidation}\nCharacterization tests: ${characterization}\nUntraced tests: ${untraced}`,
);
