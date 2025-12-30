import React, { useState, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { COMPANIES } from './constants';
import { SimulationParams } from './types';
import { calculateMetrics, calculateRiskScore, formatCurrency, formatPercent } from './services/financialEngine';
import { RevenueTrendChart, IncomeTrendChart, JawsOfDeathChart, KPIRadarChart } from './components/Charts';
import VerdictBox from './components/VerdictBox';
import { 
  Building2, 
  Download, 
  Settings2, 
  Briefcase, 
  FileSearch,
  AlertCircle,
  TrendingDown,
  Activity,
  Layers
} from 'lucide-react';

const App: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(COMPANIES[0].id);
  const [viewMode, setViewMode] = useState<'INVESTOR' | 'AUDITOR'>('INVESTOR');
  const [simulation, setSimulation] = useState<SimulationParams>({
    retentionRatio: 0.65,
    roeAdjustment: 0
  });

  const dashboardRef = useRef<HTMLDivElement>(null);

  const selectedCompany = useMemo(() => 
    COMPANIES.find(c => c.id === selectedCompanyId) || COMPANIES[0]
  , [selectedCompanyId]);

  const metrics = useMemo(() => 
    calculateMetrics(selectedCompany, simulation)
  , [selectedCompany, simulation]);

  const risk = useMemo(() => 
    calculateRiskScore(metrics)
  , [metrics]);

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    
    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2,
      backgroundColor: '#0f172a'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${selectedCompany.ticker}_Hollow_Growth_Report.pdf`);
  };

  const MetricCard = ({ title, value, subValue, trend, icon: Icon, colorClass }: any) => (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-all">
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <Icon size={16} className="text-slate-500" />
      </div>
      <div className="flex items-end gap-2">
        <h3 className={`text-2xl font-bold ${colorClass || 'text-white'}`}>{value}</h3>
        {subValue && <span className="text-xs text-slate-400 mb-1">{subValue}</span>}
      </div>
      {trend && (
        <div className={`text-xs mt-2 ${trend.includes('+') ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend} vs prev yr
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Hollow Growth Monitor V3
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Forensic Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select 
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-slate-800 border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 outline-none min-w-[180px]"
            >
              {COMPANIES.map(c => (
                <option key={c.id} value={c.id}>{c.ticker} - {c.name}</option>
              ))}
            </select>
            
            <button 
              onClick={handleExportPDF}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* CONTROLS BAR */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
          
          {/* View Toggle */}
          <div className="bg-slate-800/50 p-1 rounded-lg inline-flex border border-slate-700/50">
            <button
              onClick={() => setViewMode('INVESTOR')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                viewMode === 'INVESTOR' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase size={16} />
              Investor View
            </button>
            <button
              onClick={() => setViewMode('AUDITOR')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                viewMode === 'AUDITOR' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSearch size={16} />
              Auditor View
            </button>
          </div>

          {/* Simulator */}
          <div className="flex flex-col sm:flex-row gap-4 bg-slate-800/30 p-3 rounded-xl border border-dashed border-slate-700 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 sm:mb-0">
              <Settings2 size={14} /> What-If Simulator
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-300">Retention Ratio: {(simulation.retentionRatio * 100).toFixed(0)}%</label>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={simulation.retentionRatio}
                onChange={(e) => setSimulation({...simulation, retentionRatio: parseFloat(e.target.value)})}
                className="w-24 accent-cyan-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-300">ROE Adj: {simulation.roeAdjustment > 0 ? '+' : ''}{simulation.roeAdjustment}%</label>
              <input 
                type="range" min="-10" max="10" step="1" 
                value={simulation.roeAdjustment}
                onChange={(e) => setSimulation({...simulation, roeAdjustment: parseInt(e.target.value)})}
                className="w-24 accent-cyan-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* DASHBOARD CONTENT */}
        <div ref={dashboardRef} className="space-y-6">
          
          {/* Top Grid: Profile & Verdict */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Profile Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h2 className="text-2xl font-bold text-white mb-1">{selectedCompany.name}</h2>
                   <div className="flex gap-2 text-xs">
                     <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{selectedCompany.ticker}</span>
                     <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{selectedCompany.sector}</span>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase">Market Cap</p>
                  <p className="font-bold text-slate-200">{selectedCompany.mcap}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {selectedCompany.description}
              </p>
              <div className="pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                <div>
                   <span className="text-xs text-slate-500 block mb-1">FY23 Revenue</span>
                   <span className="text-lg font-semibold text-white">{formatCurrency(selectedCompany.financials[2023].revenue)} Cr</span>
                </div>
                <div>
                   <span className="text-xs text-slate-500 block mb-1">FY23 Net Income</span>
                   <span className="text-lg font-semibold text-white">{formatCurrency(selectedCompany.financials[2023].netIncome)} Cr</span>
                </div>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="lg:col-span-2">
              <VerdictBox risk={risk} metrics={metrics} mode={viewMode} />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="AGR (Actual Growth)" 
              value={formatPercent(metrics.agr)} 
              subValue="5-Yr Revenue CAGR"
              icon={TrendingDown}
              colorClass={metrics.agr > metrics.sgr ? 'text-red-400' : 'text-emerald-400'}
            />
            <MetricCard 
              title="SGR (Sustainable)" 
              value={formatPercent(metrics.sgr)} 
              subValue={`ROE ${formatPercent(metrics.roe)} × ${(simulation.retentionRatio * 100).toFixed(0)}% RR`}
              icon={Layers}
              colorClass="text-cyan-400"
            />
            <MetricCard 
              title="Hollow Gap" 
              value={`${metrics.hollowGap > 0 ? '+' : ''}${metrics.hollowGap.toFixed(1)}%`}
              subValue={metrics.hollowGap > 2 ? 'UNSUSTAINABLE' : 'HEALTHY'}
              icon={AlertCircle}
              colorClass={metrics.hollowGap > 4 ? 'text-red-500' : (metrics.hollowGap > 1 ? 'text-amber-400' : 'text-emerald-500')}
            />
            <MetricCard 
              title="Earn Quality (FCF/NI)" 
              value={`${metrics.fcfToNetIncome.toFixed(2)}x`}
              subValue={metrics.fcfToNetIncome < 0.8 ? 'POOR CASH CONVERSION' : 'STRONG CASH FLOW'}
              icon={Building2}
              colorClass={metrics.fcfToNetIncome < 0.8 ? 'text-amber-400' : 'text-emerald-400'}
            />
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Revenue Trend (5-Yr)
                </h3>
              </div>
              <RevenueTrendChart company={selectedCompany} metrics={metrics} />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
               <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Net Income Trend
                </h3>
              </div>
              <IncomeTrendChart company={selectedCompany} metrics={metrics} />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
               <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-red-500"></span> Jaws of Death (AGR vs SGR)
                </h3>
                <div className="bg-slate-700/50 px-2 py-1 rounded text-[10px] text-slate-400">Target: AGR &lt; SGR</div>
              </div>
              <JawsOfDeathChart company={selectedCompany} metrics={metrics} />
              <p className="text-xs text-center text-slate-500 mt-2">
                 Red Bar (AGR) exceeding Cyan Bar (SGR) indicates reliance on external funding.
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
               <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-purple-500"></span> KPI Radar
                </h3>
              </div>
              <KPIRadarChart company={selectedCompany} metrics={metrics} />
            </div>
          </div>

          {/* Risk Breakdown Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
             <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex justify-between items-center">
               <h3 className="text-sm font-bold text-white uppercase tracking-wider">Risk Component Breakdown</h3>
               <span className="text-xs text-slate-400">Max Score: 100 (High Risk)</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-700">
               
               <div className="p-4 text-center">
                 <div className="text-xs text-slate-400 mb-1">Financial Risk (40%)</div>
                 <div className="text-xl font-bold text-slate-200">{risk.financialRisk.toFixed(0)}<span className="text-xs text-slate-500">/40</span></div>
                 <div className="text-[10px] text-slate-500 mt-1">Driven by D/E Ratio ({metrics.debtToEquity.toFixed(2)})</div>
               </div>

               <div className="p-4 text-center">
                 <div className="text-xs text-slate-400 mb-1">Growth Risk (30%)</div>
                 <div className="text-xl font-bold text-slate-200">{risk.growthRisk.toFixed(0)}<span className="text-xs text-slate-500">/30</span></div>
                 <div className="text-[10px] text-slate-500 mt-1">Driven by Hollow Gap Size</div>
               </div>

               <div className="p-4 text-center">
                 <div className="text-xs text-slate-400 mb-1">Efficiency Risk (20%)</div>
                 <div className="text-xl font-bold text-slate-200">{risk.efficiencyRisk.toFixed(0)}<span className="text-xs text-slate-500">/20</span></div>
                 <div className="text-[10px] text-slate-500 mt-1">Based on ROE ({metrics.roe.toFixed(1)}%)</div>
               </div>

               <div className="p-4 text-center">
                 <div className="text-xs text-slate-400 mb-1">Liquidity Risk (10%)</div>
                 <div className="text-xl font-bold text-slate-200">{risk.liquidityRisk.toFixed(0)}<span className="text-xs text-slate-500">/10</span></div>
                 <div className="text-[10px] text-slate-500 mt-1">Based on FCF Margin</div>
               </div>

             </div>
          </div>

          {/* Footer Info */}
          <div className="text-center text-xs text-slate-500 pt-8 pb-4">
            <p>Generated by Hollow Growth Monitor V3. Analysis based on FY19-FY23 financial data.</p>
            <p className="mt-1">For educational and simulation purposes only. Not investment advice.</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;