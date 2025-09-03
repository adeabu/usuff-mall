import React, { useState } from 'react';
import './App.css';
import GenderSelection from './components/GenderSelection';
import FunctionalTests from './components/FunctionalTests';
import Summary from './components/Summary';

function App() {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);
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
        },
        measurements: { age: '', height: '', weight: '' },
      });
      setStep(0);
      setGender('');
    }
  };

  const isStep1Complete = gender !== '';
  const isStep2Complete = formData.measurements.age && Object.values(formData.tests).some(test => Object.values(test).some(val => val !== '' && val !== 0));

  const steps = [
    { name: 'Gender', component: () => <GenderSelection setGender={setGender} setStep={setStep} /> },
    { name: 'Tests', component: () => <FunctionalTests formData={formData} setFormData={setFormData} gender={gender} /> },
    { name: 'Summary', component: () => <Summary formData={formData} gender={gender} resetData={resetData} /> },
  ];

  return (
    <div className={`max-w-3xl mx-auto p-6 ${isHighContrast ? 'dark bg-gray-800 text-white' : 'bg-gray-50'}`}>
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 shadow-sm rounded">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Physiotherapy Test Tool</h1>
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className="bg-gray-500 text-white p-2 rounded text-sm sm:text-lg"
          >
            {isHighContrast ? 'Normal Mode' : 'High Contrast'}
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Data is not stored. Copy summary to EMR before closing.
        </p>
      </div>
      <div className="flex mb-6 mt-4">
        {steps.map((s, index) => (
          <div key={index} className="flex-1">
            <div className={`h-2 ${index <= step ? 'bg-blue-500' : 'bg-gray-200'} rounded`}></div>
            <p className={`text-center text-sm ${index === step ? 'font-bold text-blue-500 dark:text-blue-300' : 'text-gray-500 dark:text-gray-300'}`}>
              {s.name}
            </p>
          </div>
        ))}
      </div>
      {steps[step].component()}
      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button
            className="bg-gray-500 text-white p-2 rounded text-sm sm:text-lg"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        {step < steps.length - 1 && (
          <button
            className={`p-2 rounded text-sm sm:text-lg ${step === 0 && !isStep1Complete || step === 1 && !isStep2Complete ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
            disabled={step === 0 && !isStep1Complete || step === 1 && !isStep2Complete}
            onClick={() => setStep(step + 1)}
          >
            Next
          </button>
        )}
        <button
          className="bg-red-500 text-white p-2 rounded text-sm sm:text-lg"
          onClick={resetData}
        >
          Delete Data
        </button>
      </div>
    </div>
  );
}

export default App;