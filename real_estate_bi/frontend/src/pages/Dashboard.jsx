import { useEffect, useState, useMemo } from 'react';
import { financeApi } from '../api/client';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Table, ChartPie, Calendar, Building2 } from 'lucide-react';

export default function Dashboard() {
  const [view, setView] = useState('table'); // 'table' или 'pie'
  const [budgetData, setBudgetData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('residential');

  // Маппинг ключей для человекочитаемого отображения
  const categoryLabels = {
    residential: 'Жилая',
    commercial: 'Коммерческая',
    storage: 'Кладовая',
    parking: 'Парковка',
    '100_percent': '100% Оплата',
    mortgage: 'Ипотека',
    installment: 'Рассрочка'
  };

  useEffect(() => {
    financeApi.getBudget()
      .then(response => {
        setBudgetData(response.data);
        if (response.data.months?.length > 0) {
          // Устанавливаем первый доступный месяц по умолчанию
          setSelectedMonth(response.data.months[0]);
        }
      })
      .catch(error => {
        console.error("Ошибка при загрузке данных бюджета:", error);
      });
  }, []);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  // Данные для диаграммы распределения по проектам
  const pieProjectData = useMemo(() => {
    if (!budgetData || !selectedMonth) return [];
    return budgetData.projectShares?.[selectedMonth]?.[selectedCategory] || [];
  }, [budgetData, selectedMonth, selectedCategory]);

  // Данные для диаграммы распределения по видам оплат
  const piePaymentData = useMemo(() => {
    if (!budgetData || !selectedMonth) return [];
    return budgetData.paymentShares?.[selectedMonth]?.[selectedCategory] || [];
  }, [budgetData, selectedMonth, selectedCategory]);

  if (!budgetData) {
    return <div className="p-10 text-center text-slate-500 font-medium">Загрузка аналитики...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Заголовок и переключатель видов */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Корпоративный бюджет</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setView('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'table' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Table size={18} /> Таблица
          </button>
          <button
            onClick={() => setView('pie')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'pie' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ChartPie size={18} /> Диаграммы
          </button>
        </div>
      </div>

      {view === 'table' ? (
        /* РЕЖИМ ТАБЛИЦЫ */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-sm font-semibold text-slate-600 sticky left-0 bg-slate-50 z-10 w-64 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    Показатель / Месяц
                  </th>
                  {budgetData.months.map(m => (
                    <th key={m} className="p-4 text-sm font-semibold text-slate-600 min-w-[120px] text-center">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {/* Секция: Контрактация (шт) */}
                <tr className="bg-sky-50 font-bold text-sky-900">
                  <td className="p-3 sticky left-0 bg-sky-50" colSpan={budgetData.months.length + 1}>Контрактация (шт)</td>
                </tr>
                {['residential', 'commercial', 'storage', 'parking'].map(cat => (
                  <tr key={`units-${cat}`} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 pl-8 text-slate-500 sticky left-0 bg-white border-r border-slate-50">{categoryLabels[cat]}</td>
                    {budgetData.months.map(m => (
                      <td key={m} className="p-3 text-center">{budgetData.tableData.units?.[cat]?.[m] || 0}</td>
                    ))}
                  </tr>
                ))}

                {/* Секция: Контрактация (кв.м) */}
                <tr className="bg-emerald-50 font-bold text-emerald-900">
                  <td className="p-3 sticky left-0 bg-emerald-50" colSpan={budgetData.months.length + 1}>Контрактация (кв.м)</td>
                </tr>
                {['residential', 'commercial', 'storage', 'parking'].map(cat => (
                  <tr key={`sqm-${cat}`} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 pl-8 text-slate-500 sticky left-0 bg-white border-r border-slate-50">{categoryLabels[cat]}</td>
                    {budgetData.months.map(m => (
                      <td key={m} className="p-3 text-center">{(budgetData.tableData.sqm?.[cat]?.[m] || 0).toLocaleString()}</td>
                    ))}
                  </tr>
                ))}

                {/* Секция: Контрактация ($) */}
                <tr className="bg-amber-50 font-bold text-amber-900">
                  <td className="p-3 sticky left-0 bg-amber-50" colSpan={budgetData.months.length + 1}>Контрактация ($)</td>
                </tr>
                {['residential', 'commercial', 'storage', 'parking'].map(cat => (
                  <tr key={`usd-${cat}`} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 pl-8 text-slate-500 sticky left-0 bg-white border-r border-slate-50">{categoryLabels[cat]}</td>
                    {budgetData.months.map(m => (
                      <td key={m} className="p-3 text-center font-medium">${(budgetData.tableData.contracted_usd?.[cat]?.[m] || 0).toLocaleString()}</td>
                    ))}
                  </tr>
                ))}

                {/* Секция: Поступления ($) */}
                <tr className="bg-slate-100 font-bold text-slate-900">
                  <td className="p-3 sticky left-0 bg-slate-100" colSpan={budgetData.months.length + 1}>Поступления ($)</td>
                </tr>
                {['100_percent', 'mortgage', 'installment'].map(type => (
                  <tr key={`receipts-${type}`} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 pl-8 text-slate-500 sticky left-0 bg-white border-r border-slate-50">{categoryLabels[type]}</td>
                    {budgetData.months.map(m => (
                      <td key={m} className="p-3 text-center text-emerald-600 font-semibold">
                        ${(budgetData.tableData.receipts_usd?.[type]?.[m] || 0).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* РЕЖИМ ДИАГРАММ */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Панель фильтров */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar size={16} /> Месяц
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  {budgetData.months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Building2 size={16} /> Вид недвижимости
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="residential">Жилая</option>
                  <option value="commercial">Коммерческая</option>
                  <option value="storage">Кладовая</option>
                  <option value="parking">Парковка</option>
                </select>
              </div>
            </div>
          </div>

          {/* Контент диаграмм */}
          <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Диаграмма 1: Доли проектов */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-h-[450px]">
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Доли проектов</h3>
                <p className="text-xs text-slate-400 mb-6">{categoryLabels[selectedCategory]} | {selectedMonth}</p>
                <div className="h-[320px] w-full">
                  {pieProjectData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieProjectData}
                          cx="50%" cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieProjectData.map((entry, index) => (
                            <Cell key={`cell-proj-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 italic">Нет данных</div>
                  )}
                </div>
              </div>

              {/* Диаграмма 2: Виды оплат */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-h-[450px]">
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Виды оплат</h3>
                <p className="text-xs text-slate-400 mb-6">{categoryLabels[selectedCategory]} | {selectedMonth}</p>
                <div className="h-[320px] w-full">
                  {piePaymentData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={piePaymentData}
                          cx="50%" cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${categoryLabels[name] || name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {piePaymentData.map((entry, index) => (
                            <Cell key={`cell-pay-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value) => categoryLabels[value] || value}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 italic">Нет данных</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}