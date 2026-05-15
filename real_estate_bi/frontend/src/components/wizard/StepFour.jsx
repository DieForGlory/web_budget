export default function StepFour({ data, update }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800 border-b pb-2">Расходная часть</h3>
      <div className="max-w-md bg-slate-50 p-6 rounded-xl border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Общая сумма расходов на проект (USD) *</label>
        <input
          type="number"
          name="total_expenses_usd"
          value={data.total_expenses_usd || ''}
          onChange={(e) => update({ total_expenses_usd: Number(e.target.value) })}
          className="w-full p-3 border border-slate-300 text-lg font-medium"
          required
        />
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Указанная сумма агрегируется в корпоративный бюджет и будет использована для расчета финальной рентабельности и финансового результата (P&L) модели.
        </p>
      </div>
    </div>
  );
}