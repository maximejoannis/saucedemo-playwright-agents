const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const sourceDirectory = path.join(root, 'reporting', 'coverage');
const outputDirectory = path.join(root, 'coverage-report');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const sources = {
  stories: read('tests', 'requirements', 'user-stories.md'),
  criteria: read('tests', 'requirements', 'acceptance-criteria.md'),
  traceability: read('tests', 'requirements', 'traceability-matrix.md'),
  plan: read('tests', 'test-plan', 'plan-tests-fonctionnels-saucedemo.md'),
};

const fail = (message) => {
  throw new Error(`Contrôle de cohérence impossible : ${message}`);
};
const rate = (part, total) => (total ? Number(((part / total) * 100).toFixed(1)) : 0);
function assertUnique(values, label) {
  const duplicates = [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
  if (duplicates.length) fail(`${label} dupliqué(s) : ${duplicates.join(', ')}`);
}
function row(line) {
  return line
    .trim()
    .replace(/^\||\|$/gu, '')
    .split('|')
    .map((cell) => cell.trim().replace(/`/gu, ''));
}
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const featureRows = sources.stories
  .split(/\r?\n/u)
  .map(row)
  .filter(
    (cells) => cells.length === 3 && /^(Authentification|Catalogue|Tri|Panier|Checkout|Session)$/u.test(cells[0]),
  );
assertUnique(
  featureRows.map(([feature]) => feature),
  'Fonctionnalité',
);

const userStories = [...sources.stories.matchAll(/^## (US-\d+)\s+[—-]\s+(.+)$/gmu)].map((match) => {
  const featureRow = featureRows.find((cells) => cells[1] === match[1]);
  if (!featureRow) fail(`${match[1]} n'est reliée à aucune fonctionnalité`);
  return { id: match[1], title: match[2].trim(), feature: featureRow[0] };
});
assertUnique(
  userStories.map(({ id }) => id),
  'User Story',
);

const acceptanceCriteria = [];
let currentStory;
for (const line of sources.criteria.split(/\r?\n/u)) {
  currentStory = line.match(/^## (US-\d+)\s+[—-]/u)?.[1] ?? currentStory;
  const heading = line.match(/^### (AC-[A-Z]+-\d+)\s+[—-]\s+(.+)$/u);
  if (heading) acceptanceCriteria.push({ id: heading[1], title: heading[2].trim(), userStory: currentStory });
  const description = line.match(/^- \*\*Description\s*:\*\*\s*(.+)$/u);
  if (description && acceptanceCriteria.length) acceptanceCriteria.at(-1).description = description[1].trim();
}
assertUnique(
  acceptanceCriteria.map(({ id }) => id),
  "Critère d'acceptation",
);
for (const criterion of acceptanceCriteria) {
  if (!userStories.some(({ id }) => id === criterion.userStory)) fail(`${criterion.id} référence une US inexistante`);
  criterion.description ??= criterion.title;
}
for (const story of userStories) {
  if (!acceptanceCriteria.some(({ userStory }) => userStory === story.id)) fail(`${story.id} ne possède aucun AC`);
}

const traceRows = sources.traceability
  .split(/\r?\n/u)
  .filter((line) => /^\| (Authentification|Catalogue|Tri|Panier|Checkout|Session) \|/u.test(line))
  .map(row);
const testCases = traceRows.map(([feature, userStory, criterion, id, type, priority, rawTags]) => ({
  id,
  feature,
  userStory,
  acceptanceCriteria: criterion.split(/,\s*/u),
  type,
  priority,
  tags: rawTags.match(/@[\w-]+/gu) ?? [],
}));
assertUnique(
  testCases.map(({ id }) => id),
  'TC dans la matrice',
);
const planned = [...sources.plan.matchAll(/^### (TC-[A-Z]+-\d+)\s+[—-]\s+(.+)$/gmu)].map((match) => ({
  id: match[1],
  title: match[2].trim(),
}));
assertUnique(
  planned.map(({ id }) => id),
  'TC dans le plan',
);
for (const testCase of testCases) {
  const planCase = planned.find(({ id }) => id === testCase.id);
  if (!planCase) fail(`${testCase.id} existe dans la matrice mais pas dans le plan`);
  testCase.title = planCase.title;
  const story = userStories.find(({ id }) => id === testCase.userStory);
  if (!story || story.feature !== testCase.feature)
    fail(`${testCase.id} relie une fonctionnalité et une US incompatibles`);
  for (const id of testCase.acceptanceCriteria) {
    const criterion = acceptanceCriteria.find((item) => item.id === id);
    if (!criterion || criterion.userStory !== testCase.userStory)
      fail(`${testCase.id} porte une référence AC invalide : ${id}`);
  }
}
for (const planCase of planned)
  if (!testCases.some(({ id }) => id === planCase.id)) fail(`${planCase.id} est absent de la matrice`);

const playwrightTests = [];
for (const file of walk(path.join(root, 'tests', 'specs')).filter((item) => item.endsWith('.spec.ts'))) {
  const source = fs.readFileSync(file, 'utf8');
  const activeTitles = [...source.matchAll(/\btest\(\s*['"]/gu)].length;
  const recognizedBefore = playwrightTests.length;
  for (const match of source.matchAll(/test\(\s*['"]((?:TC-[A-Z]+-\d+|E2E-\d+)[^'"]*)['"]/gu)) {
    const id = match[1].match(/^(TC-[A-Z]+-\d+|E2E-\d+)/u)[1];
    const context = source.slice(Math.max(0, match.index - 500), match.index);
    playwrightTests.push({
      id,
      title: match[1].replace(/^\S+\s+(?:@[\w-]+\s+)*-\s*/u, ''),
      tags: match[1].match(/@[\w-]+/gu) ?? [],
      file: path.relative(root, file).replaceAll('\\', '/'),
      referencedStory: [...context.matchAll(/\/\/\s*(US-\d+)/gu)].at(-1)?.[1],
      referencedCriteria: [...context.matchAll(/\/\/\s*((?:AC-[A-Z]+-\d+)(?:,\s*AC-[A-Z]+-\d+)*)/gu)]
        .at(-1)?.[1]
        .split(/,\s*/u),
      transversalPath: [...context.matchAll(/\/\/ Parcours transversal\s*:\s*(.+)$/gmu)].at(-1)?.[1].trim(),
    });
  }
  if (playwrightTests.length - recognizedBefore !== activeTitles)
    fail(`${path.relative(root, file)} contient un test actif sans ID TC/E2E reconnu`);
}
assertUnique(
  playwrightTests.map(({ id }) => id),
  'ID Playwright actif',
);
const automatedFunctional = playwrightTests.filter(({ id }) => id.startsWith('TC-'));
const e2e = playwrightTests.filter(({ id }) => id.startsWith('E2E-'));
for (const test of automatedFunctional) {
  if (test.file.includes('/e2e/')) fail(`${test.id} est placé dans la couche E2E`);
}
for (const test of e2e) {
  if (!test.file.includes('/e2e/')) fail(`${test.id} est placé parmi les tests fonctionnels`);
}
for (const automated of automatedFunctional) {
  const documented = testCases.find(({ id }) => id === automated.id);
  if (!documented) fail(`${automated.id} est automatisé mais non documenté`);
  if (automated.referencedStory !== documented.userStory) fail(`${automated.id} porte une référence US invalide`);
  if ((automated.referencedCriteria ?? []).sort().join() !== [...documented.acceptanceCriteria].sort().join())
    fail(`${automated.id} porte une référence AC invalide ou incomplète`);
  const missingTags = documented.tags.filter((tag) => !automated.tags.includes(tag));
  if (missingTags.length) fail(`${automated.id} ne porte pas : ${missingTags.join(', ')}`);
  documented.automated = true;
  documented.specFile = automated.file;
}
const missing = testCases.filter(({ automated }) => !automated).map(({ id }) => id);
if (missing.length) fail(`TC sans test Playwright : ${missing.join(', ')}`);
for (const criterion of acceptanceCriteria) {
  criterion.testCases = testCases.filter((tc) => tc.acceptanceCriteria.includes(criterion.id)).map(({ id }) => id);
  criterion.automated =
    criterion.testCases.length > 0 && criterion.testCases.every((id) => testCases.find((tc) => tc.id === id).automated);
  if (!criterion.testCases.length) fail(`${criterion.id} n'est couvert par aucun TC`);
  if (!criterion.automated) fail(`${criterion.id} n'est pas automatisé`);
}
for (const test of e2e) {
  test.automated = true;
  test.domains = test.transversalPath?.split(/\s*→\s*/u) ?? [];
  if (testCases.some(({ id }) => id === test.id)) fail(`${test.id} est comptabilisé comme TC`);
}

for (const story of userStories) {
  story.acceptanceCriteria = acceptanceCriteria.filter((ac) => ac.userStory === story.id).map(({ id }) => id);
  story.testCases = testCases.filter((tc) => tc.userStory === story.id).map(({ id }) => id);
  story.coveredAcceptanceCriteria = story.acceptanceCriteria.filter(
    (id) => acceptanceCriteria.find((ac) => ac.id === id).automated,
  ).length;
  story.automatedTestCases = story.testCases.filter((id) => testCases.find((tc) => tc.id === id).automated).length;
  story.status =
    story.coveredAcceptanceCriteria === story.acceptanceCriteria.length &&
    story.automatedTestCases === story.testCases.length
      ? 'PASS'
      : 'INCOMPLET';
}
const features = featureRows.map(([name, storyId]) => {
  const criteria = acceptanceCriteria.filter(({ userStory }) => userStory === storyId);
  const cases = testCases.filter(({ feature }) => feature === name);
  return {
    name,
    userStory: storyId,
    acceptanceCriteria: { covered: criteria.filter(({ automated }) => automated).length, total: criteria.length },
    testCases: { automated: cases.filter(({ automated }) => automated).length, total: cases.length },
    types: Object.fromEntries(
      ['Passant', 'Non passant', 'Erreur'].map((type) => [type, cases.filter((tc) => tc.type === type).length]),
    ),
    smoke: cases.filter(({ tags }) => tags.includes('@smoke')).length,
    regression: cases.filter(({ tags }) => tags.includes('@regression')).length,
  };
});
const summary = {
  features: {
    covered: features.filter(
      (feature) =>
        feature.acceptanceCriteria.covered === feature.acceptanceCriteria.total &&
        feature.testCases.automated === feature.testCases.total,
    ).length,
    total: features.length,
  },
  userStories: { covered: userStories.filter(({ status }) => status === 'PASS').length, total: userStories.length },
  acceptanceCriteria: {
    covered: acceptanceCriteria.filter(({ automated }) => automated).length,
    total: acceptanceCriteria.length,
  },
  functionalTestCases: { automated: testCases.filter(({ automated }) => automated).length, total: testCases.length },
  e2e: e2e.length,
  playwrightTests: playwrightTests.length,
  types: Object.fromEntries(
    ['Passant', 'Non passant', 'Erreur'].map((type) => [type, testCases.filter((tc) => tc.type === type).length]),
  ),
  functionalSmoke: testCases.filter(({ tags }) => tags.includes('@smoke')).length,
  functionalRegression: testCases.filter(({ tags }) => tags.includes('@regression')).length,
  e2eSmoke: e2e.filter(({ tags }) => tags.includes('@smoke')).length,
  e2eRegression: e2e.filter(({ tags }) => tags.includes('@regression')).length,
};
summary.qaScopeCoverage = rate(summary.functionalTestCases.automated, summary.functionalTestCases.total);
summary.globalSmoke = summary.functionalSmoke + summary.e2eSmoke;
summary.globalRegression = summary.functionalRegression + summary.e2eRegression;

const data = {
  generatedAt: new Date().toISOString(),
  summary,
  features,
  userStories,
  acceptanceCriteria,
  testCases,
  e2e,
};
fs.mkdirSync(outputDirectory, { recursive: true });
for (const asset of ['index.html', 'styles.css', 'app.js'])
  fs.copyFileSync(path.join(sourceDirectory, asset), path.join(outputDirectory, asset));
fs.writeFileSync(path.join(outputDirectory, 'data.json'), `${JSON.stringify(data, null, 2)}\n`);
console.log(
  `Rapport QA généré et cohérent.\nFonctionnalités : ${summary.features.covered}/${summary.features.total}\nUser Stories : ${summary.userStories.covered}/${summary.userStories.total}\nAC : ${summary.acceptanceCriteria.covered}/${summary.acceptanceCriteria.total}\nTC : ${summary.functionalTestCases.automated}/${summary.functionalTestCases.total}\nE2E : ${summary.e2e}\nTests Playwright : ${summary.playwrightTests}\nCouverture du périmètre QA défini : ${summary.qaScopeCoverage} %`,
);
