import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const readJson = (file) => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
const playwright = readJson('test-results/results.json');
const quality = readJson('quality-report/summary.json');
const coverageData = readJson('coverage-report/data.json');
const coverage = coverageData.summary;
const stats = playwright.stats;
const collected = stats.expected + stats.flaky + stats.unexpected + stats.skipped;
const executionAvailable = stats.skipped === 0 && collected > 0;
const passed = executionAvailable ? stats.expected + stats.flaky : null;
const failed = executionAvailable ? stats.unexpected : null;
const executed = executionAvailable ? passed + failed : 0;
const risks = coverageData.risks;
const riskLevels = risks.reduce((counts, risk) => {
  const level = risk.level.split(' (')[0];
  counts[level] = (counts[level] ?? 0) + 1;
  return counts;
}, {});
const significantRisks = coverage.significantRisks;
const riskSummary = {
  total: risks.length,
  critical: riskLevels.Critique ?? 0,
  high: riskLevels.Élevé ?? 0,
  covered: coverage.riskCoverage.Couvert ?? 0,
  partiallyCovered: coverage.riskCoverage['Partiellement couvert'] ?? 0,
  significantWithMultipleControls: significantRisks.multipleDefenses,
  significantWithSingleControl: significantRisks.singleDefense,
  significantNeedingAdditionalCoverage: significantRisks.needingAdditionalCoverage,
};

const data = {
  generatedAt: new Date().toISOString(),
  branch: process.env.GITHUB_REF_NAME ?? 'local',
  commitSha: process.env.GITHUB_SHA ?? 'local',
  playwright: {
    status: executionAvailable ? (failed === 0 ? 'PASS' : 'FAIL') : 'UNAVAILABLE',
    defined: coverage.playwrightTests,
    collected,
    executionAvailable,
    executed,
    passed,
    failed,
    skipped: stats.skipped,
    startedAt: stats.startTime ?? null,
    source: executionAvailable
      ? 'Campagne Playwright réellement exécutée'
      : 'Collecte Playwright (--list), pas une exécution',
    lastExecutionAvailable: executionAvailable,
  },
  qualityGate: { status: quality.status, passed: quality.passed, total: quality.total },
  coverage: {
    features: coverage.features,
    userStories: coverage.userStories,
    acceptanceCriteria: coverage.acceptanceCriteria,
    testCases: coverage.functionalTestCases,
    priorities: coverage.priorities,
    risks: coverage.risks,
    riskCoverage: coverage.riskCoverage,
    significantRisks: coverage.significantRisks,
    riskSummary,
    riskLevels,
    criticalAndHighRisks: risks.filter(({ level }) => /^(Critique|Élevé)/u.test(level)),
    uncertainties: [
      'Taux, formule et règle d’arrondi de la taxe non définis.',
      'Comportement attendu d’une commande vide non défini.',
      'Persistance après reconnexion ou changement d’utilisateur non définie.',
      'Protection des routes autres que Cart non définie.',
      'Expiration et reprise de session non définies.',
      'Formats et longueurs des données de livraison non définis.',
      'Référence fiable pour vérifier la correspondance produit/image absente.',
    ],
    exploratoryCharters: coverage.exploratoryCharters,
    techniques: coverage.techniques,
    automationRate: coverage.automationRate,
    acceptanceCriteriaLabel: 'Critères d’acceptation reliés à au moins un Test Case',
  },
};

const output = path.join(root, 'site', 'portal-data.js');
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `/* global window */\nwindow.__QA_PORTAL_DATA__ = ${JSON.stringify(data, null, 2)};\n`, 'utf8');
console.log(`Donn\u00e9es du portail QA g\u00e9n\u00e9r\u00e9es : ${path.relative(root, output)}`);
