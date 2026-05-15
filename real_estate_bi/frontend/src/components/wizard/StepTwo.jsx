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

  const removePaymentConfig = (tepIndex, pIndex) => {
    const newTeps = [...data.teps];
    newTeps[tepIndex].payment_configs.splice(pIndex, 1);
    update({ teps: newTeps });
  };

  const removeTep = (tepIndex) => {
    const newTeps = [...data.teps];
    newTeps.splice(tepIndex, 1);
    update({ teps: newTeps });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-xl font-semibold text-slate-800">Типы недвижимости (ТЭП)</h3>
        <button onClick={addTep} className="bg-sky-100 text-sky-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-200 transition-colors">
          + Добавить ТЭП
        </button>
      </div>

      {data.teps.map((tep, tIndex) => (
        <div key={tIndex} className="p-6 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-slate-700">Параметры объекта</span>
            <button onClick={() => removeTep(tIndex)} className="text-red-500 text-sm hover:underline">Удалить ТЭП</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Категория</label>
              <select value={tep.category} onChange={(e) => updateTep(tIndex, 'category', e.target.value)} className="w-full p-2 border border-slate-300 text-sm">
                <option value="residential">Жилая</option>
                <option value="commercial">Коммерческая</option>
                <option value="storage">Кладовая</option>
                <option value="parking">Парковка</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Кол-во (шт)</label>
              <input type="number" value={tep.units_count || ''} onChange={(e) => updateTep(tIndex, 'units_count', Number(e.target.value))} className="w-full p-2 border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Ср. цена ($/кв.м)</label>
              <input type="number" value={tep.avg_price_sqm_usd || ''} onChange={(e) => updateTep(tIndex, 'avg_price_sqm_usd', Number(e.target.value))} className="w-full p-2 border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Ср. площадь (кв.м)</label>
              <input type="number" value={tep.avg_area_sqm || ''} onChange={(e) => updateTep(tIndex, 'avg_area_sqm', Number(e.target.value))} className="w-full p-2 border border-slate-300 text-sm" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-700">Распределение видов оплат</span>
              <button onClick={() => addPaymentConfig(tIndex)} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded transition-colors">
                + Добавить вид оплаты
              </button>
            </div>
            <div className="space-y-2">
              {tep.payment_configs.map((pay, pIndex) => (
                <div key={pIndex} className="flex gap-2 items-center bg-white p-2 rounded border border-slate-200">
                  <select value={pay.payment_type} onChange={(e) => updatePaymentConfig(tIndex, pIndex, 'payment_type', e.target.value)} className="p-1.5 border border-slate-300 text-sm flex-1">
                    <option value="100_percent">100% Оплата</option>
                    <option value="mortgage">Ипотека</option>
                    <option value="installment">Рассрочка</option>
                  </select>
                  <div className="flex-1 relative">
                    <span className="absolute left-2 top-2 text-xs text-slate-400">Доля %</span>
                    <input type="number" value={pay.share_percent || ''} onChange={(e) => updatePaymentConfig(tIndex, pIndex, 'share_percent', Number(e.target.value))} className="w-full p-1.5 pl-14 border border-slate-300 text-sm" />
                  </div>
                  {pay.payment_type === 'installment' && (
                    <>
                      <div className="flex-1 relative">
                        <span className="absolute left-2 top-2 text-xs text-slate-400">ПВ %</span>
                        <input type="number" value={pay.down_payment_percent || ''} onChange={(e) => updatePaymentConfig(tIndex, pIndex, 'down_payment_percent', Number(e.target.value))} className="w-full p-1.5 pl-12 border border-slate-300 text-sm" />
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-2 top-2 text-xs text-slate-400">Срок (мес)</span>
                        <input type="number" value={pay.installment_months || ''} onChange={(e) => updatePaymentConfig(tIndex, pIndex, 'installment_months', Number(e.target.value))} className="w-full p-1.5 pl-20 border border-slate-300 text-sm" />
                      </div>
                    </>
                  )}
                  <button onClick={() => removePaymentConfig(tIndex, pIndex)} className="text-slate-400 hover:text-red-500 px-2 font-bold">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}