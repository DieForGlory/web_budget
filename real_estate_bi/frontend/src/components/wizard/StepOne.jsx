export default function StepOne({ data, update }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    update({ [name]: type === 'number' ? Number(value) : value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Базовые параметры</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Название проекта *</label>
          <input type="text" name="name" value={data.name} onChange={handleChange} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Класс ЖК *</label>
          <select name="project_class" value={data.project_class} onChange={handleChange} className="w-full p-2 border">
            <option value="Комфорт">Комфорт</option>
            <option value="Бизнес">Бизнес</option>
            <option value="Элит">Элит</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Этажность (напр. 16 или 12-16) *</label>
          <input type="text" name="floors" value={data.floors} onChange={handleChange} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Кол-во подъездов *</label>
          <input type="number" name="entrances" value={data.entrances} onChange={handleChange} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Квартир на этаже</label>
          <input type="number" name="apts_per_floor" value={data.apts_per_floor || ''} onChange={handleChange} className="w-full p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Общая пл. коммерции (кв.м) *</label>
          <input type="number" name="commercial_area_sqm" value={data.commercial_area_sqm} onChange={handleChange} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Срок строительства (мес) *</label>
          <input type="number" name="construction_duration_months" value={data.construction_duration_months} onChange={handleChange} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Адрес ЖК *</label>
          <input type="text" name="address" value={data.address} onChange={handleChange} className="w-full p-2 border" required />
        </div>
      </div>
    </div>
  );
}