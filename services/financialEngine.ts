import { CompanyData, CalculatedMetrics, RiskAnalysis, SimulationParams } from '../types';

export const calculateMetrics = (company: CompanyData, params: SimulationParams): CalculatedMetrics => {
  const f2019 = company.financials[2019];
  const f2022 = company.financials[2022];
  const f2023 = company.financials[2023];

  // AGR (Actual Growth Rate) = (Revenue_2023 / Revenue_2019)^(1/4) - 1
  const agrDecimal = Math.pow(f2023.revenue / f2019.revenue, 1 / 4) - 1;
  const agr = agrDecimal * 100;

  // ROE = Net Income_2023 / Shareholders Equity_2023
  // Apply simulation adjustment to ROE if any
  const rawRoeDecimal = f2023.netIncome / f2023.equity;
  const roeDecimal = rawRoeDecimal + (params.roeAdjustment / 100);
  const roe = roeDecimal * 100;

  // SGR (Sustainable Growth Rate) = ROE * Retention Ratio
  const sgr = roe * params.retentionRatio;

  // Hollow Gap
  const hollowGap = agr - sgr;

  // Other Metrics
  const fcfMargin = (f2023.fcf / f2023.revenue) * 100;
  const netMargin = (f2023.netIncome / f2023.revenue) * 100;
  const debtToEquity = (f2023.assets - f2023.equity) / f2023.equity;
  const fcfToNetIncome = f2023.fcf / f2023.netIncome;
  
  const revenueGrowthYoY = ((f2023.revenue - f2022.revenue) / f2022.revenue) * 100;

  return {
    agr,
    roe,
    sgr,
    hollowGap,
    fcfMargin,
    netMargin,
    debtToEquity,
    fcfToNetIncome,
    revenueGrowthYoY
  };
};

export const calculateRiskScore = (metrics: CalculatedMetrics): RiskAnalysis => {
  let score = 50;

  // 1. Hollow Gap Impact: +/- 30 max
  const gapImpact = Math.min(Math.max(metrics.hollowGap * 2, -30), 30);
  score += gapImpact;

  // 2. Revenue Growth Penalty: if growth > 25%, penalize (overheating)
  const growthPenalty = Math.max(metrics.revenueGrowthYoY - 25, 0) * 0.5;
  score -= growthPenalty;

  // 3. FCF Quality Bonus: +15 max
  const fcfBonus = Math.min(metrics.fcfMargin / 2, 15);
  score += fcfBonus;

  // Clamp Score
  const totalScore = Math.max(0, Math.min(100, score));

  // Risk Breakdown
  // Financial Risk (40%): D/E Ratio impact
  const financialRisk = Math.min(20 + (metrics.debtToEquity * 10), 40);

  // Growth Risk (30%): Hollow Gap magnitude
  const growthRisk = Math.min(Math.abs(metrics.hollowGap) * 4, 30); // Multiplier adjusted to make gap visible

  // Efficiency Risk (20%): Low ROE penalty
  const efficiencyRisk = Math.min(Math.max(30 - metrics.roe / 2, 0), 20);

  // Liquidity Risk (10%): Low FCF Margin penalty
  const liquidityRisk = Math.min(Math.max(15 - metrics.fcfMargin / 3, 0), 10);

  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'MODERATE';
  if (totalScore <= 40) riskLevel = 'LOW';
  else if (totalScore > 70) riskLevel = 'HIGH';

  return {
    totalScore,
    financialRisk,
    growthRisk,
    efficiencyRisk,
    liquidityRisk,
    riskLevel
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: 'compact'
  }).format(val);
};

export const formatPercent = (val: number) => {
  return `${val.toFixed(1)}%`;
};