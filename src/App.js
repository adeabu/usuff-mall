import React, { useState } from 'react';
import './App.css';
import FunctionalTests from './components/FunctionalTests';

function App() {
  const [gender, setGender] = useState('');
  const [formData, setFormData] = useState({
    tests: {
      walk2x20m: { time: '', pulse: '', borgHeart: 0, borgMuscular: 0 },
      sixMwt: { aid: 'No', distance: '', pulse: '', borgHeart: 0, borgMuscular: 0 },
      stair: { time: '', pulse: '', borgHeart: 0, borgMuscular: 0 },
      handStrength: { dominant: 'Right', dominantKg: '', nonDominantKg: '' },
      nineHolePeg: { dominantTime: '', nonDominantTime: '' },
      pileLumbar: { weight: '', lifts: '', pulse: '', borg: 0 },
      pileCervical: { weight: '', lifts: '', pulse: '', borg: 0 },
      figureEight: { normalTime: '', normalOversteps: '', fastTime: '', fastOversteps: '' },
      oneLegBalance: { open: '', closed: '' },
    },
    measurements: { age: '', height: '', weight: '' },
  });

  const resetData = () => {
    if (window.confirm('Clear all data?')) {
      setFormData({
        tests: {
          walk2x20m: { time: '', pulse: '', borgHeart: 0, borgMuscular: 0 },
          sixMwt: { aid: 'No', distance: '', pulse: '', borgHeart: 0, borgMuscular: 0 },
          stair: { time: '', pulse: '', borgHeart: 0, borgMuscular: 0 },
          handStrength: { dominant: 'Right', dominantKg: '', nonDominantKg: '' },
          nineHolePeg: { dominantTime: '', nonDominantTime: '' },
          pileLumbar: { weight: '', lifts: '', pulse: '', borg: 0 },
          pileCervical: { weight: '', lifts: '', pulse: '', borg: 0 },
          figureEight: { normalTime: '', normalOversteps: '', fastTime: '', fastOversteps: '' },
          oneLegBalance: { open: '', closed: '' },
        },
        measurements: { age: '', height: '', weight: '' },
      });
      setGender('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50">
      {/* Kön */}
      <div className="p-4 bg-white rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Kön</h2>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500"
          aria-label="Välj kön"
        >
          <option value="">Välj...</option>
          <option value="male">Man</option>
          <option value="female">Kvinna</option>
        </select>
      </div>

      {/* Tester */}
      <div className="p-4 bg-white rounded shadow mb-4">
        <FunctionalTests formData={formData} setFormData={setFormData} gender={gender} />
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 text-white p-2 rounded text-sm sm:text-lg"
          onClick={resetData}
        >
          Rensa data
        </button>
      </div>
    </div>
  );
}

export default App;
