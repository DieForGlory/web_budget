import { useEffect, useState } from 'react';
import { financeApi } from '../api/client';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

export default function Dashboard() {
  const [budget, setBudget] = useState([]);

  useEffect(() => {
    financeApi.getBudget().then(response => {
      setBudget(response.data);
    }).catch(console.error);
  }, []);

  const formatYAxis = (tickItem) => {
    return new Intl.NumberFormat('ru-RU', { notation: "compact", compactDisplay: "short" }).format(tickItem);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Корпоративный бюджет</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-shadow hover:shadow-md duration-300">
        <h3 className="text-lg font-semibold text-slate-700 mb-6">Агрегированные поступления (USD)</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={budget} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceipts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}
              />
              <Area
                type="monotone"
                dataKey="total_receipts_usd"
                stroke="#0ea5e9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorReceipts)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#0284c7' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}