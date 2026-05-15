export default function StepFour({ data, update }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Расходная часть</h3>
      <div className="max-w-md">
        <label className="block text-sm font-medium text-slate-700 mb-1">Общая сумма расходов на проект (USD) *</label>
        <input
          type="number"
          name="total_expenses_usd"
          value={data.total_expenses_usd}
          onChange={(e) => update({ total_expenses_usd: Number(e.target.value) })}
          className="w-full p-3 border text-lg"
          required
        />
        <p className="text-xs text-slate-500 mt-2">
          Указанная сумма будет использована для расчета финальной рентабельности модели в будущих обновлениях.
        </p>
      </div>
    </div>
  );
}