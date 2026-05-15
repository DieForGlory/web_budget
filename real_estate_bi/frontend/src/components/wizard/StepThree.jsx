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
      <h3 className="text-lg font-semibold text-slate-800">Сбытовые и финансовые метрики</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ежемесячный рост цены (%) *</label>
          <input type="number" step="0.1" name="monthly_price_increase_percent" value={data.monthly_price_increase_percent} onChange={handleChange} className="w-full p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Курс UZS/USD *</label>
          <input type="number" name="usd_exchange_rate" value={data.usd_exchange_rate} onChange={handleChange} className="w-full p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Дата старта продаж *</label>
          <input type="date" name="sales_start_date" value={data.sales_start_date} onChange={handleChange} className="w-full p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ср. темп продаж (шт/мес) *</label>
          <input type="number" name="avg_sales_pace_units" value={data.avg_sales_pace_units} onChange={handleChange} className="w-full p-2 border" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Сезонные коэффициенты (%) по месяцам года</label>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <div key={month}>
              <span className="block text-xs text-center text-slate-500 mb-1">Месяц {month}</span>
              <input type="number" value={data.seasonality_coefficients[month] || 100} onChange={(e) => handleSeasonality(month, e.target.value)} className="w-full p-1 border text-sm text-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}