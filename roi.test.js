const assert = require("node:assert/strict");
const fs = require("node:fs");

function createNode(id) {
  return {
    id,
    value: "",
    textContent: "",
    innerHTML: "",
    hidden: false,
    classList: { toggle: () => {} },
    setAttribute: () => {},
    addEventListener: () => {},
  };
}

function bootApp() {
  const ids = [
    "roi-form",
    "preset-btn",
    "export-pdf-btn",
    "form-warning",
    "report-company",
    "curation-report",
    "jas-report",
    "curation-inputs",
    "jas-inputs",
    "toggle-curation",
    "toggle-jas",
    "curationAnnualCostHint",
    "jasAnnualCostHint",
    "totalAnnualCostHint",
    "companyName",
    "annualPackagesManual",
    "hourlyRate",
    "curationUsers",
    "jasUsers",
    "riskAdjustment",
    "report-title",
    "report-subtitle",
    "curation-kpi-savings",
    "curation-kpi-hours",
    "curation-kpi-roi",
    "curation-kpi-payback",
    "curation-summary-list",
    "curation-summary-box",
    "curation-chart-before-after",
    "curation-chart-breakdown",
    "curation-chart-stage-leakage",
    "jas-kpi-savings",
    "jas-kpi-hours",
    "jas-kpi-roi",
    "jas-kpi-payback",
    "jas-summary-list",
    "jas-summary-box",
    "jas-chart-before-after",
    "jas-chart-breakdown",
  ];

  const nodes = {};
  for (const id of ids) nodes[id] = createNode(id);

  global.document = {
    getElementById: (id) => nodes[id],
  };
  global.window = { print: () => {} };

  const code = fs.readFileSync("./app.js", "utf8");
  const appFactory = new Function(
    "document",
    "window",
    `${code}\nreturn { syncAnnualPackagesFromCurationUsers, run };`
  );
  const api = appFactory(global.document, global.window);

  return { nodes, ...api };
}

function extractNumber(text) {
  const n = Number(String(text).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function runTests() {
  const { nodes, syncAnnualPackagesFromCurationUsers, run } = bootApp();

  // default should follow 50-user baseline from PPT ratio (15200/9500*50 ~= 80)
  assert.equal(Number(nodes.annualPackagesManual.value), 80);

  // curation users should auto-sync annual package volume
  nodes.curationUsers.value = 200;
  syncAnnualPackagesFromCurationUsers();
  assert.equal(Number(nodes.annualPackagesManual.value), 320);

  nodes.jasUsers.value = 50;
  nodes.hourlyRate.value = 57.6;
  nodes.riskAdjustment.value = 20;
  run();

  const roiText = nodes["curation-kpi-roi"].textContent;
  const paybackText = nodes["curation-kpi-payback"].textContent;
  const netSavingsText = nodes["curation-kpi-savings"].textContent;

  const roi = extractNumber(roiText);
  const paybackMonths = extractNumber(paybackText);
  const netSavings = extractNumber(netSavingsText);

  assert.ok(roi > 0, `Unexpected ROI: ${roiText}`);
  assert.ok(netSavings > 0, `Unexpected net savings: ${netSavingsText}`);
  assert.ok(paybackMonths > 0 && paybackMonths < 24, `Unexpected payback: ${paybackText}`);
}

runTests();
console.log("roi.test.js passed");
