import { useState } from 'react';
import { projectApi } from '../api/client';
import StepOne from '../components/wizard/StepOne';
import StepTwo from '../components/wizard/StepTwo';
import StepThree from '../components/wizard/StepThree';
import StepFour from '../components/wizard/StepFour';

export default function CreateProjectWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '', floors: '', entrances: 0, apts_per_floor: 0,
    commercial_area_sqm: 0, construction_duration_months: 0,
    project_class: 'Комфорт', address: '',
    teps: [],
    monthly_price_increase_percent: 0, usd_exchange_rate: 0,
    sales_start_date: '', avg_sales_pace_units: 0,
    seasonality_coefficients: { "1": 100, "2": 100, "3": 100, "4": 100, "5": 100, "6": 100, "7": 100, "8": 100, "9": 100, "10": 100, "11": 100, "12": 100 },
    total_expenses_usd: 0
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await projectApi.createProject(projectData);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = (payload) => {
    setProjectData(prev => ({ ...prev, ...payload }));
  };

  return (
    <div className="max-w-5xl mx-auto animate-slide-up">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="flex items-center w-full">
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step >= num ? 'bg-sky-500 text-white shadow-md shadow-sky-200' : 'bg-slate-200 text-slate-500'
              }`}>
                {num}
              </div>
              {num < 4 && (
                <div className={`w-full h-1 mx-4 rounded transition-colors duration-300 ${
                  step > num ? 'bg-sky-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="p-8 min-h-[450px]">
          <div className="animate-fade-in">
            {step === 1 && <StepOne data={projectData} update={updateData} />}
            {step === 2 && <StepTwo data={projectData} update={updateData} />}
            {step === 3 && <StepThree data={projectData} update={updateData} />}
            {step === 4 && <StepFour data={projectData} update={updateData} />}
          </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-100 flex justify-between bg-slate-50">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-6 py-2.5 rounded-lg font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Назад
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg font-medium text-white bg-sky-500 hover:bg-sky-600 shadow-sm shadow-sky-200 hover:shadow-md transition-all duration-200"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg font-medium text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-200 hover:shadow-md disabled:opacity-70 transition-all duration-200"
            >
              {isLoading ? 'Генерация...' : 'Завершить'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}