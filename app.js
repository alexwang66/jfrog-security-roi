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
    kpiTotalInvestment: "Total Investment",
    kpiTotalBenefit:    "Total Annual Benefit",
    kpiThreeYear:       "3-Year Net Savings",
    curationChart1:     "Chart 1: Curation Cost and Benefit Comparison",
    curationChart2:     "Chart 2: Curation Savings by Category",
    curationChart3:     "Chart 3: Without Curation — Remediation Cost by SDLC Stage",
    jasReportTitle:     "JAS Report",
    jasChart1:          "Chart 1: JAS Cost and Benefit Comparison",
    jasChart2:          "Chart 2: JAS Savings by Capability",
    toggleCombined:     "Combined",
    combinedReportTitle:"Combined Curation + JAS Report",
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
    // Chart title tooltips
    tipCurationChart1: "Compares total remediation cost without Curation vs. with Curation, showing the gross annual benefit and license investment.",
    tipCurationChart2: "Breaks down hours and cost saved per OSS risk category when Curation blocks packages at the point of request.",
    tipCurationChart3: "Shows where OSS issues are being discovered today and what it costs to fix them at each stage — without Curation in place. Issues found later cost exponentially more.",
    tipJASChart1: "Compares the total JAS annual benefit against the license investment to show net annual savings.",
    tipJASChart2: "Breaks down the productivity value delivered by each JAS capability, scaled to your user count and hourly rate.",
    // Bar tooltips — Chart 1
    tipNoCuration:        "Total hours and cost to fix all OSS issues manually across your SDLC — no early blocking in place.",
    tipWithCuration:      "Hours and cost for your team to review and triage packages through JFrog Curation at request time (4 h/package).",
    tipCurationBenefit:   "Gross annual benefit = no-Curation cost minus with-Curation cost. Does not yet subtract the license fee.",
    tipCurationInvestment:"Annual Curation license cost based on user count, rounded up to the nearest 50-user pack at $27,000/pack.",
    // Bar tooltips — Chart 2 categories
    tipCatCriticalReplacement: "Packages with Critical/High CVEs that have no patch — must be fully replaced. Highest remediation effort.",
    tipCatCriticalUpgrade:     "Packages with Critical/High CVEs where a patched version exists. Resolved by upgrading the dependency.",
    tipCatBannedLicense:       "Packages whose license violates your policy (e.g. GPL in a commercial product). Requires replacement.",
    tipCatUnmanaged:           "Unmaintained, deprecated, or high supply-chain-risk packages.",
    tipCatMalicious:           "Packages confirmed to contain malicious code. Highest urgency — immediate removal and incident review required.",
    // Bar tooltips — Chart 3 stages
    tipStageIDE:     "Issues caught during coding. Cheapest to fix — developer is still in context (avg. 24 h for replacement).",
    tipStageCommit:  "Issues caught at source commit. Slightly more expensive as context-switching is needed (avg. 28 h).",
    tipStageBuild:   "Issues caught during CI/CD build. Fixing requires a new build cycle and re-test (avg. 36 h).",
    tipStageStaging: "Issues caught in staging. Delays release and requires cross-team coordination (avg. 101 h).",
    tipStageProd:    "Issues that reach production. Most expensive — hotfix, incident response, potential breach notification (avg. 493 h).",
    // Bar tooltips — JAS Chart 1
    tipJASBenefit:   "Total annual productivity value from all JAS capabilities, scaled to your user count and hourly rate.",
    tipJASInvestment:"Annual JAS license cost based on user count, rounded up to the nearest 50-user pack.",
    tipJASNet:       "Net annual savings = JAS annual benefit minus JAS license cost.",
    // Bar tooltips — JAS Chart 2 capabilities
    tipJasCatContextualDev:       "Reduces false positives by filtering non-reachable vulnerabilities, saving significant developer triage time.",
    tipJasCatContextualSecOps:    "Helps security teams focus only on exploitable vulnerabilities, reducing investigation and reporting effort.",
    tipJasCatK8sValidation:       "Automatically validates Kubernetes manifests and Helm charts against security policies before deployment.",
    tipJasCatAppLibValidation:    "Scans Python and Node.js library configurations for known misconfigurations and security issues.",
    tipJasCatTerraformValidation: "Validates Terraform IaC for security policy compliance before provisioning.",
    // Summary list sentence builders
    curationPricingLine: (users, units, pack, cost) =>
      `Curation pricing input: ${users} users (${units} × ${pack}-user packs) = ${cost}/year.`,
    curationNetLine:     (val)  => `Net annual Curation savings: ${val}.`,
    curationTopLine:     (name, cost, hrs) =>
      `Top Curation savings driver: ${name} (${cost} / ${hrs} h).`,
    curationSummaryBox:  (users, cost, net) =>
      `Curation annual investment: ${users} users => ${cost} per year. Expected net annual value: ${net}.`,
    insightTitle:        "💡 Why is this the top savings driver?",
    insightUnmanaged:    (pct, upgradesPct, stagingH, replH) =>
      `<strong>Counterintuitive finding:</strong> Unmaintained/risky packages (${pct}% of your OSS portfolio) outrank high-profile CVEs because <strong>92% of CVE issues have upgrades available</strong> — cheap to fix (avg. ${stagingH}h at Staging). Unmaintained packages have no upgrade path and require full replacement (avg. ${replH}h at Staging). Curation blocks all of them at intake for just <strong>4 hours each</strong>, before they ever reach your pipeline.`,
    insightBannedLicense:(pct) =>
      `<strong>Finding:</strong> Banned-license packages (${pct}% of portfolio) are the top driver. They require full replacement — same effort as security vulnerabilities — yet are often invisible to CVE scanners. Curation catches them at intake for 4 hours each.`,
    insightCritical:     () =>
      `<strong>Finding:</strong> Critical CVE replacement packages dominate because they have no available patch — every instance requires a full dependency swap, which is expensive at every pipeline stage. Curation blocks them before they enter your codebase.`,
    jasPricingLine:      (users, units, pack, cost) =>
      `JAS pricing input: ${users} users (${units} × ${pack}-user packs) = ${cost}/year.`,
    jasNetLine:          (val)  => `Net annual JAS savings: ${val}.`,
    jasTopLine:          (name, cost, hrs) =>
      `Top JAS capability driver: ${name} (${cost} / ${hrs} h).`,
    jasSummaryBox:       (users, cost, net) =>
      `JAS annual investment: ${users} users => ${cost} per year. Expected net annual value: ${net}.`,
    // Feature 1: Headline
    headlineEN: (company, netSavings, payback) =>
      `"${company}" saves ${netSavings}/year with a ${payback} payback`,
    // Feature 2: KPI sub-text
    kpiSubNetSavings:   (investment) => `net of ${investment} license cost`,
    kpiSubHours:        (n)          => `≈ ${n} FTEs/year`,
    kpiSubROI:          (roi)        => `every $1 returns $${roi}`,
    kpiSubPayback:      (months)     => `break-even in under ${months} months`,
    // Feature 3: 3-Year banner
    threeYearBanner:    (val)        => `3-Year Net Savings: ${val}`,
    // Feature 4: Cost of inaction
    costOfInaction:     (cost, hrs)  => `⚠ Current annual exposure without Curation: ${cost} (${hrs} hours)`,
    // Feature 5: Combined summary
    combinedSummaryBox: (totalInv, totalBenefit, net, roi, payback) =>
      `Combined investment: ${totalInv}/year. Total annual benefit: ${totalBenefit}. Net savings: ${net}. ROI: ${roi}x. Payback: ${payback}.`,
    combinedNetLine:    (val)        => `Combined net annual savings: ${val}.`,
    combinedROILine:    (roi)        => `Combined ROI multiple: ${roi}x.`,
    // Feature 6: PDF Cover
    pdfCoverTagline:    "Liquid Software. Trusted Everywhere.",
    pdfCoverTitle:      "Security ROI Executive Report",
    pdfCoverNetSavings: "Annual Net Savings",
    pdfCoverROI:        "ROI Multiple",
    pdfCoverPayback:    "Payback Period",
    pdfCoverFooter:     "Confidential — generated by JFrog ROI Calculator",
    pdfCoverPrepared:   (company) => `Prepared for: ${company}`,
    pdfCoverGenerated:  (date)    => `Generated: ${date}`,
    // Feature 1: Per-developer ROI
    perDevROI:          (amount)  => `$${amount} saved per developer / year`,
    // Feature 3: Model Assumptions
    assumptionsTitle:   "Model Assumptions",
    assumptionsSource:  "Package ratios: Critical/High CVE 59.2%, Banned License 15.8%, Unmanaged 23.7%, Malicious 1.3%. Source: Dell/JFrog Curation Value Assessment.",
    assumptionsDiscoveryTitle: "Discovery Profile (Without Curation)",
    assumptionsRemediationTitle: "Remediation Time per Stage (hours)",
    assumptionsJASBaselineTitle: "JAS Baseline Parameters",
    assumptionsJASBaseline: (users, rate) => `Baseline: ${users.toLocaleString()} users, $${rate}/hr. Values are scaled by (userCount / ${users.toLocaleString()}) × (hourlyRate / ${rate}).`,
    assumptionsJASComponentsTitle: "JAS Component Baseline Values (Annual)",
    // Feature 5: One-Pager
    onePagerBtn:        "One-Pager",
    onePagerTitle:      "JFrog Security ROI Summary",
    onePagerClose:      "Close",
    onePagerExport:     "Export as PDF",
    onePagerPreparedFor:(company) => `Prepared for: ${company}`,
    onePagerThreeYear:  (val)     => `3-Year Net Savings: ${val}`,
    onePagerPerDev:     (val)     => `Per Developer: ${val}/year`,
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
    kpiTotalInvestment: "总投资",
    kpiTotalBenefit:    "年度总收益",
    kpiThreeYear:       "三年净节省",
    curationChart1:     "图表1：Curation 成本与收益对比",
    curationChart2:     "图表2：Curation 各类别节省",
    curationChart3:     "图表3：无Curation时各SDLC阶段修复成本",
    jasReportTitle:     "JAS 报告",
    jasChart1:          "图表1：JAS 成本与收益对比",
    jasChart2:          "图表2：JAS 各能力节省",
    toggleCombined:     "综合",
    combinedReportTitle:"Curation + JAS 综合报告",
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
    // Chart title tooltips
    tipCurationChart1: "对比有/无Curation的总修复成本，展示年度收益和许可证投资。",
    tipCurationChart2: "按OSS风险类别拆分Curation拦截后节省的工时和成本。",
    tipCurationChart3: "展示当前各阶段OSS问题被发现的情况及修复成本——无Curation拦截的现状。越晚发现，成本越高。",
    tipJASChart1: "对比JAS年度总收益与许可证投资，展示年净节省。",
    tipJASChart2: "按JAS各能力拆分生产力价值，数值已按用户数和工时费率换算。",
    // Bar tooltips — Chart 1
    tipNoCuration:        "在没有Curation拦截的情况下，手动修复所有OSS问题的总工时和成本。",
    tipWithCuration:      "通过JFrog Curation在包请求时审核和分诊所需的工时和成本（平均4小时/包）。",
    tipCurationBenefit:   "年度总收益 = 无Curation成本 - 有Curation成本。尚未扣除许可证费用。",
    tipCurationInvestment:"根据用户数计算的年度Curation许可证费用，按50用户包向上取整，每包$27,000。",
    // Bar tooltips — Chart 2 categories
    tipCatCriticalReplacement: "存在关键/高危CVE且无补丁版本的包，需完全替换。修复工作量最大。",
    tipCatCriticalUpgrade:     "存在关键/高危CVE但有修复版本的包，通过升级依赖解决。",
    tipCatBannedLicense:       "许可证违反企业政策的包（如商业产品中使用GPL）。需要替换。",
    tipCatUnmanaged:           "未维护、已废弃或供应链风险较高的包。",
    tipCatMalicious:           "确认包含恶意代码的包。最高优先级——需立即移除并进行事件复盘。",
    // Bar tooltips — Chart 3 stages
    tipStageIDE:     "编码期间发现的问题。修复成本最低——开发者仍在上下文中（替换包平均24小时）。",
    tipStageCommit:  "代码提交时发现的问题。需要上下文切换，略贵于IDE阶段（平均28小时）。",
    tipStageBuild:   "CI/CD构建期间发现的问题。修复需要重新构建和测试（平均36小时）。",
    tipStageStaging: "预发布阶段发现的问题。延迟发布周期，需跨团队协调（平均101小时）。",
    tipStageProd:    "进入生产的问题。成本最高——热修复、事件响应、可能的安全通报（平均493小时）。",
    // Bar tooltips — JAS Chart 1
    tipJASBenefit:   "所有JAS能力的年度生产力价值总和，已按用户数和工时费率换算。",
    tipJASInvestment:"根据用户数计算的年度JAS许可证费用，按50用户包向上取整。",
    tipJASNet:       "年净节省 = JAS年度收益 - JAS许可证成本。",
    // Bar tooltips — JAS Chart 2 capabilities
    tipJasCatContextualDev:       "通过过滤不可达漏洞减少误报，大幅节省开发者分诊时间。",
    tipJasCatContextualSecOps:    "帮助安全团队只关注可利用漏洞，减少调查和报告工作量。",
    tipJasCatK8sValidation:       "在部署前自动验证Kubernetes清单和Helm Chart是否符合安全策略。",
    tipJasCatAppLibValidation:    "扫描Python和Node.js库配置，发现已知错误配置和安全问题。",
    tipJasCatTerraformValidation: "在资源创建前验证Terraform IaC是否符合安全策略。",
    // Summary list sentence builders
    curationPricingLine: (users, units, pack, cost) =>
      `Curation定价输入：${users}用户（${units}×${pack}用户包）= ${cost}/年。`,
    curationNetLine:     (val)  => `年度Curation净节省：${val}。`,
    curationTopLine:     (name, cost, hrs) =>
      `Curation最大节省驱动因素：${name}（${cost} / ${hrs}小时）。`,
    curationSummaryBox:  (users, cost, net) =>
      `Curation年度投入：${users}用户 => ${cost}/年。预期年净价值：${net}。`,
    insightTitle:        "💡 为什么它是最大节省驱动因素？",
    insightUnmanaged:    (pct, upgradesPct, stagingH, replH) =>
      `<strong>反直觉发现：</strong>未维护/风险包（占OSS组合的${pct}%）超越高危CVE，原因是<strong>92%的CVE问题有现成补丁</strong>——修复成本低（Staging阶段平均${stagingH}小时）。而未维护包没有升级路径，必须完全替换（Staging阶段平均${replH}小时）。Curation在包引入时就全部拦截，每个仅需<strong>4小时</strong>，不需要等到流水线各阶段处理。`,
    insightBannedLicense:(pct) =>
      `<strong>发现：</strong>禁止许可证包（占组合的${pct}%）是最大驱动因素。它们需要完整替换——与安全漏洞修复工作量相当——但CVE扫描工具通常检测不到。Curation在引入时拦截，每个仅需4小时。`,
    insightCritical:     () =>
      `<strong>发现：</strong>关键CVE替换包居首，因为这类包没有可用补丁，每个实例都需要完整替换依赖，在流水线各阶段成本极高。Curation在代码引入前即拦截。`,
    jasPricingLine:      (users, units, pack, cost) =>
      `JAS定价输入：${users}用户（${units}×${pack}用户包）= ${cost}/年。`,
    jasNetLine:          (val)  => `年度JAS净节省：${val}。`,
    jasTopLine:          (name, cost, hrs) =>
      `JAS最大能力驱动因素：${name}（${cost} / ${hrs}小时）。`,
    jasSummaryBox:       (users, cost, net) =>
      `JAS年度投入：${users}用户 => ${cost}/年。预期年净价值：${net}。`,
    // Feature 1: Headline
    headlineEN: (company, netSavings, payback) =>
      `${company}每年节省${netSavings}，投资回收期${payback}`,
    // Feature 2: KPI sub-text
    kpiSubNetSavings:   (investment) => `扣除${investment}许可证成本`,
    kpiSubHours:        (n)          => `约${n}个全职人力/年`,
    kpiSubROI:          (roi)        => `每投入$1回报$${roi}`,
    kpiSubPayback:      (months)     => `不到${months}个月回本`,
    // Feature 3: 3-Year banner
    threeYearBanner:    (val)        => `三年净节省：${val}`,
    // Feature 4: Cost of inaction
    costOfInaction:     (cost, hrs)  => `⚠ 当前无Curation年度风险窗口：${cost}（${hrs}小时）`,
    // Feature 5: Combined summary
    combinedSummaryBox: (totalInv, totalBenefit, net, roi, payback) =>
      `综合投入：${totalInv}/年。年度总收益：${totalBenefit}。净节省：${net}。ROI：${roi}x。回收期：${payback}。`,
    combinedNetLine:    (val)        => `综合年度净节省：${val}。`,
    combinedROILine:    (roi)        => `综合投资回报倍数：${roi}x。`,
    // Feature 6: PDF Cover
    pdfCoverTagline:    "流动软件，值得信赖。",
    pdfCoverTitle:      "安全投资回报率执行报告",
    pdfCoverNetSavings: "年净节省",
    pdfCoverROI:        "投资回报倍数",
    pdfCoverPayback:    "投资回收期",
    pdfCoverFooter:     "保密文件 — 由JFrog ROI计算器生成",
    pdfCoverPrepared:   (company) => `准备给：${company}`,
    pdfCoverGenerated:  (date)    => `生成时间：${date}`,
    // Feature 1: Per-developer ROI
    perDevROI:          (amount)  => `每位开发者每年节省 $${amount}`,
    // Feature 3: Model Assumptions
    assumptionsTitle:   "模型假设说明",
    assumptionsSource:  "软件包比例：关键/高危CVE 59.2%，禁止许可证 15.8%，未管理 23.7%，恶意包 1.3%。来源：Dell/JFrog Curation 价值评估。",
    assumptionsDiscoveryTitle: "发现分布（无Curation）",
    assumptionsRemediationTitle: "各阶段修复时间（小时）",
    assumptionsJASBaselineTitle: "JAS 基准参数",
    assumptionsJASBaseline: (users, rate) => `基准：${users.toLocaleString()} 用户，$${rate}/小时。数值按（用户数 / ${users.toLocaleString()}）×（工时费率 / ${rate}）缩放。`,
    assumptionsJASComponentsTitle: "JAS 各能力基准价值（年度）",
    // Feature 5: One-Pager
    onePagerBtn:        "一页摘要",
    onePagerTitle:      "JFrog 安全 ROI 摘要",
    onePagerClose:      "关闭",
    onePagerExport:     "导出为 PDF",
    onePagerPreparedFor:(company) => `准备给：${company}`,
    onePagerThreeYear:  (val)     => `三年净节省：${val}`,
    onePagerPerDev:     (val)     => `每位开发者：${val}/年`,
  },
};

const CURATION_CATEGORY_T_KEYS = {
  criticalReplacement: "catCriticalReplacement",
  criticalUpgrade:     "catCriticalUpgrade",
  bannedLicense:       "catBannedLicense",
  unmanaged:           "catUnmanaged",
  malicious:           "catMalicious",
};

const CURATION_CATEGORY_TIP_KEYS = {
  criticalReplacement: "tipCatCriticalReplacement",
  criticalUpgrade:     "tipCatCriticalUpgrade",
  bannedLicense:       "tipCatBannedLicense",
  unmanaged:           "tipCatUnmanaged",
  malicious:           "tipCatMalicious",
};

const STAGE_T_KEYS = {
  ide:     "stageIDE",
  commit:  "stageCommit",
  build:   "stageBuild",
  staging: "stageStaging",
  prod:    "stageProd",
};

const STAGE_TIP_KEYS = {
  ide:     "tipStageIDE",
  commit:  "tipStageCommit",
  build:   "tipStageBuild",
  staging: "tipStageStaging",
  prod:    "tipStageProd",
};

let currentLang = "en";
let lastResult = null; // Feature 5: stores last computed result for one-pager

/* ── Feature 6: KPI Count-Up Animation ───────────────────────── */
function animateKpi(elementId, targetText, duration) {
  duration = duration || 600;
  const el = document.getElementById(elementId);
  if (!el) return;

  // Skip if prefers-reduced-motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = targetText;
    return;
  }

  // Parse the numeric value and detect format
  const raw = targetText;
  const isCurrency = raw.indexOf("$") !== -1;
  const isMultiplier = raw.charAt(raw.length - 1) === "x";
  const isMonths = raw.indexOf(t("monthsUnit")) !== -1 || raw.indexOf("months") !== -1;

  // Extract numeric value
  let numericStr = raw.replace(/[$,x]/g, "").replace(t("monthsUnit"), "").replace("months", "").trim();
  const target = parseFloat(numericStr);

  if (!Number.isFinite(target) || target === 0) {
    el.textContent = targetText;
    return;
  }

  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    let display;
    if (isCurrency) {
      display = CURRENCY.format(current);
    } else if (isMultiplier) {
      display = `${DECIMAL_2.format(current)}x`;
    } else if (isMonths) {
      display = formatMonths(current);
    } else {
      // hours (e.g. "12,345 h")
      const hSuffix = raw.indexOf(" h") !== -1 ? " h" : "";
      display = `${INTEGER.format(current)}${hSuffix}`;
    }

    el.textContent = display;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = targetText;
    }
  }

  requestAnimationFrame(frame);
}

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
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle;
    const val = t(key);
    if (typeof val === "string") el.dataset.tip = val;
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
const onePagerBtn        = document.getElementById("one-pager-btn");
const onePagerOverlay    = document.getElementById("one-pager-overlay");
const warningNode        = document.getElementById("form-warning");
const curationUsersInput = document.getElementById("curationUsers");
const curationReportNode = document.getElementById("curation-report");
const jasReportNode      = document.getElementById("jas-report");
const combinedReportNode = document.getElementById("combined-report");
const curationInputsNode = document.getElementById("curation-inputs");
const jasInputsNode      = document.getElementById("jas-inputs");
const toggleCurationBtn  = document.getElementById("toggle-curation");
const toggleJasBtn       = document.getElementById("toggle-jas");
const toggleCombinedBtn  = document.getElementById("toggle-combined");
const reportCompanyNode  = document.getElementById("report-company");
const reportHeadlineNode = document.getElementById("report-headline");
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
  const isJAS      = activeReport === "jas";
  const isCombined = activeReport === "combined";

  if (isCuration || isCombined) {
    document.getElementById("curation-kpi-savings").textContent  = CURRENCY.format(0);
    document.getElementById("curation-kpi-hours").textContent    = `${INTEGER.format(0)} h`;
    document.getElementById("curation-kpi-roi").textContent      = `${DECIMAL_2.format(0)}x`;
    document.getElementById("curation-kpi-payback").textContent  = formatMonths(0);
    document.getElementById("curation-summary-list").innerHTML   = "";
    document.getElementById("curation-summary-box").textContent  = "";
  }
  if (isJAS || isCombined) {
    document.getElementById("jas-kpi-savings").textContent  = CURRENCY.format(0);
    document.getElementById("jas-kpi-hours").textContent    = `${INTEGER.format(0)} h`;
    document.getElementById("jas-kpi-roi").textContent      = `${DECIMAL_2.format(0)}x`;
    document.getElementById("jas-kpi-payback").textContent  = formatMonths(0);
    document.getElementById("jas-summary-list").innerHTML   = "";
    document.getElementById("jas-summary-box").textContent  = "";
  }
  if (isCombined) {
    document.getElementById("combined-kpi-investment").textContent = CURRENCY.format(0);
    document.getElementById("combined-kpi-benefit").textContent    = CURRENCY.format(0);
    document.getElementById("combined-kpi-savings").textContent    = CURRENCY.format(0);
    document.getElementById("combined-kpi-roi").textContent        = `${DECIMAL_2.format(0)}x`;
    document.getElementById("combined-kpi-payback").textContent    = formatMonths(0);
    document.getElementById("combined-kpi-threeyear").textContent  = CURRENCY.format(0);
    document.getElementById("combined-summary-list").innerHTML     = "";
    document.getElementById("combined-summary-box").textContent    = "";
  }

  const prefix = isCuration ? "curation" : "jas";
  if (!isCombined) {
    const charts = isCuration
      ? ["curation-chart-before-after", "curation-chart-breakdown", "curation-chart-stage-leakage"]
      : ["jas-chart-before-after", "jas-chart-breakdown"];
    charts.forEach((id) => { document.getElementById(id).innerHTML = ""; });
  }

  reportHeadlineNode.hidden = true;
}

function validate(input) {
  if (!Number.isFinite(input.hourlyRate) || input.hourlyRate <= 0)
    return "Hourly rate must be greater than 0.";
  if (activeReport === "curation" || activeReport === "combined") {
    if (!Number.isFinite(input.annualPackagesManual) || input.annualPackagesManual <= 0)
      return "Annual OSS package count must be greater than 0.";
    if (!Number.isFinite(input.curationUsers) || input.curationUsers <= 0)
      return "Curation users must be greater than 0.";
  }
  if (activeReport === "jas" || activeReport === "combined") {
    if (!Number.isFinite(input.jasUsers) || input.jasUsers <= 0)
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
  const rows = items.map((item, index) => {
    const width    = (item.hours / maxHours) * 100;
    const tipAttr  = item.tooltip ? ` data-tip="${item.tooltip}"` : "";
    const topBadge = (item.isTopDriver && index === 0)
      ? `<span class="top-driver-badge">★ #1</span>` : "";
    return `<div class="${item.rowClass}">
      <span class="name"${tipAttr}>${item.label}${topBadge}</span>
      <div class="bar-base"><div class="bar-fill ${item.colorClass || defaultColor}" style="width:${width}%"></div></div>
      <span class="value">${INTEGER.format(item.hours)} h | ${CURRENCY.format(item.cost)}</span>
    </div>`;
  }).join("");
  container.innerHTML = rows + buildDualAxis(maxHours, maxCost);
}

function renderInsight(curation) {
  const el = document.getElementById("curation-insight");
  if (!el) return;
  const top = curation.byCategory[0];
  if (!top) { el.hidden = true; return; }

  const unmanagedPct  = (CATEGORY_RATIO.unmanaged * 100).toFixed(1);
  const bannedPct     = (CATEGORY_RATIO.bannedLicense * 100).toFixed(1);
  const stagingRepl   = STAGE_TIMES.replacement.staging;
  const stagingUpg    = STAGE_TIMES.upgrade.staging;

  let body = "";
  if (top.key === "unmanaged")            body = t("insightUnmanaged")(unmanagedPct, 92, stagingUpg, stagingRepl);
  else if (top.key === "bannedLicense")   body = t("insightBannedLicense")(bannedPct);
  else                                    body = t("insightCritical")();

  el.innerHTML = `<p class="insight-title">${t("insightTitle")}</p><p class="insight-body">${body}</p>`;
  el.hidden = false;
}

/* ── Feature 2: KPI sub-text helpers ─────────────────────────── */
function renderKpiSubs(prefix, investment, hoursSaved, roi, paybackMonths) {
  const ftes    = Math.round(hoursSaved / 2000);
  const roiRet  = DECIMAL_2.format(roi + 1);
  const months  = Math.ceil(paybackMonths);

  const subSavings  = document.getElementById(`${prefix}-kpi-savings-sub`);
  const subHours    = document.getElementById(`${prefix}-kpi-hours-sub`);
  const subROI      = document.getElementById(`${prefix}-kpi-roi-sub`);
  const subPayback  = document.getElementById(`${prefix}-kpi-payback-sub`);

  if (subSavings)  subSavings.textContent  = t("kpiSubNetSavings")(CURRENCY.format(investment));
  if (subHours)    subHours.textContent    = t("kpiSubHours")(INTEGER.format(ftes));
  if (subROI)      subROI.textContent      = t("kpiSubROI")(roiRet);
  if (subPayback)  subPayback.textContent  = t("kpiSubPayback")(months);
}

/* ── Feature 1: Per-Developer ROI helper ─────────────────────── */
function renderPerDevRoi(prefix, netSavings, userCount) {
  const el = document.getElementById(`${prefix}-per-dev`);
  if (!el || !userCount || userCount <= 0) return;
  const perDev = Math.round(netSavings / userCount);
  const amount = INTEGER.format(Math.max(perDev, 0));
  el.hidden = false;
  el.innerHTML =
    `<strong class="per-dev-amount">$${amount}</strong>` +
    `<span class="per-dev-label">${currentLang === "zh" ? `每位开发者每年节省` : `saved per developer / year`}</span>`;
}

/* ── Feature 3: Model Assumptions helpers ─────────────────────── */
function renderCurationAssumptions() {
  const body = document.getElementById("curation-assumptions-body");
  if (!body) return;

  const dist = DISCOVERY_PROFILES.late;
  const stageRows = [
    ["IDE/Code",             dist.ide   + "%"],
    ["Source Commit",        dist.commit + "%"],
    ["Build",                dist.build  + "%"],
    ["Staging (Promotion)",  dist.staging + "%"],
    ["Production",           dist.prod   + "%"],
  ];

  const remRows = [
    ["Curation (early block)", CURATION_TIMES.replacement, CURATION_TIMES.upgrade, CURATION_TIMES.malicious],
    ["IDE/Code",               STAGE_TIMES.replacement.ide,     STAGE_TIMES.upgrade.ide,     STAGE_TIMES.malicious.ide],
    ["Source Commit",          STAGE_TIMES.replacement.commit,  STAGE_TIMES.upgrade.commit,  STAGE_TIMES.malicious.commit],
    ["Build",                  STAGE_TIMES.replacement.build,   STAGE_TIMES.upgrade.build,   STAGE_TIMES.malicious.build],
    ["Staging",                STAGE_TIMES.replacement.staging, STAGE_TIMES.upgrade.staging, STAGE_TIMES.malicious.staging],
    ["Production",             STAGE_TIMES.replacement.prod,    STAGE_TIMES.upgrade.prod,    STAGE_TIMES.malicious.prod],
  ];

  const table1 = `<table class="assumptions-table">
    <caption>${t("assumptionsDiscoveryTitle")}</caption>
    <thead><tr><th>SDLC Stage</th><th>Discovery %</th></tr></thead>
    <tbody>${stageRows.map(([s, d]) => `<tr><td>${s}</td><td>${d}</td></tr>`).join("")}</tbody>
  </table>`;

  const table2 = `<table class="assumptions-table">
    <caption>${t("assumptionsRemediationTitle")}</caption>
    <thead><tr><th>Stage</th><th>Replacement</th><th>Upgrade</th><th>Malicious</th></tr></thead>
    <tbody>${remRows.map(([s, r, u, m]) => `<tr><td>${s}</td><td>${r}</td><td>${u}</td><td>${m}</td></tr>`).join("")}</tbody>
  </table>`;

  body.innerHTML = table1 + table2 + `<p class="assumptions-source">${t("assumptionsSource")}</p>`;
}

function renderJASAssumptions(input) {
  const body = document.getElementById("jas-assumptions-body");
  if (!body) return;

  const scaleFactor = (input.jasUsers / BASELINE_JAS_USERS) * (input.hourlyRate / BASELINE_HOURLY_RATE);

  const componentRows = Object.entries(JAS_COMPONENTS_BASE).map(([key, item]) => {
    const scaled = Math.round(item.annualValue * scaleFactor);
    return `<tr><td>${t(item.tKey)}</td><td>${CURRENCY.format(item.annualValue)}</td><td>${CURRENCY.format(scaled)}</td></tr>`;
  }).join("");

  const compTable = `<table class="assumptions-table">
    <caption>${t("assumptionsJASComponentsTitle")}</caption>
    <thead><tr><th>Capability</th><th>Baseline (9,500 users, $57.60/hr)</th><th>Your Value</th></tr></thead>
    <tbody>${componentRows}</tbody>
  </table>`;

  body.innerHTML =
    `<p class="assumptions-source">${t("assumptionsJASBaseline")(BASELINE_JAS_USERS, BASELINE_HOURLY_RATE)}</p>` +
    compTable;
}

/* ── Feature 3: 3-Year banner helper ─────────────────────────── */
function renderThreeYearBanner(prefix, netSavings) {
  const bannerEl = document.getElementById(`${prefix}-three-year`);
  if (!bannerEl) return;
  const threeYear = netSavings * 3;
  bannerEl.hidden = false;
  bannerEl.innerHTML =
    `<span class="three-year-label">${t("threeYearBanner")(CURRENCY.format(threeYear))}</span>`;
}

/* ── Feature 1: Headline ──────────────────────────────────────── */
function renderHeadline(company, netSavings, paybackMonths) {
  const companyName  = company || (currentLang === "zh" ? "您的组织" : "Your organization");
  const netStr       = CURRENCY.format(netSavings);
  const paybackStr   = formatMonths(paybackMonths);
  reportHeadlineNode.textContent = t("headlineEN")(companyName, netStr, paybackStr);
  reportHeadlineNode.hidden = false;
}

/* ── Render ───────────────────────────────────────────────────── */
function renderCurationReport(input, curation) {
  const hoursSaved = input.hourlyRate > 0 ? curation.grossBenefit / input.hourlyRate : 0;
  animateKpi("curation-kpi-savings",  CURRENCY.format(curation.netSavings));
  animateKpi("curation-kpi-hours",    `${INTEGER.format(hoursSaved)} h`);
  animateKpi("curation-kpi-roi",      `${DECIMAL_2.format(curation.roi)}x`);
  animateKpi("curation-kpi-payback",  formatMonths(curation.paybackMonths));

  // Feature 2: KPI sub-text
  renderKpiSubs("curation", curation.pricing.annualInvestment, hoursSaved, curation.roi, curation.paybackMonths);

  // Feature 3: 3-Year banner
  renderThreeYearBanner("curation", curation.netSavings);

  // Feature 1: Per-dev ROI
  renderPerDevRoi("curation", curation.netSavings, input.curationUsers);

  const top = curation.byCategory[0];
  const topLabel = t(CURATION_CATEGORY_T_KEYS[top.key]);
  document.getElementById("curation-summary-list").innerHTML = [
    t("curationPricingLine")(INTEGER.format(curation.pricing.users), curation.pricing.units, USER_PACK_SIZE, CURRENCY.format(curation.pricing.annualInvestment)),
    t("curationNetLine")(CURRENCY.format(curation.netSavings)),
    t("curationTopLine")(topLabel, CURRENCY.format(top.savedCost), INTEGER.format(top.savedHours)),
  ].map((line) => `<li>${line}</li>`).join("");

  // Feature 4: Cost of inaction
  const inactionEl = document.getElementById("curation-inaction");
  if (inactionEl) {
    inactionEl.textContent = t("costOfInaction")(
      CURRENCY.format(curation.costWithout),
      INTEGER.format(Math.round(curation.totalWithoutHours))
    );
    inactionEl.hidden = false;
  }

  document.getElementById("curation-summary-box").textContent =
    t("curationSummaryBox")(
      INTEGER.format(curation.pricing.users),
      CURRENCY.format(curation.pricing.annualInvestment),
      CURRENCY.format(curation.netSavings));

  renderBars("curation-chart-before-after", [
    { label: t("barNoCuration"),        tooltip: t("tipNoCuration"),        hours: curation.totalWithoutHours,                           cost: curation.costWithout,              rowClass: "compare-row", colorClass: "blue"  },
    { label: t("barWithCuration"),      tooltip: t("tipWithCuration"),      hours: curation.totalWithHours,                              cost: curation.costWith,                 rowClass: "compare-row", colorClass: "green" },
    { label: t("barCurationBenefit"),   tooltip: t("tipCurationBenefit"),   hours: curation.riskAdjustedBenefit / input.hourlyRate,       cost: curation.riskAdjustedBenefit,      rowClass: "compare-row", colorClass: "mix"   },
    { label: t("barCurationInvestment"),tooltip: t("tipCurationInvestment"),hours: curation.pricing.annualInvestment / input.hourlyRate,  cost: curation.pricing.annualInvestment, rowClass: "compare-row", colorClass: "blue"  },
  ], "blue");

  renderBars("curation-chart-breakdown",
    curation.byCategory.map((item, idx) => ({
      label:       t(CURATION_CATEGORY_T_KEYS[item.key]),
      tooltip:     t(CURATION_CATEGORY_TIP_KEYS[item.key]),
      hours:       item.savedHours,
      cost:        item.savedCost,
      rowClass:    "break-row",
      colorClass:  "mix",
      isTopDriver: idx === 0,
    })), "mix");

  renderBars("curation-chart-stage-leakage",
    STAGE_KEYS.map((stage) => ({
      label:      t(STAGE_T_KEYS[stage]),
      tooltip:    t(STAGE_TIP_KEYS[stage]),
      hours:      curation.stageLeakageHours[stage],
      cost:       curation.stageLeakageCost[stage],
      rowClass:   "stage-row",
      colorClass: "blue",
    })), "blue");

  renderInsight(curation);

  // Feature 3: Model Assumptions
  renderCurationAssumptions();
}

function renderJASReport(input, jas) {
  const hoursSaved = input.hourlyRate > 0 ? jas.grossBenefit / input.hourlyRate : 0;
  animateKpi("jas-kpi-savings",  CURRENCY.format(jas.netSavings));
  animateKpi("jas-kpi-hours",    `${INTEGER.format(hoursSaved)} h`);
  animateKpi("jas-kpi-roi",      `${DECIMAL_2.format(jas.roi)}x`);
  animateKpi("jas-kpi-payback",  formatMonths(jas.paybackMonths));

  // Feature 2: KPI sub-text
  renderKpiSubs("jas", jas.pricing.annualInvestment, hoursSaved, jas.roi, jas.paybackMonths);

  // Feature 3: 3-Year banner
  renderThreeYearBanner("jas", jas.netSavings);

  // Feature 1: Per-dev ROI
  renderPerDevRoi("jas", jas.netSavings, input.jasUsers);

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
    { label: t("barJASBenefit"),   tooltip: t("tipJASBenefit"),   hours: jas.riskAdjustedBenefit / input.hourlyRate,      cost: jas.riskAdjustedBenefit,      rowClass: "compare-row", colorClass: "mix"   },
    { label: t("barJASInvestment"),tooltip: t("tipJASInvestment"),hours: jas.pricing.annualInvestment / input.hourlyRate, cost: jas.pricing.annualInvestment, rowClass: "compare-row", colorClass: "blue"  },
    { label: t("barJASNet"),       tooltip: t("tipJASNet"),       hours: Math.max(jas.netSavings, 0) / input.hourlyRate,  cost: Math.max(jas.netSavings, 0),  rowClass: "compare-row", colorClass: "green" },
  ], "blue");

  renderBars("jas-chart-breakdown",
    jas.byCapability.map((item) => ({
      label:      t(item.tKey),
      tooltip:    t("tip" + item.tKey.charAt(0).toUpperCase() + item.tKey.slice(1)),
      hours:      item.riskAdjustedHours,
      cost:       item.riskAdjustedCost,
      rowClass:   "break-row",
      colorClass: "mix",
    })), "mix");

  // Feature 3: JAS Model Assumptions
  renderJASAssumptions(input);
}

/* ── Feature 5: Combined Report ──────────────────────────────── */
function renderCombinedReport(input, curation, jas) {
  const totalInvestment = curation.pricing.annualInvestment + jas.pricing.annualInvestment;
  const totalBenefit    = curation.grossBenefit + jas.grossBenefit;
  const combinedNet     = totalBenefit - totalInvestment;
  const combinedROI     = totalInvestment > 0 ? combinedNet / totalInvestment : 0;
  const combinedPayback = totalBenefit > totalInvestment
    ? (totalInvestment / totalBenefit) * 12 : 0;
  const threeYear       = combinedNet * 3;

  animateKpi("combined-kpi-investment", CURRENCY.format(totalInvestment));
  animateKpi("combined-kpi-benefit",    CURRENCY.format(totalBenefit));
  animateKpi("combined-kpi-savings",    CURRENCY.format(combinedNet));
  animateKpi("combined-kpi-roi",        `${DECIMAL_2.format(combinedROI)}x`);
  animateKpi("combined-kpi-payback",    formatMonths(combinedPayback));
  animateKpi("combined-kpi-threeyear",  CURRENCY.format(threeYear));

  // KPI sub-text for combined
  const combinedHoursSaved = input.hourlyRate > 0 ? totalBenefit / input.hourlyRate : 0;
  const subInv    = document.getElementById("combined-kpi-investment-sub");
  const subBen    = document.getElementById("combined-kpi-benefit-sub");
  const subSav    = document.getElementById("combined-kpi-savings-sub");
  const subROI    = document.getElementById("combined-kpi-roi-sub");
  const subPayb   = document.getElementById("combined-kpi-payback-sub");
  const subThree  = document.getElementById("combined-kpi-threeyear-sub");

  if (subInv)   subInv.textContent   = currentLang === "zh"
    ? `Curation + JAS合并` : `Curation + JAS combined`;
  if (subBen)   subBen.textContent   = t("kpiSubHours")(INTEGER.format(Math.round(combinedHoursSaved / 2000)));
  if (subSav)   subSav.textContent   = t("kpiSubNetSavings")(CURRENCY.format(totalInvestment));
  if (subROI)   subROI.textContent   = t("kpiSubROI")(DECIMAL_2.format(combinedROI + 1));
  if (subPayb)  subPayb.textContent  = t("kpiSubPayback")(Math.ceil(combinedPayback));
  if (subThree) subThree.textContent = currentLang === "zh"
    ? `3年期净节省` : `3-year projection`;

  document.getElementById("combined-summary-list").innerHTML = [
    t("combinedNetLine")(CURRENCY.format(combinedNet)),
    t("combinedROILine")(DECIMAL_2.format(combinedROI)),
  ].map((line) => `<li>${line}</li>`).join("");

  document.getElementById("combined-summary-box").textContent =
    t("combinedSummaryBox")(
      CURRENCY.format(totalInvestment),
      CURRENCY.format(totalBenefit),
      CURRENCY.format(combinedNet),
      DECIMAL_2.format(combinedROI),
      formatMonths(combinedPayback)
    );

  // Feature 1: Per-dev ROI (combined uses max of the two user counts)
  const maxUsers = Math.max(input.curationUsers || 0, input.jasUsers || 0);
  renderPerDevRoi("combined", combinedNet, maxUsers);

  return { combinedNet, combinedROI, combinedPayback, threeYear };
}

/* ── Report toggle ────────────────────────────────────────────── */
function setActiveReport(reportName) {
  activeReport = (reportName === "jas" || reportName === "combined") ? reportName : "curation";
  const showCuration = activeReport === "curation";
  const showJAS      = activeReport === "jas";
  const showCombined = activeReport === "combined";

  curationReportNode.hidden = !showCuration;
  jasReportNode.hidden      = !showJAS;
  combinedReportNode.hidden = !showCombined;

  // Inputs: combined shows both, others show only relevant one
  curationInputsNode.hidden = showJAS;
  jasInputsNode.hidden      = showCuration;

  toggleCurationBtn.classList.toggle("is-active",  showCuration);
  toggleJasBtn.classList.toggle("is-active",       showJAS);
  toggleCombinedBtn.classList.toggle("is-active",  showCombined);
  toggleCurationBtn.setAttribute("aria-pressed",   String(showCuration));
  toggleJasBtn.setAttribute("aria-pressed",        String(showJAS));
  toggleCombinedBtn.setAttribute("aria-pressed",   String(showCombined));
}

/* ── Main run ─────────────────────────────────────────────────── */
function run() {
  updateAnnualCostHints();
  const input = parseInputs();
  warningNode.textContent = "";

  const isCuration = activeReport === "curation";
  const isJAS      = activeReport === "jas";
  const isCombined = activeReport === "combined";

  const isEmpty = isCuration
    ? (input.hourlyRate <= 0 || input.curationUsers <= 0)
    : isJAS
    ? (input.hourlyRate <= 0 || input.jasUsers <= 0)
    : (input.hourlyRate <= 0 || input.curationUsers <= 0 || input.jasUsers <= 0);

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
    `${t("curationUsersCount")} ${INTEGER.format(input.curationUsers)}, ` +
    `${t("jasUsersCount")} ${INTEGER.format(input.jasUsers)}.`;

  if (isCuration) {
    const curation = calcCuration(input);
    renderCurationReport(input, curation);
    renderHeadline(input.companyName, curation.netSavings, curation.paybackMonths);
    lastResult = { mode: "curation", input, curation };
  } else if (isJAS) {
    const jas = calcJAS(input);
    renderJASReport(input, jas);
    renderHeadline(input.companyName, jas.netSavings, jas.paybackMonths);
    lastResult = { mode: "jas", input, jas };
  } else {
    // Combined
    const curation = calcCuration(input);
    const jas      = calcJAS(input);
    const combined = renderCombinedReport(input, curation, jas);
    renderHeadline(input.companyName, combined.combinedNet, combined.combinedPayback);
    lastResult = { mode: "combined", input, curation, jas, combined };
  }
}

/* ── Feature 5: One-Pager Overlay ────────────────────────────── */
function populateOnePager() {
  if (!lastResult) return;
  const { mode, input } = lastResult;

  let netSavings, roi, paybackMonths, threeYear, perDevAmount, headlineText;

  if (mode === "curation") {
    const c = lastResult.curation;
    netSavings    = c.netSavings;
    roi           = c.roi;
    paybackMonths = c.paybackMonths;
    threeYear     = c.netSavings * 3;
    perDevAmount  = input.curationUsers > 0 ? Math.round(c.netSavings / input.curationUsers) : 0;
  } else if (mode === "jas") {
    const j = lastResult.jas;
    netSavings    = j.netSavings;
    roi           = j.roi;
    paybackMonths = j.paybackMonths;
    threeYear     = j.netSavings * 3;
    perDevAmount  = input.jasUsers > 0 ? Math.round(j.netSavings / input.jasUsers) : 0;
  } else {
    const comb = lastResult.combined;
    netSavings    = comb.combinedNet;
    roi           = comb.combinedROI;
    paybackMonths = comb.combinedPayback;
    threeYear     = comb.threeYear;
    const maxUsers = Math.max(input.curationUsers || 0, input.jasUsers || 0);
    perDevAmount  = maxUsers > 0 ? Math.round(netSavings / maxUsers) : 0;
  }

  const company = input.companyName || (currentLang === "zh" ? "您的组织" : "Your Organization");
  document.getElementById("op-prepared-for").textContent = t("onePagerPreparedFor")(company);
  document.getElementById("op-kpi-savings").textContent  = CURRENCY.format(netSavings);
  document.getElementById("op-kpi-roi").textContent      = `${DECIMAL_2.format(roi)}x`;
  document.getElementById("op-kpi-payback").textContent  = formatMonths(paybackMonths);
  document.getElementById("op-headline").textContent     =
    t("headlineEN")(company, CURRENCY.format(netSavings), formatMonths(paybackMonths));
  document.getElementById("op-three-year").textContent   =
    t("onePagerThreeYear")(CURRENCY.format(threeYear));
  document.getElementById("op-per-dev").textContent      =
    t("onePagerPerDev")(CURRENCY.format(Math.max(perDevAmount, 0)));

  // Apply i18n on overlay static strings
  document.querySelectorAll("#one-pager-overlay [data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (typeof val === "string") el.textContent = val;
  });
}

/* ── Feature 6: PDF Cover Page ───────────────────────────────── */
function populatePdfCover(input) {
  const company   = input.companyName || (currentLang === "zh" ? "您的组织" : "Your Organization");
  const now       = new Date();
  const dateStr   = now.toLocaleDateString(currentLang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  document.getElementById("pdf-cover-company").textContent = t("pdfCoverPrepared")(company);
  document.getElementById("pdf-cover-date").textContent    = t("pdfCoverGenerated")(dateStr);

  // Pull metrics from whichever report is active
  let netSavings = "—", roiVal = "—", paybackVal = "—";
  if (activeReport === "curation") {
    const curation = calcCuration(input);
    netSavings  = CURRENCY.format(curation.netSavings);
    roiVal      = `${DECIMAL_2.format(curation.roi)}x`;
    paybackVal  = formatMonths(curation.paybackMonths);
  } else if (activeReport === "jas") {
    const jas = calcJAS(input);
    netSavings = CURRENCY.format(jas.netSavings);
    roiVal     = `${DECIMAL_2.format(jas.roi)}x`;
    paybackVal = formatMonths(jas.paybackMonths);
  } else {
    const curation = calcCuration(input);
    const jas      = calcJAS(input);
    const totalInv = curation.pricing.annualInvestment + jas.pricing.annualInvestment;
    const totalBen = curation.grossBenefit + jas.grossBenefit;
    const net      = totalBen - totalInv;
    const roi      = totalInv > 0 ? net / totalInv : 0;
    const payback  = totalBen > totalInv ? (totalInv / totalBen) * 12 : 0;
    netSavings = CURRENCY.format(net);
    roiVal     = `${DECIMAL_2.format(roi)}x`;
    paybackVal = formatMonths(payback);
  }

  document.getElementById("pdf-cover-net-savings").textContent = netSavings;
  document.getElementById("pdf-cover-roi").textContent         = roiVal;
  document.getElementById("pdf-cover-payback").textContent     = paybackVal;

  // Re-apply i18n on cover page static strings
  document.querySelectorAll("#pdf-cover [data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (typeof val === "string") el.textContent = val;
  });
}

/* ── Event listeners ──────────────────────────────────────────── */
presetBtn.addEventListener("click", () => { setDefaults(); run(); });
form.addEventListener("input",  () => { run(); });
form.addEventListener("submit", (e) => { e.preventDefault(); run(); });

curationUsersInput.addEventListener("input",  syncAnnualPackagesFromCurationUsers);
curationUsersInput.addEventListener("change", syncAnnualPackagesFromCurationUsers);

toggleCurationBtn.addEventListener("click",  () => { setActiveReport("curation"); run(); });
toggleJasBtn.addEventListener("click",       () => { setActiveReport("jas");      run(); });
toggleCombinedBtn.addEventListener("click",  () => { setActiveReport("combined"); run(); });

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
  const input    = parseInputs();
  const company  = input.companyName;
  const filename = company ? `jfrog-roi-${company}.pdf` : "jfrog-roi-report.pdf";

  // Feature 6: Populate and show cover page
  populatePdfCover(input);
  const coverEl = document.getElementById("pdf-cover");
  coverEl.style.display = "block";

  // Wrap cover + report into a container
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "background:#fff;";
  const reportRoot = document.getElementById("report-root");
  const coverClone  = coverEl.cloneNode(true);
  coverClone.style.display = "block";
  const reportClone = reportRoot.cloneNode(true);
  wrapper.appendChild(coverClone);
  wrapper.appendChild(reportClone);
  document.body.appendChild(wrapper);

  html2pdf().set({
    margin: 8,
    filename,
    image:     { type: "jpeg", quality: 0.97 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF:     { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: "avoid-all" },
  }).from(wrapper).save().then(() => {
    document.body.removeChild(wrapper);
    coverEl.style.display = "none";
  });
});

/* ── Feature 5: One-Pager event listeners ─────────────────────── */
onePagerBtn.addEventListener("click", () => {
  populateOnePager();
  onePagerOverlay.hidden = false;
  document.body.style.overflow = "hidden";
});

document.getElementById("op-close-btn").addEventListener("click", () => {
  onePagerOverlay.hidden = true;
  document.body.style.overflow = "";
});

document.getElementById("op-export-btn").addEventListener("click", () => {
  const inner = document.getElementById("one-pager-inner");
  const input = lastResult ? lastResult.input : parseInputs();
  const company  = input.companyName;
  const filename = company ? `jfrog-roi-onepager-${company}.pdf` : "jfrog-roi-onepager.pdf";
  html2pdf().set({
    margin: 10,
    filename,
    image:       { type: "jpeg", quality: 0.97 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF:       { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak:   { mode: "avoid-all" },
  }).from(inner).save();
});

/* ── Init ─────────────────────────────────────────────────────── */
setDefaults();
syncAnnualPackagesFromCurationUsers();
setActiveReport(activeReport);
applyI18n();
run();
