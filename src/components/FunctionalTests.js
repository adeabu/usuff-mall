import React from 'react';
import norms from '../norms.json';

function FunctionalTests({ formData, setFormData, gender }) {
  const handleChange = (e, section, field) => {
    setFormData({
      ...formData,
      tests: {
        ...formData.tests,
        [section]: { ...formData.tests[section], [field]: e.target.value },
      },
    });
  };

  const handleMeasurementChange = (e) => {
    setFormData({
      ...formData,
      measurements: { ...formData.measurements, [e.target.name]: e.target.value },
    });
  };

  const getAgeRange = (age) => {
    const ageNum = parseInt(age);
    if (ageNum < 21) return null;
    if (ageNum <= 25) return '21-25';
    if (ageNum <= 30) return '26-30';
    if (ageNum <= 35) return '31-35';
    if (ageNum <= 40) return '36-40';
    if (ageNum <= 45) return '41-45';
    if (ageNum <= 50) return '46-50';
    if (ageNum <= 55) return '51-55';
    if (ageNum <= 60) return '56-60';
    if (ageNum <= 65) return '61-65';
    if (ageNum <= 70) return '66-70';
    return null;
  };

  const { age, height, weight } = formData.measurements;
  const tests = formData.tests;
  const ageRange = age ? getAgeRange(age) : null;

  // Calculations
  const walkSpeed = tests.walk2x20m.time ? (40 / parseFloat(tests.walk2x20m.time)).toFixed(2) : '';
  const walkStatus = walkSpeed && norms['2x20m_walk'][gender]
    ? parseFloat(walkSpeed) < norms['2x20m_walk'][gender].range[0] ? 'Sämre' : parseFloat(walkSpeed) > norms['2x20m_walk'][gender].range[1] ? 'Bättre' : 'Norm'
    : '';

  const sixMwtPredicted = gender === 'male'
    ? age && height && weight ? ((7.57 * parseFloat(height)) - (5.02 * parseInt(age)) - (1.76 * parseFloat(weight)) - 309).toFixed(2) : ''
    : age && height && weight ? ((2.11 * parseFloat(height)) - (5.78 * parseInt(age)) - (2.29 * parseFloat(weight)) + 667).toFixed(2) : '';
  const sixMwtLower = sixMwtPredicted ? (parseFloat(sixMwtPredicted) - (gender === 'male' ? 153 : 139)).toFixed(2) : '';
  const sixMwtStatus = tests.sixMwt.distance && sixMwtPredicted
    ? parseFloat(tests.sixMwt.distance) < parseFloat(sixMwtLower) ? 'Sämre' : parseFloat(tests.sixMwt.distance) > (norms['6MWT'][gender][ageRange]?.range[1] || parseFloat(sixMwtPredicted)) ? 'Bättre' : 'Norm'
    : '';

  const stairSpeed = tests.stair.time ? ((17 * 0.185) / parseFloat(tests.stair.time)).toFixed(3) : '';
  const stairStatus = stairSpeed && norms['stair_climb'][gender]
    ? parseFloat(stairSpeed) < norms['stair_climb'][gender].range[0] ? 'Sämre' : parseFloat(stairSpeed) > norms['stair_climb'][gender].range[1] ? 'Bättre' : 'Norm'
    : '';

  const handDominantStatus = tests.handStrength.dominantKg && ageRange && norms['hand_strength'][gender][ageRange]
    ? parseFloat(tests.handStrength.dominantKg) < norms['hand_strength'][gender][ageRange][tests.handStrength.dominant.toLowerCase()][0] ? 'Sämre' : parseFloat(tests.handStrength.dominantKg) > norms['hand_strength'][gender][ageRange][tests.handStrength.dominant.toLowerCase()][1] ? 'Bättre' : 'Norm'
    : '';
  const handNonDominantStatus = tests.handStrength.nonDominantKg && ageRange && norms['hand_strength'][gender][ageRange]
    ? parseFloat(tests.handStrength.nonDominantKg) < norms['hand_strength'][gender][ageRange][tests.handStrength.dominant.toLowerCase() === 'right' ? 'left' : 'right'][0] ? 'Sämre' : parseFloat(tests.handStrength.nonDominantKg) > norms['hand_strength'][gender][ageRange][tests.handStrength.dominant.toLowerCase() === 'right' ? 'left' : 'right'][1] ? 'Bättre' : 'Norm'
    : '';

  const nhptDominantStatus = tests.nineHolePeg.dominantTime && ageRange && norms['nine_hole_peg'][gender][ageRange]
    ? parseFloat(tests.nineHolePeg.dominantTime) > norms['nine_hole_peg'][gender][ageRange][tests.handStrength.dominant.toLowerCase()][1] ? 'Sämre' : parseFloat(tests.nineHolePeg.dominantTime) < norms['nine_hole_peg'][gender][ageRange][tests.handStrength.dominant.toLowerCase()][0] ? 'Bättre' : 'Norm'
    : '';
  const nhptNonDominantStatus = tests.nineHolePeg.nonDominantTime && ageRange && norms['nine_hole_peg'][gender][ageRange]
    ? parseFloat(tests.nineHolePeg.nonDominantTime) > norms['nine_hole_peg'][gender][ageRange][tests.handStrength.dominant.toLowerCase() === 'right' ? 'left' : 'right'][1] ? 'Sämre' : parseFloat(tests.nineHolePeg.nonDominantTime) < norms['nine_hole_peg'][gender][ageRange][tests.handStrength.dominant.toLowerCase() === 'right' ? 'left' : 'right'][0] ? 'Bättre' : 'Norm'
    : '';

  const pileLumbarAdjusted = tests.pileLumbar.weight && weight ? (parseFloat(tests.pileLumbar.weight) / parseFloat(weight)).toFixed(2) : '';
  const pileLumbarStatus = tests.pileLumbar.weight && norms['pile_lumbar'][gender]
    ? parseFloat(tests.pileLumbar.weight) < norms['pile_lumbar'][gender].range[0] ? 'Sämre' : parseFloat(tests.pileLumbar.weight) > norms['pile_lumbar'][gender].range[1] ? 'Bättre' : 'Norm'
    : '';
  const pileLumbarAdjustedStatus = pileLumbarAdjusted && norms['pile_lumbar'][gender]
    ? parseFloat(pileLumbarAdjusted) < norms['pile_lumbar'][gender].adjusted[0] ? 'Sämre' : parseFloat(pileLumbarAdjusted) > norms['pile_lumbar'][gender].adjusted[1] ? 'Bättre' : 'Norm'
    : '';

  const pileCervicalAdjusted = tests.pileCervical.weight && weight ? (parseFloat(tests.pileCervical.weight) / parseFloat(weight)).toFixed(2) : '';
  const pileCervicalStatus = tests.pileCervical.weight && norms['pile_cervical'][gender]
    ? parseFloat(tests.pileCervical.weight) < norms['pile_cervical'][gender].range[0] ? 'Sämre' : parseFloat(tests.pileCervical.weight) > norms['pile_cervical'][gender].range[1] ? 'Bättre' : 'Norm'
    : '';
  const pileCervicalAdjustedStatus = pileCervicalAdjusted && norms['pile_cervical'][gender]
    ? parseFloat(pileCervicalAdjusted) < norms['pile_cervical'][gender].adjusted[0] ? 'Sämre' : parseFloat(pileCervicalAdjusted) > norms['pile_cervical'][gender].adjusted[1] ? 'Bättre' : 'Norm'
    : '';

  const figureEightNormalStatus = tests.figureEight.normalTime && norms['figure_eight_walk'][gender].normal
    ? (parseFloat(tests.figureEight.normalTime) > norms['figure_eight_walk'][gender].normal.time[1] || parseFloat(tests.figureEight.normalOversteps) > norms['figure_eight_walk'][gender].normal.oversteps) ? 'Sämre' : (parseFloat(tests.figureEight.normalTime) < norms['figure_eight_walk'][gender].normal.time[0] && parseFloat(tests.figureEight.normalOversteps) <= norms['figure_eight_walk'][gender].normal.oversteps) ? 'Bättre' : 'Norm'
    : '';
  const figureEightFastStatus = tests.figureEight.fastTime && norms['figure_eight_walk'][gender].fast
    ? (parseFloat(tests.figureEight.fastTime) > norms['figure_eight_walk'][gender].fast.time[1] || parseFloat(tests.figureEight.fastOversteps) > norms['figure_eight_walk'][gender].fast.oversteps) ? 'Sämre' : (parseFloat(tests.figureEight.fastTime) < norms['figure_eight_walk'][gender].fast.time[0] && parseFloat(tests.figureEight.fastOversteps) <= norms['figure_eight_walk'][gender].fast.oversteps) ? 'Bättre' : 'Norm'
    : '';

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Functional Tests</h2>
      <div className="mb-4">
        <h3 className="font-bold">Measurements (for 6MWT and PILE norms)</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Age (years)</label>
          <input
            type="number"
            name="age"
            value={formData.measurements.age}
            onChange={handleMeasurementChange}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.measurements.height}
            onChange={handleMeasurementChange}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.measurements.weight}
            onChange={handleMeasurementChange}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">2x20m Walk Test ({gender === 'male' ? '8 kg' : '4 kg'})</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Time (s)</label>
          <input
            type="number"
            value={tests.walk2x20m.time}
            onChange={(e) => handleChange(e, 'walk2x20m', 'time')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Final Pulse (bpm)</label>
          <input
            type="number"
            value={tests.walk2x20m.pulse}
            onChange={(e) => handleChange(e, 'walk2x20m', 'pulse')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Borg CR10 Heart/Lungs</label>
          <input
            type="range"
            min="0"
            max="10"
            value={tests.walk2x20m.borgHeart}
            onChange={(e) => handleChange(e, 'walk2x20m', 'borgHeart')}
            className="w-full"
          />
          <span>{tests.walk2x20m.borgHeart}</span>
        </div>
        <p>Speed: {walkSpeed} m/s, Status: {walkStatus}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">6-Minute Walk Test</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Walking Aid</label>
          <select
            value={tests.sixMwt.aid}
            onChange={(e) => handleChange(e, 'sixMwt', 'aid')}
            className="border p-2 w-full rounded"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Distance (m)</label>
          <input
            type="number"
            value={tests.sixMwt.distance}
            onChange={(e) => handleChange(e, 'sixMwt', 'distance')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Final Pulse (bpm)</label>
          <input
            type="number"
            value={tests.sixMwt.pulse}
            onChange={(e) => handleChange(e, 'sixMwt', 'pulse')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Predicted: {sixMwtPredicted} m, Lower Limit: {sixMwtLower} m, Status: {sixMwtStatus}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Stair Climb (17 steps, 18.5 cm)</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Time (s)</label>
          <input
            type="number"
            value={tests.stair.time}
            onChange={(e) => handleChange(e, 'stair', 'time')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Speed: {stairSpeed} m/s, Status: {stairStatus}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Hand Strength (Jamar)</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Dominant Hand</label>
          <select
            value={tests.handStrength.dominant}
            onChange={(e) => handleChange(e, 'handStrength', 'dominant')}
            className="border p-2 w-full rounded"
          >
            <option value="Right">Right</option>
            <option value="Left">Left</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Dominant Hand (kg)</label>
          <input
            type="number"
            value={tests.handStrength.dominantKg}
            onChange={(e) => handleChange(e, 'handStrength', 'dominantKg')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Non-Dominant Hand (kg)</label>
          <input
            type="number"
            value={tests.handStrength.nonDominantKg}
            onChange={(e) => handleChange(e, 'handStrength', 'nonDominantKg')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Dominant: {handDominantStatus}, Non-Dominant: {handNonDominantStatus}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Nine Hole Peg Test</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Dominant Hand (s)</label>
          <input
            type="number"
            value={tests.nineHolePeg.dominantTime}
            onChange={(e) => handleChange(e, 'nineHolePeg', 'dominantTime')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Non-Dominant Hand (s)</label>
          <input
            type="number"
            value={tests.nineHolePeg.nonDominantTime}
            onChange={(e) => handleChange(e, 'nineHolePeg', 'nonDominantTime')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Dominant: {nhptDominantStatus || 'Enter values and age'}, Non-Dominant: {nhptNonDominantStatus || 'Enter values and age'}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">PILE Lumbar</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Final Weight (kg)</label>
          <input
            type="number"
            value={tests.pileLumbar.weight}
            onChange={(e) => handleChange(e, 'pileLumbar', 'weight')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Number of Lifts</label>
          <input
            type="number"
            value={tests.pileLumbar.lifts}
            onChange={(e) => handleChange(e, 'pileLumbar', 'lifts')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Weight: {pileLumbarStatus}, Adjusted: {pileLumbarAdjusted} kg/kg ({pileLumbarAdjustedStatus})</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">PILE Cervical</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Final Weight (kg)</label>
          <input
            type="number"
            value={tests.pileCervical.weight}
            onChange={(e) => handleChange(e, 'pileCervical', 'weight')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Number of Lifts</label>
          <input
            type="number"
            value={tests.pileCervical.lifts}
            onChange={(e) => handleChange(e, 'pileCervical', 'lifts')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Weight: {pileCervicalStatus}, Adjusted: {pileCervicalAdjusted} kg/kg ({pileCervicalAdjustedStatus})</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Figure-of-8 Walk Test</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Normal Pace Time (s)</label>
          <input
            type="number"
            value={tests.figureEight.normalTime}
            onChange={(e) => handleChange(e, 'figureEight', 'normalTime')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Normal Pace Oversteps</label>
          <input
            type="number"
            value={tests.figureEight.normalOversteps}
            onChange={(e) => handleChange(e, 'figureEight', 'normalOversteps')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Fast Pace Time (s)</label>
          <input
            type="number"
            value={tests.figureEight.fastTime}
            onChange={(e) => handleChange(e, 'figureEight', 'fastTime')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Fast Pace Oversteps</label>
          <input
            type="number"
            value={tests.figureEight.fastOversteps}
            onChange={(e) => handleChange(e, 'figureEight', 'fastOversteps')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Normal Pace: {figureEightNormalStatus || 'Enter values'}, Fast Pace: {figureEightFastStatus || 'Enter values'}</p>
      </div>
    </div>
  );
}

export default FunctionalTests;