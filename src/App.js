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
    <div className="container">
      {/* Kön */}
      <div className="card shadow section">
        <h2 className="title">Kön</h2>
        <div className="radio-group" role="radiogroup" aria-label="Välj kön">
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={(e) => setGender(e.target.value)}
            />
            <span>Man</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={(e) => setGender(e.target.value)}
            />
            <span>Kvinna</span>
          </label>
        </div>
      </div>

      {/* Tester */}
      <div className="section">
        <FunctionalTests formData={formData} setFormData={setFormData} gender={gender} />
      </div>

      <div className="btn-row" style={{ marginTop: 16 }}>
        <button className="btn" style={{ background: '#ef4444', color: '#fff' }} onClick={resetData}>Rensa data</button>
      </div>
    </div>
  );
}

export default App;
