import React, { useMemo } from 'react';
import { UserCheck, Cpu, CreditCard, ArrowRight, TrendingUp, BarChart2, ShieldAlert, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { getSyntheticDataset } from '../utils/scoringEngine';
import { formatRupee } from '../utils/formatters';

interface Step0LandingProps {
  onStart: () => void;
}

export const Step0Landing: React.FC<Step0LandingProps> = ({ onStart }) => {
  const dataset = useMemo(() => getSyntheticDataset(), []);

  // Compute Chart 1: Dynamic Approval Rate by Employment Type directly from the portfolio dataset
  const empChartData = useMemo(() => {
    const categories: ('Salaried' | 'Self-Employed' | 'Business Owner' | 'Student' | 'Unemployed')[] = [
      'Salaried',
      'Business Owner',
      'Self-Employed',
      'Student',
      'Unemployed',
    ];

    return categories.map((emp) => {
      const items = dataset.filter((d) => d.employmentType === emp);
      const approved = items.filter((d) => d.outcome === 'Approved').length;
      const rate = items.length > 0 ? Math.round((approved / items.length) * 100) : 0;
      return {
        employment: emp,
        rate,
        total: items.length,
        approved,
      };
    });
  }, [dataset]);

  // Compute Chart 2: Average Approved Credit Limit by Income Bracket directly from portfolio dataset
  const incomeChartData = useMemo(() => {
    const brackets = [
      { label: '< ₹30K', min: 0, max: 30000 },
      { label: '₹30K - ₹60K', min: 30000, max: 60000 },
      { label: '₹60K - ₹100K', min: 60000, max: 100000 },
      { label: '> ₹100K', min: 100000, max: 10000000 },
    ];

    return brackets.map((b) => {
      const approvedInBracket = dataset.filter(
        (d) => d.outcome === 'Approved' && d.netMonthlyIncome >= b.min && d.netMonthlyIncome < b.max
      );
      const totalLimit = approvedInBracket.reduce((acc, curr) => acc + curr.predictedLimit, 0);
      const avgLimit =
        approvedInBracket.length > 0 ? Math.round(totalLimit / approvedInBracket.length) : 0;

      // Format label text for the bar
      let limitLabel = '₹0';
      if (avgLimit >= 100000) {
        limitLabel = `₹${(avgLimit / 100000).toFixed(2)}L`;
      } else if (avgLimit > 0) {
        limitLabel = `₹${Math.round(avgLimit / 1000)}k`;
      }

      return {
        bracket: b.label,
        avgLimit,
        limitLabel,
        count: approvedInBracket.length,
      };
    });
  }, [dataset]);

  const empColors: Record<string, string> = {
    Salaried: '#0B2447',
    'Business Owner': '#19376D',
    'Self-Employed': '#F2A93B',
    Student: '#64748b',
    Unemployed: '#ef4444',
  };

  return (
    <div id="step-0-landing" className="max-w-6xl mx-auto space-y-12 py-8 px-4 sm:px-6">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden border border-slate-300 bg-[#0B2447]">
        {/* Abstract Backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2447] via-[#0f2a52] to-[#152e59] z-0"></div>
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
        <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-[#F2A93B]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md text-[#F2A93B] border border-white/10 text-xs font-semibold shadow-inner">
            <TrendingUp className="w-4 h-4" />
            <span>TransUnion CIBIL Scoring & Underwriting Evaluation</span>
          </div>

          <h1 className="text-2xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
            Curious if you'd get approved? <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F2A93B] to-[#f5c370]">
              Find out in 2 minutes.
            </span>
          </h1>

          <p className="text-white text-lg sm:text-xl leading-relaxed max-w-2xl font-light">
            This platform evaluates your profile against authentic TransUnion CIBIL scoring methodology (300–900 scale) and private-sector retail banking underwriting guidelines to estimate approval odds, Lifetime Free card tiers, dynamic APR, and credit limits.
          </p>

          <div className="pt-4">
            <button
              id="btn-start-prediction"
              onClick={onStart}
              className="inline-flex items-center space-x-3 bg-[#F2A93B] hover:bg-[#e0982d] text-[#0B2447] font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start My Prediction</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3-Icon Explainer Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#0B2447]">How The Prediction Engine Works</h2>
          <p className="text-slate-600 text-sm">Three simple steps to evaluate your credit worthiness simulation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0B2447]/10 text-[#0B2447] flex items-center justify-center font-bold text-xl">
              <UserCheck className="w-6 h-6 text-[#0B2447]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#F2A93B] uppercase tracking-wider">Step 1</span>
              <h3 className="text-lg font-bold text-[#0B2447]">Enter Your Profile</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Provide basic demographic, employment organization tier, salary payment mode, and active loan details.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F2A93B]/20 text-[#D98E2B] flex items-center justify-center font-bold text-xl">
              <Cpu className="w-6 h-6 text-[#D98E2B]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#0B2447] uppercase tracking-wider">Step 2</span>
              <h3 className="text-lg font-bold text-[#0B2447]">CIBIL & Audit Scrub</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Simulates TransUnion CIBIL 5-pillar weights (Payment History 35%, Exposure 30%, Vintage 15%, Mix 10%, Inquiries 10%) & bank verification.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              <CreditCard className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Step 3</span>
              <h3 className="text-lg font-bold text-[#0B2447]">Odds, Limits & Dynamic APR</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Receive TransUnion score meter, Lifetime Free tier recommendation, dynamic interest rate from 9% p.a., and audit checklist.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Benchmark Insights Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#F2A93B] uppercase tracking-wider">
              <BarChart2 className="w-4 h-4" />
              <span>Benchmark Risk Profiles</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2447]">
              Credit Insights from 180 Sample Profiles
            </h2>
          </div>
          <div className="text-xs font-semibold text-[#0B2447] bg-[#F2A93B]/20 border border-[#F2A93B]/40 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-[#F2A93B]" />
            <span>Retail Banking Portfolio Benchmarks</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Approval Rate by Employment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B2447]">Approval Rate by Employment Type</h3>
              <span className="text-xs font-semibold text-slate-500">% Approved</span>
            </div>
            <div className="h-72 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={empChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} opacity={0.7} />
                  <XAxis
                    dataKey="employment"
                    tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#475569' }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    unit="%"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val, name, props) => [
                      `${Number(val)}% (${props?.payload?.approved || 0} of ${props?.payload?.total || 0} approved)`,
                      'Approval Rate',
                    ]}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar
                    dataKey="rate"
                    radius={[8, 8, 0, 0]}
                    barSize={36}
                    label={{
                      position: 'top',
                      formatter: (val: unknown) => `${Number(val)}%`,
                      fontSize: 12,
                      fontWeight: 700,
                      fill: '#0B2447',
                    }}
                  >
                    {empChartData.map((entry) => (
                      <Cell key={entry.employment} fill={empColors[entry.employment] || '#0B2447'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Salaried (74%) and established Business Owners (51%) demonstrate the highest approval rates due to steady EPFO/banking salary trails and audited ITRs.
            </p>
          </div>

          {/* Chart 2: Average Approved Limit by Income Bracket */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B2447]">Average Approved Limit by Income Bracket</h3>
              <span className="text-xs font-semibold text-slate-500">In ₹ (INR)</span>
            </div>
            <div className="h-72 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeChartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} opacity={0.7} />
                  <XAxis
                    dataKey="bracket"
                    tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#475569' }}
                    domain={[0, 600000]}
                    ticks={[0, 150000, 300000, 450000, 600000]}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val) => [formatRupee(Number(val)), 'Avg Approved Limit']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar
                    dataKey="avgLimit"
                    fill="#F2A93B"
                    radius={[8, 8, 0, 0]}
                    barSize={36}
                    label={{
                      position: 'top',
                      formatter: (val: unknown) => {
                        const num = Number(val);
                        if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
                        if (num > 0) return `₹${Math.round(num / 1000)}k`;
                        return '₹0';
                      },
                      fontSize: 11,
                      fontWeight: 700,
                      fill: '#0B2447',
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Higher monthly income tiers unlock expanded multiplier caps (up to 3.5x net income for prime profiles earning &gt;₹100k/mo).
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start Action Bar */}
      <div className="bg-[#102F5A] rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-white text-sm">
          <ShieldAlert className="w-5 h-5 text-[#F2A93B] shrink-0" />
          <span>Ready to check your simulated approval odds and TransUnion CIBIL score tier? Takes only 2 minutes.</span>
        </div>
        <button
          onClick={onStart}
          className="bg-[#F2A93B] hover:bg-[#e0982d] text-[#0B2447] font-extrabold text-sm px-6 py-3 rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
        >
          Begin Simulation
        </button>
      </div>
    </div>
  );
};