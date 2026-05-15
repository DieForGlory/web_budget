import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateProjectWizard from './pages/CreateProjectWizard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-slate-800 tracking-tight">Real Estate BI</Link>
            <Link to="/create" className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm shadow-sky-200">
              Создать модель
            </Link>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-6 mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateProjectWizard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;