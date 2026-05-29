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

const STAGE_KEYS = ["ide", "commit", "build", "staging", "prod"];

const JAS_COMPONENTS_BASE = {
  contextualDev:       { tKey: "jasCatContextualDev",       annualValue: 12514114 },
  contextualSecOps:    { tKey: "jasCatContextualSecOps",    annualValue: 1055808  },
  k8sValidation:       { tKey: "jasCatK8sValidation",       annualValue: 2501591  },
  appLibValidation:    { tKey: "jasCatAppLibValidation",     annualValue: 442368   },
  terraformValidation: { tKey: "jasCatTerraformValidation", annualValue: 757187   },
};

const USER_PACK_SIZE = 50;
const USER_PACK_PRICE_USD = 27000;

const BASELINE_JAS_USERS = LEGACY_BASELINE_USERS;
const BASELINE_HOURLY_RATE = 57.6;

/* ── Translations ─────────────────────────────────────────────── */
const T = {
  en: {
    eyebrow:            "JFrog Curation Business Case",
    heroTitle:          "Curation Cost-Savings Executive Report",
    heroSubtitle:       "Minimal inputs, automatic leadership-ready ROI charts, and PDF export.",
    heroBadgeLabel:     "Leader Ready",
    heroBadgeValue:     "ROI + Chart + PDF",
    controlsTitle:      "Quick Inputs",
    reportModeLabel:    "Report Mode",
    hourlyRateLabel:    "Avg. Fully-Burdened Hourly Rate (USD/hr)",
    curationInputsTitle:"Curation Inputs",
    curationUsersLabel: "Curation User Number",
    packPriceHint:      "$27,000 per 50 users/year (rounded up by user pack)",
    jasInputsTitle:     "JAS Inputs",
    jasUsersLabel:      "JAS User Number",
    companyNameLabel:   "Organization Name (Optional)",
    resetBtn:           "Reset Defaults",
    modelHint:          "Model baseline follows the Dell/JFrog Curation value assessment deck you provided.",
    reportTitle:        "Executive ROI Summary",
    exportBtn:          "Export PDF",
    curationReportTitle:"Curation Report",
    execSummaryTitle:   "Executive Summary",
    kpiSavings:         "Annual Net Savings",
    kpiHours:           "Annual Hours Saved",
    kpiROI:             "ROI Multiple",
    kpiPayback:         "Payback Period",
    curationChart1:     "Chart 1: Curation Cost and Benefit Comparison",
    curationChart2:     "Chart 2: Curation Savings by Category",
    curationChart3:     "Chart 3: Curation Cost Leakage by SDLC Stage",
    jasReportTitle:     "JAS Report",
    jasChart1:          "Chart 1: JAS Cost and Benefit Comparison",
    jasChart2:          "Chart 2: JAS Savings by Capability",
    // Formatters
    monthsUnit:         "months",
    lessThanMonths:     "<0.1 months",
    // Prepared-for prefix
    preparedFor:        "Prepared for:",
    // Axis
    axisLabel:          "X-axis scale: Hours and Cost",
    // Report subtitle tokens
    scenarioLabel:      "Scenario",
    ossPackages:        "OSS packages/year",
    curationUsersCount: "Curation users",
    jasUsersCount:      "JAS users",
    // Cost hints
    calcAnnualCost:     (cost, units) => `Calculated annual cost: ${cost} (${units} packs)`,
    totalAnnualCost:    (total)        => `Total annual cost (Curation + JAS): ${total}`,
    // Stage labels
    stageIDE:    "IDE/Code",
    stageCommit: "Source Commit",
    stageBuild:  "Build",
    stageStaging:"Staging",
    stageProd:   "Production",
    // Curation category labels
    catCriticalReplacement: "Critical/High CVE Replacement",
    catCriticalUpgrade:     "Critical/High CVE Upgrade",
    catBannedLicense:       "Banned License Packages",
    catUnmanaged:           "Unmaintained/Risky Packages",
    catMalicious:           "Malicious Packages",
    // JAS capability labels
    jasCatContextualDev:       "Contextual analysis for developer remediation",
    jasCatContextualSecOps:    "Contextual analysis for security research",
    jasCatK8sValidation:       "Kubernetes security validation productivity",
    jasCatAppLibValidation:    "Python/Node library config validation",
    jasCatTerraformValidation: "Terraform config validation",
    // Bar chart row labels
    barNoCuration:       "No Curation remediation cost",
    barWithCuration:     "With Curation remediation cost",
    barCurationBenefit:  "Curation annual benefit",
    barCurationInvestment:"Calculated Curation investment",
    barJASBenefit:       "JAS annual benefit",
    barJASInvestment:    "Calculated JAS investment",
    barJASNet:           "Net annual JAS savings",
    // Summary list sentence builders
    curationPricingLine: (users, units, pack, cost) =>
      `Curation pricing input: ${users} users (${units} × ${pack}-user packs) = ${cost}/year.`,
    curationNetLine:     (val)  => `Net annual Curation savings: ${val}.`,
    curationTopLine:     (name, cost, hrs) =>
      `Top Curation savings driver: ${name} (${cost} / ${hrs} h).`,
    curationSummaryBox:  (users, cost, net) =>
      `Curation annual investment: ${users} users => ${cost} per year. Expected net annual value: ${net}.`,
    jasPricingLine:      (users, units, pack, cost) =>
      `JAS pricing input: ${users} users (${units} × ${pack}-user packs) = ${cost}/year.`,
    jasNetLine:          (val)  => `Net annual JAS savings: ${val}.`,
    jasTopLine:          (name, cost, hrs) =>
      `Top JAS capability driver: ${name} (${cost} / ${hrs} h).`,
    jasSummaryBox:       (users, cost, net) =>
      `JAS annual investment: ${users} users => ${cost} per year. Expected net annual value: ${net}.`,
  },
  zh: {
    eyebrow:            "JFrog Curation 商业案例",
    heroTitle:          "Curation 成本节省执行报告",
    heroSubtitle:       "最少输入，自动生成高层就绪的ROI图表，并可导出PDF。",
    heroBadgeLabel:     "高层就绪",
    heroBadgeValue:     "ROI + 图表 + PDF",
    controlsTitle:      "快速输入",
    reportModeLabel:    "报告模式",
    hourlyRateLabel:    "平均全负担工时成本（美元/小时）",
    curationInputsTitle:"Curation 参数",
    curationUsersLabel: "Curation 用户数",
    packPriceHint:      "每50用户/年 $27,000（按用户包向上取整）",
    jasInputsTitle:     "JAS 参数",
    jasUsersLabel:      "JAS 用户数",
    companyNameLabel:   "组织名称（可选）",
    resetBtn:           "恢复默认值",
    modelHint:          "模型基准来自您提供的 Dell/JFrog Curation 价值评估报告。",
    reportTitle:        "投资回报率执行摘要",
    exportBtn:          "导出 PDF",
    curationReportTitle:"Curation 报告",
    execSummaryTitle:   "执行摘要",
    kpiSavings:         "年净节省",
    kpiHours:           "年节省工时",
    kpiROI:             "投资回报倍数",
    kpiPayback:         "投资回收期",
    curationChart1:     "图表1：Curation 成本与收益对比",
    curationChart2:     "图表2：Curation 各类别节省",
    curationChart3:     "图表3：Curation 各SDLC阶段成本泄漏",
    jasReportTitle:     "JAS 报告",
    jasChart1:          "图表1：JAS 成本与收益对比",
    jasChart2:          "图表2：JAS 各能力节省",
    // Formatters
    monthsUnit:         "个月",
    lessThanMonths:     "<0.1 个月",
    // Prepared-for prefix
    preparedFor:        "准备给：",
    // Axis
    axisLabel:          "X轴刻度：工时与成本",
    // Report subtitle tokens
    scenarioLabel:      "场景",
    ossPackages:        "OSS软件包/年",
    curationUsersCount: "Curation用户",
    jasUsersCount:      "JAS用户",
    // Cost hints
    calcAnnualCost:     (cost, units) => `计算年成本：${cost}（${units}包）`,
    totalAnnualCost:    (total)        => `Curation + JAS 总年成本：${total}`,
    // Stage labels
    stageIDE:    "IDE/代码",
    stageCommit: "源代码提交",
    stageBuild:  "构建",
    stageStaging:"预发布",
    stageProd:   "生产",
    // Curation category labels
    catCriticalReplacement: "关键/高危CVE替换包",
    catCriticalUpgrade:     "关键/高危CVE升级包",
    catBannedLicense:       "禁止许可证包",
    catUnmanaged:           "未维护/风险包",
    catMalicious:           "恶意包",
    // JAS capability labels
    jasCatContextualDev:       "开发者修复的上下文分析",
    jasCatContextualSecOps:    "安全研究的上下文分析",
    jasCatK8sValidation:       "Kubernetes安全验证生产力",
    jasCatAppLibValidation:    "Python/Node库配置验证",
    jasCatTerraformValidation: "Terraform配置验证",
    // Bar chart row labels
    barNoCuration:        "无Curation修复成本",
    barWithCuration:      "有Curation修复成本",
    barCurationBenefit:   "Curation年收益",
    barCurationInvestment:"Curation年度投资",
    barJASBenefit:        "JAS年收益",
    barJASInvestment:     "JAS年度投资",
    barJASNet:            "JAS年净节省",
    // Summary list sentence builders
    curationPricingLine: (users, units, pack, cost) =>
      `Curation定价输入：${users}用户（${units}×${pack}用户包）= ${cost}/年。`,
    curationNetLine:     (val)  => `年度Curation净节省：${val}。`,
    curationTopLine:     (name, cost, hrs) =>
      `Curation最大节省驱动因素：${name}（${cost} / ${hrs}小时）。`,
    curationSummaryBox:  (users, cost, net) =>
      `Curation年度投入：${users}用户 => ${cost}/年。预期年净价值：${net}。`,
    jasPricingLine:      (users, units, pack, cost) =>
      `JAS定价输入：${users}用户（${units}×${pack}用户包）= ${cost}/年。`,
    jasNetLine:          (val)  => `年度JAS净节省：${val}。`,
    jasTopLine:          (name, cost, hrs) =>
      `JAS最大能力驱动因素：${name}（${cost} / ${hrs}小时）。`,
    jasSummaryBox:       (users, cost, net) =>
      `JAS年度投入：${users}用户 => ${cost}/年。预期年净价值：${net}。`,
  },
};

const CURATION_CATEGORY_T_KEYS = {
  criticalReplacement: "catCriticalReplacement",
  criticalUpgrade:     "catCriticalUpgrade",
  bannedLicense:       "catBannedLicense",
  unmanaged:           "catUnmanaged",
  malicious:           "catMalicious",
};

const STAGE_T_KEYS = {
  ide:     "stageIDE",
  commit:  "stageCommit",
  build:   "stageBuild",
  staging: "stageStaging",
  prod:    "stageProd",
};

let currentLang = "en";

function t(key) {
  const lang = T[currentLang] || T.en;
  return lang[key] !== undefined ? lang[key] : (T.en[key] !== undefined ? T.en[key] : key);
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (typeof val === "string") el.textContent = val;
  });
}

/* ── Formatters ───────────────────────────────────────────────── */
const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const INTEGER  = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const DECIMAL  = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const DECIMAL_2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatMonths(months) {
  if (months > 0 && months < 0.1) return t("lessThanMonths");
  return `${DECIMAL.format(months)} ${t("monthsUnit")}`;
}

/* ── DOM refs ─────────────────────────────────────────────────── */
const form               = document.getElementById("roi-form");
const presetBtn          = document.getElementById("preset-btn");
const exportPdfBtn       = document.getElementById("export-pdf-btn");
const warningNode        = document.getElementById("form-warning");
const curationUsersInput = document.getElementById("curationUsers");
const curationReportNode = document.getElementById("curation-report");
const jasReportNode      = document.getElementById("jas-report");
const curationInputsNode = document.getElementById("curation-inputs");
const jasInputsNode      = document.getElementById("jas-inputs");
const toggleCurationBtn  = document.getElementById("toggle-curation");
const toggleJasBtn       = document.getElementById("toggle-jas");
const reportCompanyNode  = document.getElementById("report-company");
const curationAnnualCostHint = document.getElementById("curationAnnualCostHint");
const jasAnnualCostHint      = document.getElementById("jasAnnualCostHint");
const totalAnnualCostHint    = document.getElementById("totalAnnualCostHint");

let activeReport = "curation";

/* ── Input helpers ────────────────────────────────────────────── */
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
  if (!raw) return 0;
  const n = Number(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function parseInputs() {
  return {
    companyName:          document.getElementById("companyName").value.trim(),
    annualPackagesManual: parseNumber("annualPackagesManual"),
    hourlyRate:           parseNumber("hourlyRate"),
    discoveryProfile:     "late",
    curationUsers:        parseNumber("curationUsers"),
    jasUsers:             parseNumber("jasUsers"),
  };
}

function zeroOutActiveReport() {
  const isCuration = activeReport === "curation";
  const prefix = isCuration ? "curation" : "jas";
  document.getElementById(`${prefix}-kpi-savings`).textContent  = CURRENCY.format(0);
  document.getElementById(`${prefix}-kpi-hours`).textContent    = `${INTEGER.format(0)} h`;
  document.getElementById(`${prefix}-kpi-roi`).textContent      = `${DECIMAL_2.format(0)}x`;
  document.getElementById(`${prefix}-kpi-payback`).textContent  = formatMonths(0);
  document.getElementById(`${prefix}-summary-list`).innerHTML   = "";
  document.getElementById(`${prefix}-summary-box`).textContent  = "";
  const charts = isCuration
    ? ["curation-chart-before-after", "curation-chart-breakdown", "curation-chart-stage-leakage"]
    : ["jas-chart-before-after", "jas-chart-breakdown"];
  charts.forEach((id) => { document.getElementById(id).innerHTML = ""; });
}

function validate(input) {
  if (!Number.isFinite(input.hourlyRate) || input.hourlyRate <= 0)
    return "Hourly rate must be greater than 0.";
  if (activeReport === "curation") {
    if (!Number.isFinite(input.annualPackagesManual) || input.annualPackagesManual <= 0)
      return "Annual OSS package count must be greater than 0.";
    if (!Number.isFinite(input.curationUsers) || input.curationUsers <= 0)
      return "Curation users must be greater than 0.";
  } else if (!Number.isFinite(input.jasUsers) || input.jasUsers <= 0) {
    return "JAS users must be greater than 0.";
  }
  if (!DISCOVERY_PROFILES[input.discoveryProfile]) return "Please select a valid discovery profile.";
  return "";
}

/* ── Finance ──────────────────────────────────────────────────── */
function computeUserBasedInvestment(rawUsers) {
  const users = Math.max(1, Math.floor(rawUsers));
  const units = Math.ceil(users / USER_PACK_SIZE);
  return { users, units, annualInvestment: units * USER_PACK_PRICE_USD };
}

function updateAnnualCostHints() {
  const curationUsers = parseNumber("curationUsers");
  const jasUsers      = parseNumber("jasUsers");
  if (!Number.isFinite(curationUsers) || curationUsers <= 0 ||
      !Number.isFinite(jasUsers) || jasUsers <= 0) {
    curationAnnualCostHint.textContent = "";
    jasAnnualCostHint.textContent      = "";
    totalAnnualCostHint.textContent    = "";
    return;
  }
  const curationPricing = computeUserBasedInvestment(curationUsers);
  const jasPricing      = computeUserBasedInvestment(jasUsers);
  const total           = curationPricing.annualInvestment + jasPricing.annualInvestment;
  curationAnnualCostHint.textContent = t("calcAnnualCost")(
    CURRENCY.format(curationPricing.annualInvestment), curationPricing.units);
  jasAnnualCostHint.textContent = t("calcAnnualCost")(
    CURRENCY.format(jasPricing.annualInvestment), jasPricing.units);
  totalAnnualCostHint.textContent = t("totalAnnualCost")(CURRENCY.format(total));
}

function applyFinance(grossBenefit, investment) {
  const netSavings    = grossBenefit - investment;
  const roi           = investment > 0 ? netSavings / investment : 0;
  const paybackMonths = grossBenefit > investment ? (investment / grossBenefit) * 12 : 0;
  return { riskAdjustedBenefit: grossBenefit, netSavings, roi, paybackMonths };
}

/* ── Calculation ──────────────────────────────────────────────── */
function calcCuration(input) {
  const dist         = DISCOVERY_PROFILES[input.discoveryProfile];
  const annualPackages = input.annualPackagesManual;
  const pricing      = computeUserBasedInvestment(input.curationUsers);

  const counts = {
    criticalTotal: annualPackages * CATEGORY_RATIO.criticalHigh,
    bannedLicense: annualPackages * CATEGORY_RATIO.bannedLicense,
    unmanaged:     annualPackages * CATEGORY_RATIO.unmanaged,
    malicious:     annualPackages * CATEGORY_RATIO.malicious,
  };

  const splitCounts = {
    criticalReplacement: counts.criticalTotal * 0.08,
    criticalUpgrade:     counts.criticalTotal * 0.92,
    bannedLicense:       counts.bannedLicense,
    unmanaged:           counts.unmanaged,
    malicious:           counts.malicious,
  };

  const categoryDefs = [
    ["criticalReplacement", STAGE_TIMES.replacement, CURATION_TIMES.replacement],
    ["criticalUpgrade",     STAGE_TIMES.upgrade,     CURATION_TIMES.upgrade    ],
    ["bannedLicense",       STAGE_TIMES.replacement, CURATION_TIMES.replacement],
    ["unmanaged",           STAGE_TIMES.replacement, CURATION_TIMES.replacement],
    ["malicious",           STAGE_TIMES.malicious,   CURATION_TIMES.malicious  ],
  ];

  let totalWithoutHours = 0;
  let totalWithHours    = 0;
  const stageLeakageHours = { ide: 0, commit: 0, build: 0, staging: 0, prod: 0 };
  const byCategory = [];

  categoryDefs.forEach(([key, times, curationTime]) => {
    const count = splitCounts[key];
    let withoutHours = 0;
    STAGE_KEYS.forEach((stage) => {
      const value = count * times[stage] * (dist[stage] / 100);
      stageLeakageHours[stage] += value;
      withoutHours += value;
    });
    const withHours  = count * curationTime;
    const savedHours = Math.max(withoutHours - withHours, 0);
    totalWithoutHours += withoutHours;
    totalWithHours    += withHours;
    byCategory.push({ key, savedHours, savedCost: savedHours * input.hourlyRate });
  });

  const costWithout  = totalWithoutHours * input.hourlyRate;
  const costWith     = totalWithHours    * input.hourlyRate;
  const grossBenefit = costWithout - costWith;
  const finance      = applyFinance(grossBenefit, pricing.annualInvestment);

  const stageLeakageCost = {};
  STAGE_KEYS.forEach((k) => { stageLeakageCost[k] = stageLeakageHours[k] * input.hourlyRate; });

  return {
    annualPackages, pricing,
    totalWithoutHours, totalWithHours,
    costWithout, costWith, grossBenefit,
    ...finance,
    byCategory: byCategory.sort((a, b) => b.savedCost - a.savedCost),
    stageLeakageHours, stageLeakageCost,
  };
}

function calcJAS(input) {
  const pricing     = computeUserBasedInvestment(input.jasUsers);
  const scaleFactor = (input.jasUsers / BASELINE_JAS_USERS) * (input.hourlyRate / BASELINE_HOURLY_RATE);
  const byCapability = Object.entries(JAS_COMPONENTS_BASE).map(([key, item]) => {
    const gross = item.annualValue * scaleFactor;
    return {
      key,
      tKey:              item.tKey,
      grossCost:         gross,
      riskAdjustedCost:  gross,
      riskAdjustedHours: gross / input.hourlyRate,
    };
  });

  const grossBenefit = byCapability.reduce((sum, item) => sum + item.grossCost, 0);
  const finance      = applyFinance(grossBenefit, pricing.annualInvestment);

  return {
    pricing, grossBenefit, ...finance,
    byCapability: byCapability.sort((a, b) => b.riskAdjustedCost - a.riskAdjustedCost),
  };
}

/* ── Charts ───────────────────────────────────────────────────── */
function buildDualAxis(maxHours, maxCost) {
  const ticks = [0, 25, 50, 75, 100];
  const rows  = ticks.map((tick, index) => {
    const hours    = (maxHours * tick) / 100;
    const cost     = (maxCost  * tick) / 100;
    const edgeClass = index === 0
      ? "axis-start" : index === ticks.length - 1 ? "axis-end" : "";
    return `<div class="axis-tick ${edgeClass}" style="left:${tick}%;">
      <span>${INTEGER.format(hours)} h</span>
      <span>${CURRENCY.format(cost)}</span>
    </div>`;
  }).join("");
  return `<div class="dual-axis"><div class="dual-axis-title">${t("axisLabel")}</div><div class="axis-track">${rows}</div></div>`;
}

function renderBars(containerId, items, defaultColor) {
  const container = document.getElementById(containerId);
  const maxHours  = Math.max(...items.map((item) => item.hours), 1);
  const maxCost   = Math.max(...items.map((item) => item.cost),  1);
  const rows = items.map((item) => {
    const width = (item.hours / maxHours) * 100;
    return `<div class="${item.rowClass}">
      <span class="name">${item.label}</span>
      <div class="bar-base"><div class="bar-fill ${item.colorClass || defaultColor}" style="width:${width}%"></div></div>
      <span class="value">${INTEGER.format(item.hours)} h | ${CURRENCY.format(item.cost)}</span>
    </div>`;
  }).join("");
  container.innerHTML = rows + buildDualAxis(maxHours, maxCost);
}

/* ── Render ───────────────────────────────────────────────────── */
function renderCurationReport(input, curation) {
  document.getElementById("curation-kpi-savings").textContent =
    CURRENCY.format(curation.netSavings);
  document.getElementById("curation-kpi-hours").textContent =
    `${INTEGER.format(input.hourlyRate > 0 ? curation.grossBenefit / input.hourlyRate : 0)} h`;
  document.getElementById("curation-kpi-roi").textContent =
    `${DECIMAL_2.format(curation.roi)}x`;
  document.getElementById("curation-kpi-payback").textContent =
    formatMonths(curation.paybackMonths);

  const top = curation.byCategory[0];
  const topLabel = t(CURATION_CATEGORY_T_KEYS[top.key]);
  document.getElementById("curation-summary-list").innerHTML = [
    t("curationPricingLine")(INTEGER.format(curation.pricing.users), curation.pricing.units, USER_PACK_SIZE, CURRENCY.format(curation.pricing.annualInvestment)),
    t("curationNetLine")(CURRENCY.format(curation.netSavings)),
    t("curationTopLine")(topLabel, CURRENCY.format(top.savedCost), INTEGER.format(top.savedHours)),
  ].map((line) => `<li>${line}</li>`).join("");

  document.getElementById("curation-summary-box").textContent =
    t("curationSummaryBox")(
      INTEGER.format(curation.pricing.users),
      CURRENCY.format(curation.pricing.annualInvestment),
      CURRENCY.format(curation.netSavings));

  renderBars("curation-chart-before-after", [
    { label: t("barNoCuration"),        hours: curation.totalWithoutHours,                                 cost: curation.costWithout,                rowClass: "compare-row", colorClass: "blue"  },
    { label: t("barWithCuration"),      hours: curation.totalWithHours,                                    cost: curation.costWith,                   rowClass: "compare-row", colorClass: "green" },
    { label: t("barCurationBenefit"),   hours: curation.riskAdjustedBenefit / input.hourlyRate,            cost: curation.riskAdjustedBenefit,        rowClass: "compare-row", colorClass: "mix"   },
    { label: t("barCurationInvestment"),hours: curation.pricing.annualInvestment / input.hourlyRate,       cost: curation.pricing.annualInvestment,   rowClass: "compare-row", colorClass: "blue"  },
  ], "blue");

  renderBars("curation-chart-breakdown",
    curation.byCategory.map((item) => ({
      label:      t(CURATION_CATEGORY_T_KEYS[item.key]),
      hours:      item.savedHours,
      cost:       item.savedCost,
      rowClass:   "break-row",
      colorClass: "mix",
    })), "mix");

  renderBars("curation-chart-stage-leakage",
    STAGE_KEYS.map((stage) => ({
      label:      t(STAGE_T_KEYS[stage]),
      hours:      curation.stageLeakageHours[stage],
      cost:       curation.stageLeakageCost[stage],
      rowClass:   "stage-row",
      colorClass: "blue",
    })), "blue");
}

function renderJASReport(input, jas) {
  document.getElementById("jas-kpi-savings").textContent =
    CURRENCY.format(jas.netSavings);
  document.getElementById("jas-kpi-hours").textContent =
    `${INTEGER.format(input.hourlyRate > 0 ? jas.grossBenefit / input.hourlyRate : 0)} h`;
  document.getElementById("jas-kpi-roi").textContent =
    `${DECIMAL_2.format(jas.roi)}x`;
  document.getElementById("jas-kpi-payback").textContent =
    formatMonths(jas.paybackMonths);

  const top = jas.byCapability[0];
  const topLabel = t(top.tKey);
  document.getElementById("jas-summary-list").innerHTML = [
    t("jasPricingLine")(INTEGER.format(jas.pricing.users), jas.pricing.units, USER_PACK_SIZE, CURRENCY.format(jas.pricing.annualInvestment)),
    t("jasNetLine")(CURRENCY.format(jas.netSavings)),
    t("jasTopLine")(topLabel, CURRENCY.format(top.riskAdjustedCost), INTEGER.format(top.riskAdjustedHours)),
  ].map((line) => `<li>${line}</li>`).join("");

  document.getElementById("jas-summary-box").textContent =
    t("jasSummaryBox")(
      INTEGER.format(jas.pricing.users),
      CURRENCY.format(jas.pricing.annualInvestment),
      CURRENCY.format(jas.netSavings));

  renderBars("jas-chart-before-after", [
    { label: t("barJASBenefit"),   hours: jas.riskAdjustedBenefit / input.hourlyRate,      cost: jas.riskAdjustedBenefit,      rowClass: "compare-row", colorClass: "mix"   },
    { label: t("barJASInvestment"),hours: jas.pricing.annualInvestment / input.hourlyRate, cost: jas.pricing.annualInvestment, rowClass: "compare-row", colorClass: "blue"  },
    { label: t("barJASNet"),       hours: Math.max(jas.netSavings, 0) / input.hourlyRate,  cost: Math.max(jas.netSavings, 0),  rowClass: "compare-row", colorClass: "green" },
  ], "blue");

  renderBars("jas-chart-breakdown",
    jas.byCapability.map((item) => ({
      label:      t(item.tKey),
      hours:      item.riskAdjustedHours,
      cost:       item.riskAdjustedCost,
      rowClass:   "break-row",
      colorClass: "mix",
    })), "mix");
}

/* ── Report toggle ────────────────────────────────────────────── */
function setActiveReport(reportName) {
  activeReport = reportName === "jas" ? "jas" : "curation";
  const showCuration = activeReport === "curation";
  curationReportNode.hidden = !showCuration;
  jasReportNode.hidden      =  showCuration;
  curationInputsNode.hidden = !showCuration;
  jasInputsNode.hidden      =  showCuration;
  toggleCurationBtn.classList.toggle("is-active",  showCuration);
  toggleJasBtn.classList.toggle("is-active",       !showCuration);
  toggleCurationBtn.setAttribute("aria-pressed",   String(showCuration));
  toggleJasBtn.setAttribute("aria-pressed",        String(!showCuration));
}

/* ── Main run ─────────────────────────────────────────────────── */
function run() {
  updateAnnualCostHints();
  const input = parseInputs();
  warningNode.textContent = "";

  const isCuration = activeReport === "curation";
  const isEmpty    = isCuration
    ? (input.hourlyRate <= 0 || input.curationUsers <= 0)
    : (input.hourlyRate <= 0 || input.jasUsers <= 0);
  if (isEmpty) { zeroOutActiveReport(); return; }

  const warning = validate(input);
  warningNode.textContent = warning;
  if (warning) return;

  document.getElementById("report-title").textContent = t("reportTitle");

  if (input.companyName) {
    reportCompanyNode.dataset.prefix = t("preparedFor") + " ";
    reportCompanyNode.textContent    = input.companyName;
    reportCompanyNode.hidden         = false;
  } else {
    reportCompanyNode.textContent = "";
    reportCompanyNode.hidden      = true;
  }

  document.getElementById("report-subtitle").textContent =
    `${t("scenarioLabel")}: ${INTEGER.format(input.annualPackagesManual)} ${t("ossPackages")}, ` +
    `${t("curationUsersCount")} ${INTEGER.format(input.curationUsers)}, ` +
    `${t("jasUsersCount")} ${INTEGER.format(input.jasUsers)}.`;

  if (activeReport === "curation") {
    renderCurationReport(input, calcCuration(input));
  } else {
    renderJASReport(input, calcJAS(input));
  }
}

/* ── Event listeners ──────────────────────────────────────────── */
presetBtn.addEventListener("click", () => { setDefaults(); run(); });
form.addEventListener("input",  () => { run(); });
form.addEventListener("submit", (e) => { e.preventDefault(); run(); });

curationUsersInput.addEventListener("input",  syncAnnualPackagesFromCurationUsers);
curationUsersInput.addEventListener("change", syncAnnualPackagesFromCurationUsers);

toggleCurationBtn.addEventListener("click", () => { setActiveReport("curation"); run(); });
toggleJasBtn.addEventListener("click",      () => { setActiveReport("jas");      run(); });

document.getElementById("lang-en").addEventListener("click", () => {
  currentLang = "en";
  document.getElementById("lang-en").classList.add("is-active");
  document.getElementById("lang-zh").classList.remove("is-active");
  applyI18n();
  run();
});

document.getElementById("lang-zh").addEventListener("click", () => {
  currentLang = "zh";
  document.getElementById("lang-zh").classList.add("is-active");
  document.getElementById("lang-en").classList.remove("is-active");
  applyI18n();
  run();
});

exportPdfBtn.addEventListener("click", () => {
  const company  = document.getElementById("companyName").value.trim();
  const filename = company ? `jfrog-roi-${company}.pdf` : "jfrog-roi-report.pdf";
  html2pdf().set({
    margin: 8,
    filename,
    image:     { type: "jpeg", quality: 0.97 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF:     { unit: "mm", format: "a4", orientation: "portrait" },
  }).from(document.getElementById("report-root")).save();
});

/* ── Init ─────────────────────────────────────────────────────── */
setDefaults();
syncAnnualPackagesFromCurationUsers();
setActiveReport(activeReport);
applyI18n();
run();
