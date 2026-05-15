import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateProjectWizard from './pages/CreateProjectWizard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">Real Estate BI</h1>
        </nav>
        <main className="p-6">
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