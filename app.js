const LEGACY_BASELINE_USERS = 9500;
const LEGACY_BASELINE_PACKAGES = 15200;
const PACKAGES_PER_DEVELOPER_BASE = LEGACY_BASELINE_PACKAGES / LEGACY_BASELINE_USERS;
const DEFAULT_USER_BASELINE = 50;
const DEFAULT_ANNUAL_PACKAGES = Math.max(
  1,
  Math.round((LEGACY_BASELINE_PACKAGES / LEGACY_BASELINE_USERS) * DEFAULT_USER_BASELINE)
);

const DEFAULTS = {
  companyName: "",
  annualPackagesManual: DEFAULT_ANNUAL_PACKAGES,
  hourlyRate: 50,
  curationUsers: DEFAULT_USER_BASELINE,
  jasUsers: DEFAULT_USER_BASELINE,
  riskAdjustment: 20,
};

const DISCOVERY_PROFILES = {
  late: { ide: 19.9, commit: 0, build: 40, staging: 40, prod: 0.1 },
  mixed: { ide: 35, commit: 8, build: 30, staging: 25, prod: 2 },
  shiftleft: { ide: 62, commit: 15, build: 15, staging: 7, prod: 1 },
};

const CATEGORY_RATIO = {
  criticalHigh: 9000 / 15200,
  bannedLicense: 2400 / 15200,
  unmanaged: 3600 / 15200,
  malicious: 200 / 15200,
};

const STAGE_TIMES = {
  replacement: { ide: 24, commit: 28, build: 36, staging: 101, prod: 493 },
  upgrade: { ide: 1.8, commit: 2.4, build: 3.6, staging: 15, prod: 96 },
  malicious: { ide: 36, commit: 40, build: 56, staging: 126, prod: 613 },
};

const CURATION_TIMES = {
  replacement: 4,
  upgrade: 1.2,
  malicious: 4,
};

const STAGE_LABELS = {
  ide: "IDE/Code",
  commit: "Source Commit",
  build: "Build",
  staging: "Staging",
  prod: "Production",
};

const CURATION_CATEGORY_LABELS = {
  criticalReplacement: "Critical/High CVE Replacement",
  criticalUpgrade: "Critical/High CVE Upgrade",
  bannedLicense: "Banned License Packages",
  unmanaged: "Unmaintained/Risky Packages",
  malicious: "Malicious Packages",
};

const JAS_COMPONENTS_BASE = {
  contextualDev: { label: "Contextual analysis for developer remediation", annualValue: 12514114 },
  contextualSecOps: { label: "Contextual analysis for security research", annualValue: 1055808 },
  k8sValidation: { label: "Kubernetes security validation productivity", annualValue: 2501591 },
  appLibValidation: { label: "Python/Node library config validation", annualValue: 442368 },
  terraformValidation: { label: "Terraform config validation", annualValue: 757187 },
};

const USER_PACK_SIZE = 50;
const USER_PACK_PRICE_USD = 27000;

const BASELINE_JAS_USERS = LEGACY_BASELINE_USERS;
const BASELINE_HOURLY_RATE = 57.6;

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const INTEGER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const DECIMAL = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const DECIMAL_2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function formatMonths(months) {
  if (months > 0 && months < 0.1) return "<0.1 months";
  return `${DECIMAL_2.format(months)} months`;
}

const form = document.getElementById("roi-form");
const presetBtn = document.getElementById("preset-btn");
const exportPdfBtn = document.getElementById("export-pdf-btn");
const warningNode = document.getElementById("form-warning");
const curationUsersInput = document.getElementById("curationUsers");
const curationReportNode = document.getElementById("curation-report");
const jasReportNode = document.getElementById("jas-report");
const curationInputsNode = document.getElementById("curation-inputs");
const jasInputsNode = document.getElementById("jas-inputs");
const toggleCurationBtn = document.getElementById("toggle-curation");
const toggleJasBtn = document.getElementById("toggle-jas");
const reportCompanyNode = document.getElementById("report-company");
const curationAnnualCostHint = document.getElementById("curationAnnualCostHint");
const jasAnnualCostHint = document.getElementById("jasAnnualCostHint");
const totalAnnualCostHint = document.getElementById("totalAnnualCostHint");
let activeReport = "curation";

function setDefaults() {
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    const node = document.getElementById(key);
    if (node) node.value = value;
  });
}

function syncAnnualPackagesFromCurationUsers() {
  const users = parseNumber("curationUsers");
  if (!Number.isFinite(users) || users <= 0) return;
  const annualPackages = Math.max(1, Math.round(users * PACKAGES_PER_DEVELOPER_BASE));
  document.getElementById("annualPackagesManual").value = annualPackages;
}

function parseNumber(id) {
  const raw = String(document.getElementById(id).value ?? "").trim();
  if (!raw) return NaN;
  return Number(raw.replace(/,/g, ""));
}

function parseInputs() {
  return {
    companyName: document.getElementById("companyName").value.trim(),
    annualPackagesManual: parseNumber("annualPackagesManual"),
    hourlyRate: parseNumber("hourlyRate"),
    discoveryProfile: "late",
    curationUsers: parseNumber("curationUsers"),
    jasUsers: parseNumber("jasUsers"),
    riskAdjustment: parseNumber("riskAdjustment"),
  };
}

function validate(input) {
  if (!Number.isFinite(input.hourlyRate) || input.hourlyRate <= 0) return "Hourly rate must be greater than 0.";
  if (!Number.isFinite(input.riskAdjustment) || input.riskAdjustment < 0 || input.riskAdjustment > 80)
    return "Risk adjustment should be between 0% and 80%.";
  if (activeReport === "curation") {
    if (!Number.isFinite(input.annualPackagesManual) || input.annualPackagesManual <= 0) return "Annual OSS package count must be greater than 0.";
    if (!Number.isFinite(input.curationUsers) || input.curationUsers <= 0) return "Curation users must be greater than 0.";
  } else if (!Number.isFinite(input.jasUsers) || input.jasUsers <= 0) {
    return "JAS users must be greater than 0.";
  }
  if (!DISCOVERY_PROFILES[input.discoveryProfile]) return "Please select a valid discovery profile.";
  return "";
}

function computeUserBasedInvestment(rawUsers) {
  const users = Math.max(1, Math.floor(rawUsers));
  const units = Math.ceil(users / USER_PACK_SIZE);
  return {
    users,
    units,
    annualInvestment: units * USER_PACK_PRICE_USD,
  };
}

function updateAnnualCostHints() {
  const curationUsers = parseNumber("curationUsers");
  const jasUsers = parseNumber("jasUsers");
  if (!Number.isFinite(curationUsers) || curationUsers <= 0 || !Number.isFinite(jasUsers) || jasUsers <= 0) {
    curationAnnualCostHint.textContent = "";
    jasAnnualCostHint.textContent = "";
    totalAnnualCostHint.textContent = "";
    return;
  }
  const curationPricing = computeUserBasedInvestment(curationUsers);
  const jasPricing = computeUserBasedInvestment(jasUsers);
  const total = curationPricing.annualInvestment + jasPricing.annualInvestment;
  curationAnnualCostHint.textContent =
    `Calculated annual cost: ${CURRENCY.format(curationPricing.annualInvestment)} (${curationPricing.units} packs)`;
  jasAnnualCostHint.textContent =
    `Calculated annual cost: ${CURRENCY.format(jasPricing.annualInvestment)} (${jasPricing.units} packs)`;
  totalAnnualCostHint.textContent = `Total annual cost (Curation + JAS): ${CURRENCY.format(total)}`;
}

function applyFinance(grossBenefit, investment, riskAdjustment) {
  const riskAdjustedBenefit = grossBenefit * (1 - riskAdjustment / 100);
  const netSavings = riskAdjustedBenefit - investment;
  const roi = investment > 0 ? netSavings / investment : 0;
  const paybackMonths = riskAdjustedBenefit > investment ? (investment / riskAdjustedBenefit) * 12 : 0;
  return { riskAdjustedBenefit, netSavings, roi, paybackMonths };
}

function calcCuration(input) {
  const dist = DISCOVERY_PROFILES[input.discoveryProfile];
  const annualPackages = input.annualPackagesManual;
  const pricing = computeUserBasedInvestment(input.curationUsers);

  const counts = {
    criticalTotal: annualPackages * CATEGORY_RATIO.criticalHigh,
    bannedLicense: annualPackages * CATEGORY_RATIO.bannedLicense,
    unmanaged: annualPackages * CATEGORY_RATIO.unmanaged,
    malicious: annualPackages * CATEGORY_RATIO.malicious,
  };

  const splitCounts = {
    criticalReplacement: counts.criticalTotal * 0.08,
    criticalUpgrade: counts.criticalTotal * 0.92,
    bannedLicense: counts.bannedLicense,
    unmanaged: counts.unmanaged,
    malicious: counts.malicious,
  };

  const categoryDefs = [
    ["criticalReplacement", STAGE_TIMES.replacement, CURATION_TIMES.replacement],
    ["criticalUpgrade", STAGE_TIMES.upgrade, CURATION_TIMES.upgrade],
    ["bannedLicense", STAGE_TIMES.replacement, CURATION_TIMES.replacement],
    ["unmanaged", STAGE_TIMES.replacement, CURATION_TIMES.replacement],
    ["malicious", STAGE_TIMES.malicious, CURATION_TIMES.malicious],
  ];

  let totalWithoutHours = 0;
  let totalWithHours = 0;
  const stageLeakageHours = { ide: 0, commit: 0, build: 0, staging: 0, prod: 0 };
  const byCategory = [];

  categoryDefs.forEach(([key, times, curationTime]) => {
    const count = splitCounts[key];
    let withoutHours = 0;
    Object.keys(stageLeakageHours).forEach((stage) => {
      const value = count * times[stage] * (dist[stage] / 100);
      stageLeakageHours[stage] += value;
      withoutHours += value;
    });
    const withHours = count * curationTime;
    const savedHours = Math.max(withoutHours - withHours, 0);
    totalWithoutHours += withoutHours;
    totalWithHours += withHours;
    byCategory.push({
      name: CURATION_CATEGORY_LABELS[key],
      savedHours,
      savedCost: savedHours * input.hourlyRate,
    });
  });

  const costWithout = totalWithoutHours * input.hourlyRate;
  const costWith = totalWithHours * input.hourlyRate;
  const grossBenefit = costWithout - costWith;
  const finance = applyFinance(grossBenefit, pricing.annualInvestment, input.riskAdjustment);

  const stageLeakageCost = {};
  Object.keys(stageLeakageHours).forEach((k) => {
    stageLeakageCost[k] = stageLeakageHours[k] * input.hourlyRate;
  });

  return {
    annualPackages,
    pricing,
    totalWithoutHours,
    totalWithHours,
    costWithout,
    costWith,
    grossBenefit,
    ...finance,
    byCategory: byCategory.sort((a, b) => b.savedCost - a.savedCost),
    stageLeakageHours,
    stageLeakageCost,
  };
}

function calcJAS(input) {
  const pricing = computeUserBasedInvestment(input.jasUsers);
  const scaleFactor = (input.jasUsers / BASELINE_JAS_USERS) * (input.hourlyRate / BASELINE_HOURLY_RATE);
  const byCapability = Object.values(JAS_COMPONENTS_BASE).map((item) => {
    const gross = item.annualValue * scaleFactor;
    const riskAdjusted = gross * (1 - input.riskAdjustment / 100);
    return {
      name: item.label,
      grossCost: gross,
      riskAdjustedCost: riskAdjusted,
      riskAdjustedHours: riskAdjusted / input.hourlyRate,
    };
  });

  const grossBenefit = byCapability.reduce((sum, item) => sum + item.grossCost, 0);
  const finance = applyFinance(grossBenefit, pricing.annualInvestment, input.riskAdjustment);

  return {
    pricing,
    grossBenefit,
    ...finance,
    byCapability: byCapability.sort((a, b) => b.riskAdjustedCost - a.riskAdjustedCost),
  };
}

function buildDualAxis(maxHours, maxCost) {
  const ticks = [0, 25, 50, 75, 100];
  const rows = ticks
    .map((tick, index) => {
      const hours = (maxHours * tick) / 100;
      const cost = (maxCost * tick) / 100;
      const edgeClass = index === 0 ? "axis-start" : index === ticks.length - 1 ? "axis-end" : "";
      return `<div class="axis-tick ${edgeClass}" style="left:${tick}%;">
        <span>${INTEGER.format(hours)} h</span>
        <span>${CURRENCY.format(cost)}</span>
      </div>`;
    })
    .join("");
  return `<div class="dual-axis"><div class="dual-axis-title">X-axis scale: Hours and Cost</div><div class="axis-track">${rows}</div></div>`;
}

function renderBars(containerId, items, defaultColor) {
  const container = document.getElementById(containerId);
  const maxHours = Math.max(...items.map((item) => item.hours), 1);
  const maxCost = Math.max(...items.map((item) => item.cost), 1);
  const rows = items
    .map((item) => {
      const width = (item.hours / maxHours) * 100;
      return `<div class="${item.rowClass}">
        <span class="name">${item.label}</span>
        <div class="bar-base"><div class="bar-fill ${item.colorClass || defaultColor}" style="width:${width}%"></div></div>
        <span class="value">${INTEGER.format(item.hours)} h | ${CURRENCY.format(item.cost)}</span>
      </div>`;
    })
    .join("");
  container.innerHTML = rows + buildDualAxis(maxHours, maxCost);
}

function renderCurationReport(input, curation) {
  document.getElementById("curation-kpi-savings").textContent = CURRENCY.format(curation.netSavings);
  document.getElementById("curation-kpi-hours").textContent = `${INTEGER.format(curation.grossBenefit / input.hourlyRate)} h`;
  document.getElementById("curation-kpi-roi").textContent = `${DECIMAL_2.format(curation.roi)}x`;
  document.getElementById("curation-kpi-payback").textContent = formatMonths(curation.paybackMonths);

  const top = curation.byCategory[0];
  document.getElementById("curation-summary-list").innerHTML = [
    `Curation pricing input: ${INTEGER.format(curation.pricing.users)} users (${curation.pricing.units} × ${USER_PACK_SIZE}-user packs) = ${CURRENCY.format(curation.pricing.annualInvestment)}/year.`,
    `Risk-adjusted annual Curation value: ${CURRENCY.format(curation.riskAdjustedBenefit)}.`,
    `Net annual Curation savings: ${CURRENCY.format(curation.netSavings)}.`,
    `Top Curation savings driver: ${top.name} (${CURRENCY.format(top.savedCost)} / ${INTEGER.format(top.savedHours)} h).`,
  ]
    .map((line) => `<li>${line}</li>`)
    .join("");

  document.getElementById("curation-summary-box").textContent =
    `Curation annual investment is calculated from users: ${INTEGER.format(curation.pricing.users)} users => ${CURRENCY.format(curation.pricing.annualInvestment)} per year. ` +
    `Expected net annual value is ${CURRENCY.format(curation.netSavings)} after risk adjustment.`;

  renderBars(
    "curation-chart-before-after",
    [
      { label: "No Curation remediation cost", hours: curation.totalWithoutHours, cost: curation.costWithout, rowClass: "compare-row", colorClass: "blue" },
      { label: "With Curation remediation cost", hours: curation.totalWithHours, cost: curation.costWith, rowClass: "compare-row", colorClass: "green" },
      { label: "Risk-adjusted Curation annual benefit", hours: curation.riskAdjustedBenefit / input.hourlyRate, cost: curation.riskAdjustedBenefit, rowClass: "compare-row", colorClass: "mix" },
      { label: "Calculated Curation investment", hours: curation.pricing.annualInvestment / input.hourlyRate, cost: curation.pricing.annualInvestment, rowClass: "compare-row", colorClass: "blue" },
    ],
    "blue"
  );

  renderBars(
    "curation-chart-breakdown",
    curation.byCategory.map((item) => ({
      label: item.name,
      hours: item.savedHours,
      cost: item.savedCost,
      rowClass: "break-row",
      colorClass: "mix",
    })),
    "mix"
  );

  renderBars(
    "curation-chart-stage-leakage",
    Object.keys(STAGE_LABELS).map((stage) => ({
      label: STAGE_LABELS[stage],
      hours: curation.stageLeakageHours[stage],
      cost: curation.stageLeakageCost[stage],
      rowClass: "stage-row",
      colorClass: "blue",
    })),
    "blue"
  );
}

function renderJASReport(input, jas) {
  document.getElementById("jas-kpi-savings").textContent = CURRENCY.format(jas.netSavings);
  document.getElementById("jas-kpi-hours").textContent = `${INTEGER.format(jas.grossBenefit / input.hourlyRate)} h`;
  document.getElementById("jas-kpi-roi").textContent = `${DECIMAL_2.format(jas.roi)}x`;
  document.getElementById("jas-kpi-payback").textContent = formatMonths(jas.paybackMonths);

  const top = jas.byCapability[0];
  document.getElementById("jas-summary-list").innerHTML = [
    `JAS pricing input: ${INTEGER.format(jas.pricing.users)} users (${jas.pricing.units} × ${USER_PACK_SIZE}-user packs) = ${CURRENCY.format(jas.pricing.annualInvestment)}/year.`,
    `Risk-adjusted annual JAS value: ${CURRENCY.format(jas.riskAdjustedBenefit)}.`,
    `Net annual JAS savings: ${CURRENCY.format(jas.netSavings)}.`,
    `Top JAS capability driver: ${top.name} (${CURRENCY.format(top.riskAdjustedCost)} / ${INTEGER.format(top.riskAdjustedHours)} h).`,
  ]
    .map((line) => `<li>${line}</li>`)
    .join("");

  document.getElementById("jas-summary-box").textContent =
    `JAS annual investment is calculated from users: ${INTEGER.format(jas.pricing.users)} users => ${CURRENCY.format(jas.pricing.annualInvestment)} per year. ` +
    `Expected net annual value is ${CURRENCY.format(jas.netSavings)} after risk adjustment.`;

  renderBars(
    "jas-chart-before-after",
    [
      { label: "Risk-adjusted JAS annual benefit", hours: jas.riskAdjustedBenefit / input.hourlyRate, cost: jas.riskAdjustedBenefit, rowClass: "compare-row", colorClass: "mix" },
      { label: "Calculated JAS investment", hours: jas.pricing.annualInvestment / input.hourlyRate, cost: jas.pricing.annualInvestment, rowClass: "compare-row", colorClass: "blue" },
      { label: "Net annual JAS savings", hours: Math.max(jas.netSavings, 0) / input.hourlyRate, cost: Math.max(jas.netSavings, 0), rowClass: "compare-row", colorClass: "green" },
    ],
    "blue"
  );

  renderBars(
    "jas-chart-breakdown",
    jas.byCapability.map((item) => ({
      label: item.name,
      hours: item.riskAdjustedHours,
      cost: item.riskAdjustedCost,
      rowClass: "break-row",
      colorClass: "mix",
    })),
    "mix"
  );
}

function setActiveReport(reportName) {
  activeReport = reportName === "jas" ? "jas" : "curation";
  const showCuration = activeReport === "curation";
  curationReportNode.hidden = !showCuration;
  jasReportNode.hidden = showCuration;
  curationInputsNode.hidden = !showCuration;
  jasInputsNode.hidden = showCuration;
  toggleCurationBtn.classList.toggle("is-active", showCuration);
  toggleJasBtn.classList.toggle("is-active", !showCuration);
  toggleCurationBtn.setAttribute("aria-pressed", String(showCuration));
  toggleJasBtn.setAttribute("aria-pressed", String(!showCuration));
}

function run() {
  updateAnnualCostHints();
  const input = parseInputs();
  const warning = validate(input);
  warningNode.textContent = warning;
  if (warning) return;

  document.getElementById("report-title").textContent = "Executive ROI Summary";
  if (input.companyName) {
    reportCompanyNode.textContent = input.companyName;
    reportCompanyNode.hidden = false;
  } else {
    reportCompanyNode.textContent = "";
    reportCompanyNode.hidden = true;
  }
  document.getElementById("report-subtitle").textContent =
    `Scenario: ${INTEGER.format(input.annualPackagesManual)} OSS packages/year, Curation users ${INTEGER.format(input.curationUsers)}, JAS users ${INTEGER.format(input.jasUsers)}.`;

  if (activeReport === "curation") {
    const curation = calcCuration(input);
    renderCurationReport(input, curation);
  } else {
    const jas = calcJAS(input);
    renderJASReport(input, jas);
  }
}

presetBtn.addEventListener("click", () => {
  setDefaults();
  run();
});

form.addEventListener("input", () => {
  run();
});

curationUsersInput.addEventListener("input", () => {
  syncAnnualPackagesFromCurationUsers();
});

curationUsersInput.addEventListener("change", () => {
  syncAnnualPackagesFromCurationUsers();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  run();
});

toggleCurationBtn.addEventListener("click", () => {
  setActiveReport("curation");
  run();
});

toggleJasBtn.addEventListener("click", () => {
  setActiveReport("jas");
  run();
});

exportPdfBtn.addEventListener("click", () => {
  window.print();
});

setDefaults();
syncAnnualPackagesFromCurationUsers();
setActiveReport(activeReport);
run();
