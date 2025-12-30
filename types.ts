export interface FinancialYear {
  revenue: number;
  netIncome: number;
  equity: number;
  assets: number;
  fcf: number;
}

export interface CompanyData {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  mcap: string;
  description: string;
  financials: Record<number, FinancialYear>;
}

export interface CalculatedMetrics {
  agr: number; // Actual Growth Rate
  roe: number; // Return on Equity
  sgr: number; // Sustainable Growth Rate
  hollowGap: number;
  fcfMargin: number;
  netMargin: number;
  debtToEquity: number;
  fcfToNetIncome: number;
  revenueGrowthYoY: number;
}

export interface RiskAnalysis {
  financialRisk: number; // /40
  growthRisk: number;    // /30
  efficiencyRisk: number; // /20
  liquidityRisk: number; // /10
  totalScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface SimulationParams {
  retentionRatio: number; // Default 0.65
  roeAdjustment: number; // +/- percentage points
}