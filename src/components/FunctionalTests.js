import React from 'react';
import {
  calc2x20m,
  calc6MWT,
  calcStair,
  calcHandStrength,
  calcNHPT,
  calcPILE,
  calcFigure8,
  calcBalance,
  gradeLabel,
} from '../utils/calculations';

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

  const { age, height, weight } = formData.measurements;
  const tests = formData.tests;
  // Calculations via shared utils
  const six = calc6MWT({ gender, age, heightCm: height, weightKg: weight, distanceM: tests.sixMwt.distance });
  const stair = calcStair({ timeSec: tests.stair.time, gender });
  const walk = calc2x20m({ timeSec: tests.walk2x20m.time, gender });
  const hand = calcHandStrength({ gender, age, dominantHand: tests.handStrength.dominant, domKg: tests.handStrength.dominantKg, nonDomKg: tests.handStrength.nonDominantKg });
  const nhpt = calcNHPT({ gender, age, dominantHand: tests.handStrength.dominant, domTime: tests.nineHolePeg.dominantTime, nonDomTime: tests.nineHolePeg.nonDominantTime });
  const pile = calcPILE({ gender, lumbarKg: tests.pileLumbar.weight, cervicalKg: tests.pileCervical.weight });
  const fig8 = calcFigure8({ gender, normalTime: tests.figureEight.normalTime, normalOver: tests.figureEight.normalOversteps, fastTime: tests.figureEight.fastTime, fastOver: tests.figureEight.fastOversteps });
  const balance = calcBalance({ gender, openSec: tests.oneLegBalance?.open, closedSec: tests.oneLegBalance?.closed });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Funktionella tester</h2>
      <div className="mb-4">
        <h3 className="font-bold">Mått (för 6MWT och PILE)</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Ålder (år)</label>
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
          <label className="block text-sm font-medium">Längd (cm)</label>
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
          <label className="block text-sm font-medium">Vikt (kg)</label>
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
      {/* 1) 6MWT */}
      <div className="mb-4">
        <h3 className="font-bold">6-minuters gångtest (6MWT)</h3>
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
        <p>Predikterat: {six.predicted || '-'} m, Nedre gräns: {six.lower || '-'} m, Status: {six.status || '-'}</p>
        <p className="text-sm text-gray-600">Förmåga: {six.abilityPct || '-'}%, Nedsättning: {six.impairmentPct !== '' ? `${six.impairmentPct}%` : '-'} ({six.grade !== '' ? gradeLabel(six.grade) : '-'})</p>
      </div>
      {/* 2) Stair climb */}
      <div className="mb-4">
        <h3 className="font-bold">Trappgång (17 steg, 18,5 cm)</h3>
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
        <p>Hastighet: {stair.speed || '-'} m/s, Status: {stair.status || '-'}</p>
        <p className="text-sm text-gray-600">Förväntat intervall: {stair.predictedRange || '-'} m/s, Förmåga: {stair.abilityPct || '-'}%, Nedsättning: {stair.impairmentPct !== '' ? `${stair.impairmentPct}%` : '-'} ({stair.grade !== '' ? gradeLabel(stair.grade) : '-'})</p>
      </div>
      {/* 3) 2x20m */}
      <div className="mb-4">
        <h3 className="font-bold">2x20 m gångtest ({gender === 'male' ? '8 kg' : '4 kg'})</h3>
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
        <p>Hastighet: {walk.speed || '-'} m/s, Status: {walk.status || '-'}</p>
        <p className="text-sm text-gray-600">Förväntat intervall: {walk.predictedRange || '-'} m/s, Förmåga: {walk.abilityPct || '-'}%, Nedsättning: {walk.impairmentPct !== '' ? `${walk.impairmentPct}%` : '-'} ({walk.grade !== '' ? gradeLabel(walk.grade) : '-'})</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Handstyrka (Jamar)</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Dominant hand</label>
          <select
            value={tests.handStrength.dominant}
            onChange={(e) => handleChange(e, 'handStrength', 'dominant')}
            className="border p-2 w-full rounded"
          >
            <option value="Right">Höger</option>
            <option value="Left">Vänster</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Dominant hand (kg)</label>
          <input
            type="number"
            value={tests.handStrength.dominantKg}
            onChange={(e) => handleChange(e, 'handStrength', 'dominantKg')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Icke-dominant hand (kg)</label>
          <input
            type="number"
            value={tests.handStrength.nonDominantKg}
            onChange={(e) => handleChange(e, 'handStrength', 'nonDominantKg')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Förväntat intervall: Dom {hand.predictedRange.dominant || '-'} kg, Icke-dom {hand.predictedRange.nonDominant || '-'} kg</p>
        <p>Förmåga: Dom {hand.abilityPct.dominant || '-'}% ({hand.grade.dominant !== '' ? gradeLabel(hand.grade.dominant) : '-'}), Icke-dom {hand.abilityPct.nonDominant || '-'}% ({hand.grade.nonDominant !== '' ? gradeLabel(hand.grade.nonDominant) : '-'})</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Finmotorik (Nine-Hole Peg Test)</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Dominant hand (s)</label>
          <input
            type="number"
            value={tests.nineHolePeg.dominantTime}
            onChange={(e) => handleChange(e, 'nineHolePeg', 'dominantTime')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Icke-dominant hand (s)</label>
          <input
            type="number"
            value={tests.nineHolePeg.nonDominantTime}
            onChange={(e) => handleChange(e, 'nineHolePeg', 'nonDominantTime')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Förväntat intervall: Dom {nhpt.predictedRange.dominant || '-'} s, Icke-dom {nhpt.predictedRange.nonDominant || '-'} s</p>
        <p>Förmåga: Dom {nhpt.abilityPct.dominant || '-'}% ({nhpt.grade.dominant !== '' ? gradeLabel(nhpt.grade.dominant) : '-'}), Icke-dom {nhpt.abilityPct.nonDominant || '-'}% ({nhpt.grade.nonDominant !== '' ? gradeLabel(nhpt.grade.nonDominant) : '-'})</p>
      </div>
      {/* 6) Balans */}
      <div className="mb-4">
        <h3 className="font-bold">Balans (enbensstående)</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Öppna ögon (sekunder)</label>
          <input
            type="number"
            value={tests.oneLegBalance.open}
            onChange={(e) => handleChange(e, 'oneLegBalance', 'open')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Stängda ögon (sekunder)</label>
          <input
            type="number"
            value={tests.oneLegBalance.closed}
            onChange={(e) => handleChange(e, 'oneLegBalance', 'closed')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Öppna ögon: {balance.open.status || '-'} | Förväntat: {balance.open.predictedRange || '-'} s | Förmåga: {balance.open.abilityPct || '-'}% ({balance.open.grade !== '' ? gradeLabel(balance.open.grade) : '-'})</p>
        <p>Stängda ögon: {balance.closed.status || '-'} | Förväntat: {balance.closed.predictedRange || '-'} s | Förmåga: {balance.closed.abilityPct || '-'}% ({balance.closed.grade !== '' ? gradeLabel(balance.closed.grade) : '-'})</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">PILE lumbal</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Slutvikt (kg)</label>
          <input
            type="number"
            value={tests.pileLumbar.weight}
            onChange={(e) => handleChange(e, 'pileLumbar', 'weight')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Förväntat intervall: {pile.predictedRange.lumbar || '-'} kg</p>
        <p>Förmåga: {pile.abilityPct.lumbar || '-'}% ({pile.grade.lumbar !== '' ? gradeLabel(pile.grade.lumbar) : '-'})</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">PILE cervikal</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Slutvikt (kg)</label>
          <input
            type="number"
            value={tests.pileCervical.weight}
            onChange={(e) => handleChange(e, 'pileCervical', 'weight')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Förväntat intervall: {pile.predictedRange.cervical || '-'} kg</p>
        <p>Förmåga: {pile.abilityPct.cervical || '-'}% ({pile.grade.cervical !== '' ? gradeLabel(pile.grade.cervical) : '-'})</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Figur‑8 gångtest</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium">Normal takt tid (s)</label>
          <input
            type="number"
            value={tests.figureEight.normalTime}
            onChange={(e) => handleChange(e, 'figureEight', 'normalTime')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Normal takt övertramp</label>
          <input
            type="number"
            value={tests.figureEight.normalOversteps}
            onChange={(e) => handleChange(e, 'figureEight', 'normalOversteps')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Snabb takt tid (s)</label>
          <input
            type="number"
            value={tests.figureEight.fastTime}
            onChange={(e) => handleChange(e, 'figureEight', 'fastTime')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Snabb takt övertramp</label>
          <input
            type="number"
            value={tests.figureEight.fastOversteps}
            onChange={(e) => handleChange(e, 'figureEight', 'fastOversteps')}
            className="border p-2 w-full rounded"
            min="0"
          />
        </div>
        <p>Normal Pace: {fig8.normal.status || '-'} | Förväntat: {fig8.normal.predictedRange || '-'} s | Förmåga: {fig8.normal.abilityPct || '-'}% ({fig8.normal.grade !== '' ? gradeLabel(fig8.normal.grade) : '-'})</p>
        <p>Fast Pace: {fig8.fast.status || '-'} | Förväntat: {fig8.fast.predictedRange || '-'} s | Förmåga: {fig8.fast.abilityPct || '-'}% ({fig8.fast.grade !== '' ? gradeLabel(fig8.fast.grade) : '-'})</p>
      </div>
    </div>
  );
}

export default FunctionalTests;
