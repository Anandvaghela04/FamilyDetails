import { useState } from 'react';
import FamilyForm from './components/FamilyForm';
import FamilyList from './components/FamilyList';
import FamilyCard from './components/FamilyCard';
import { FamilyRecord } from './lib/supabase';

function App() {
  const [view, setView] = useState<'form' | 'list'>('form');
  const [selectedRecord, setSelectedRecord] = useState<FamilyRecord | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmitSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setView('list');
  };

  const handleGenerateCard = (record: FamilyRecord) => {
    setSelectedRecord(record);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView('form')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              view === 'form'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            નવો ફોર્મ
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              view === 'list'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            રેકોર્ડ્સ જુઓ
          </button>
        </div>

        {view === 'form' ? (
          <FamilyForm onSubmitSuccess={handleSubmitSuccess} />
        ) : (
          <FamilyList key={refreshKey} onGenerateCard={handleGenerateCard} />
        )}

        {selectedRecord && (
          <FamilyCard record={selectedRecord} onClose={() => setSelectedRecord(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
