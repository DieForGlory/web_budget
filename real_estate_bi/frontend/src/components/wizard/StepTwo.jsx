export default function StepTwo({ data, update }) {
  const addTep = () => {
    update({ teps: [...data.teps, { category: 'residential', units_count: 0, avg_price_sqm_usd: 0, avg_area_sqm: 0, payment_configs: [] }] });
  };

  const updateTep = (index, field, value) => {
    const newTeps = [...data.teps];
    newTeps[index][field] = value;
    update({ teps: newTeps });
  };

  const addPaymentConfig = (tepIndex) => {
    const newTeps = [...data.teps];
    newTeps[tepIndex].payment_configs.push({ payment_type: '100_percent', share_percent: 100, installment_months: 0, down_payment_percent: 100 });
    update({ teps: newTeps });
  };

  const updatePaymentConfig = (tepIndex, pIndex, field, value) => {
    const newTeps = [...data.teps];
    newTeps[tepIndex].payment_configs[pIndex][field] = value;
    update({ teps: newTeps });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Типы недвижимости (ТЭП) и Виды оплат</h3>
        <button onClick={addTep} className="bg-sky-100 text-sky-700 px-3 py-1 rounded text-sm font-medium">Добавить ТЭП</button>
      </div>

      {data.teps.map((tep, tIndex) => (
        <div key={tIndex} className="p-4 border border-slate-200 rounded bg-slate-50 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Категория</label>
              <select value={tep.category} onChange={(e) => updateTep(tIndex, 'category', e.target.value)} className="w-full p-2 border text-sm">
                <option value="residential">Жилая</option>
                <option value="commercial">Коммерческая</option>
                <option value="storage">Кладовая</option>
                <option value="parking">Парковка</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Кол-во (шт)</label>
              <input type="number" value={tep.units_count} onChange={(e) => updateTep(tIndex, 'units_count', Number(e.target.value))} className="w-full p-2 border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Ср. цена ($/кв.м)</label>
              <input type="number" value={tep.avg_price_sqm_usd} onChange={(e) => updateTep(tIndex, 'avg_price_sqm_usd', Number(e.target.value))} className="w-full p-2 border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Ср. площадь (кв.м)</label>
              <input type="number" value={tep.avg_area_sqm} onChange={(e) => updateTep(tIndex, 'avg_area_sqm', Number(e.target.value))} className="w-full p-2 border text-sm" />
            </div>
          </div>

          <div className="pl-4 border-l-2 border-sky-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Распределение видов оплат</span>
              <button onClick={() => addPaymentConfig(tIndex)} className="text-xs bg-slate-200 px-2 py-1 rounded">Добавить оплату</button>
            </div>
            {tep.payment_configs.map((pay, pIndex) => (
              <div key={pIndex} className="grid grid-cols-4 gap-2 mb-2">
                <select value={pay.payment_type} onChange={(e) => updatePaymentConfig(tIndex, pIndex, 'payment_type', e.target.value)} className="p-1 border text-xs">
                  <option value="100_percent">100% Оплата</option>
                  <option value="mortgage">Ипотека</option>
                  <option value="installment">Рассрочка</option>
                </select>
                <input type="number" placeholder="Доля (%)" value={pay.share_percent} onChange={(e) => updatePaymentConfig(tIndex, pIndex, 'share_percent', Number(e.target.value))} className="p-1 border text-xs" />
                {pay.payment_type === 'installment' && (
                  <>
                    <input type="number" placeholder="ПВ (%)" value={pay.down_payment_percent} onChange={(e) => updatePaymentConfig(tIndex, pIndex, 'down_payment_percent', Number(e.target.value))} className="p-1 border text-xs" />
                    <input type="number" placeholder="Срок (мес)" value={pay.installment_months} onChange={(e) => updatePaymentConfig(tIndex, pIndex, 'installment_months', Number(e.target.value))} className="p-1 border text-xs" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}