export default function StepThree({ data, update }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    update({ [name]: type === 'number' ? Number(value) : value });
  };

  const handleSeasonality = (month, value) => {
    update({ seasonality_coefficients: { ...data.seasonality_coefficients, [month]: Number(value) } });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 border-b pb-2">Сбытовые и финансовые метрики</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ежемесячный рост цены (%) *</label>
          <input type="number" step="0.1" name="monthly_price_increase_percent" value={data.monthly_price_increase_percent || ''} onChange={handleChange} className="w-full p-2.5 border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Курс UZS/USD *</label>
          <input type="number" name="usd_exchange_rate" value={data.usd_exchange_rate || ''} onChange={handleChange} className="w-full p-2.5 border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Дата старта продаж *</label>
          <input type="date" name="sales_start_date" value={data.sales_start_date} onChange={handleChange} className="w-full p-2.5 border border-slate-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ср. темп продаж (шт/мес) *</label>
          <input type="number" name="avg_sales_pace_units" value={data.avg_sales_pace_units || ''} onChange={handleChange} className="w-full p-2.5 border border-slate-300" />
        </div>
      </div>

      <div className="pt-4">
        <label className="block text-sm font-medium text-slate-700 mb-3">Сезонные коэффициенты (%) по месяцам года</label>
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <div key={month} className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="block text-xs font-semibold text-center text-slate-500 mb-1">Месяц {month}</span>
              <input type="number" value={data.seasonality_coefficients[month] || ''} onChange={(e) => handleSeasonality(month, e.target.value)} className="w-full p-1.5 border border-slate-300 text-sm text-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}