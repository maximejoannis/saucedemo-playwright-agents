import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const readJson = (file) => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
const playwright = readJson('test-results/results.json');
const quality = readJson('quality-report/summary.json');
const coverage = readJson('coverage-report/data.json').summary;
const stats = playwright.stats;
const passed = stats.expected + stats.flaky;
const failed = stats.unexpected;
const total = passed + failed + stats.skipped;

const data = {
  generatedAt: new Date().toISOString(),
  branch: process.env.GITHUB_REF_NAME ?? 'local',
  commitSha: process.env.GITHUB_SHA ?? 'local',
  playwright: { status: failed === 0 ? 'PASS' : 'FAIL', total, passed, failed },
  qualityGate: { status: quality.status, passed: quality.passed, total: quality.total },
  coverage: {
    features: coverage.features,
    userStories: coverage.userStories,
    acceptanceCriteria: coverage.acceptanceCriteria,
    testCases: coverage.functionalTestCases,
    risks: coverage.risks,
    automatedRisks: coverage.automatedRisks,
    riskCoverage: coverage.riskCoverage,
    significantRisks: coverage.significantRisks,
    exploratoryCharters: coverage.exploratoryCharters,
    qaScopeCoverage: coverage.qaScopeCoverage,
  },
};

const output = path.join(root, 'site', 'portal-data.js');
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `/* global window */\nwindow.__QA_PORTAL_DATA__ = ${JSON.stringify(data, null, 2)};\n`, 'utf8');
console.log(`Donn\u00e9es du portail QA g\u00e9n\u00e9r\u00e9es : ${path.relative(root, output)}`);
