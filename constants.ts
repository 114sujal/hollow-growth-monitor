import { CompanyData } from './types';

export const COMPANIES: CompanyData[] = [
  {
    id: 'reliance',
    name: 'Reliance Industries',
    ticker: 'RELIANCE.NS',
    sector: 'Energy',
    mcap: '₹18.5L Cr',
    description: "India's largest conglomerate with interests in petrochemicals, refining, oil, and telecommunications.",
    financials: {
      2019: { revenue: 520000, netIncome: 45000, equity: 270000, assets: 750000, fcf: 32000 },
      2020: { revenue: 560000, netIncome: 48000, equity: 290000, assets: 800000, fcf: 35000 },
      2021: { revenue: 620000, netIncome: 52000, equity: 310000, assets: 850000, fcf: 38000 },
      2022: { revenue: 680000, netIncome: 58000, equity: 330000, assets: 900000, fcf: 42000 },
      2023: { revenue: 750000, netIncome: 60000, equity: 350000, assets: 950000, fcf: 45000 }
    }
  },
  {
    id: 'tcs',
    name: 'Tata Consultancy Svcs',
    ticker: 'TCS.NS',
    sector: 'Technology',
    mcap: '₹13.2L Cr',
    description: "Global leader in IT services, consulting, and business solutions.",
    financials: {
      2019: { revenue: 146463, netIncome: 31472, equity: 89450, assets: 115000, fcf: 28000 },
      2020: { revenue: 156949, netIncome: 32340, equity: 84126, assets: 120000, fcf: 32000 },
      2021: { revenue: 164177, netIncome: 32430, equity: 86433, assets: 128000, fcf: 36000 },
      2022: { revenue: 191754, netIncome: 38327, equity: 89139, assets: 140000, fcf: 39000 },
      2023: { revenue: 225458, netIncome: 42147, equity: 92450, assets: 152000, fcf: 41000 }
    }
  },
  {
    id: 'infy',
    name: 'Infosys Limited',
    ticker: 'INFY.NS',
    sector: 'Technology',
    mcap: '₹6.8L Cr',
    description: "A global leader in next-generation digital services and consulting.",
    financials: {
      2019: { revenue: 82675, netIncome: 15404, equity: 64949, assets: 85000, fcf: 13000 },
      2020: { revenue: 90791, netIncome: 16594, equity: 65450, assets: 92000, fcf: 14500 },
      2021: { revenue: 100472, netIncome: 19351, equity: 76351, assets: 108000, fcf: 20000 },
      2022: { revenue: 121641, netIncome: 22110, equity: 75350, assets: 118000, fcf: 21000 },
      2023: { revenue: 146767, netIncome: 24095, equity: 75407, assets: 125000, fcf: 20500 }
    }
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    ticker: 'HDFCBANK.NS',
    sector: 'Financial Services',
    mcap: '₹12.1L Cr',
    description: "India's largest private sector bank by assets and market capitalization.",
    financials: {
      2019: { revenue: 116597, netIncome: 21078, equity: 149206, assets: 1244541, fcf: 15000 },
      2020: { revenue: 138073, netIncome: 26257, equity: 170986, assets: 1530511, fcf: 35000 },
      2021: { revenue: 146063, netIncome: 31116, equity: 203720, assets: 1746870, fcf: 42000 },
      2022: { revenue: 157263, netIncome: 36961, equity: 240092, assets: 2068535, fcf: 25000 },
      2023: { revenue: 192800, netIncome: 44108, equity: 280199, assets: 2466081, fcf: 50000 }
    }
  },
  {
    id: 'itc',
    name: 'ITC Limited',
    ticker: 'ITC.NS',
    sector: 'Consumer Goods',
    mcap: '₹5.5L Cr',
    description: "Conglomerate with diversified presence in FMCG, Hotels, Packaging, and Agri-Business.",
    financials: {
      2019: { revenue: 48352, netIncome: 12464, equity: 57949, assets: 71000, fcf: 8000 },
      2020: { revenue: 49404, netIncome: 15136, equity: 64044, assets: 75000, fcf: 9500 },
      2021: { revenue: 53155, netIncome: 13031, equity: 59000, assets: 78000, fcf: 10500 },
      2022: { revenue: 65204, netIncome: 15057, equity: 61000, assets: 82000, fcf: 11000 },
      2023: { revenue: 76518, netIncome: 18753, equity: 67000, assets: 88000, fcf: 12000 }
    }
  }
];