import React, { useState } from 'react';
import norms from '../norms.json';

function Summary({ formData, gender, resetData }) {
  const [comments, setComments] = useState('');

  const { age, height, weight } = formData.measurements;
  const tests = formData.tests;
  const ageRange = age ? (parseInt(age) < 21 ? null : parseInt(age) <= 25 ? '21-25' : parseInt(age) <= 30 ? '26-30' : parseInt(age) <= 35 ? '31-35' : parseInt(age) <= 40 ? '36-40' : parseInt(age) <= 45 ? '41-45' : parseInt(age) <= 50 ? '46-50' : parseInt(age) <= 55 ? '51-55' : parseInt(age) <= 60 ? '56-60' : parseInt(age) <= 65 ? '61-65' : parseInt(age) <= 70 ? '66-70' : null) : null;

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

  const summary = `
Test Results (Gender: ${gender.charAt(0).toUpperCase() + gender.slice(1)})
2x20m Walk Test (${gender === 'male' ? '8 kg' : '4 kg'}):
  Time: ${tests.walk2x20m.time || '-'} s, Speed: ${walkSpeed || '-'} m/s (Status: ${walkStatus || '-'})
  Pulse: ${tests.walk2x20m.pulse || '-'} bpm, Borg Heart: ${tests.walk2x20m.borgHeart}/10
6-Minute Walk Test:
  Aid: ${tests.sixMwt.aid}, Distance: ${tests.sixMwt.distance || '-'} m (Status: ${sixMwtStatus || '-'}, Predicted: ${sixMwtPredicted || '-'} m, Lower: ${sixMwtLower || '-'} m)
  Pulse: ${tests.sixMwt.pulse || '-'} bpm, Borg Heart: ${tests.sixMwt.borgHeart}/10
Stair Climb (17 steps, 18.5 cm):
  Time: ${tests.stair.time || '-'} s, Speed: ${stairSpeed || '-'} m/s (Status: ${stairStatus || '-'})
  Pulse: ${tests.stair.pulse || '-'} bpm, Borg Heart: ${tests.stair.borgHeart}/10
Hand Strength (Jamar):
  Dominant (${tests.handStrength.dominant}): ${tests.handStrength.dominantKg || '-'} kg (Status: ${handDominantStatus || '-'})
  Non-Dominant: ${tests.handStrength.nonDominantKg || '-'} kg (Status: ${handNonDominantStatus || '-'})
Nine Hole Peg Test:
  Dominant: ${tests.nineHolePeg.dominantTime || '-'} s (Status: ${nhptDominantStatus || '-'})
  Non-Dominant: ${tests.nineHolePeg.nonDominantTime || '-'} s (Status: ${nhptNonDominantStatus || '-'})
PILE Lumbar:
  Weight: ${tests.pileLumbar.weight || '-'} kg (Status: ${pileLumbarStatus || '-'}), Adjusted: ${pileLumbarAdjusted || '-'} kg/kg (Status: ${pileLumbarAdjustedStatus || '-'}), Lifts: ${tests.pileLumbar.lifts || '-'}
PILE Cervical:
  Weight: ${tests.pileCervical.weight || '-'} kg (Status: ${pileCervicalStatus || '-'}), Adjusted: ${pileCervicalAdjusted || '-'} kg/kg (Status: ${pileCervicalAdjustedStatus || '-'}), Lifts: ${tests.pileCervical.lifts || '-'}
Figure-of-8 Walk Test:
  Normal Pace: ${tests.figureEight.normalTime || '-'} s, Oversteps: ${tests.figureEight.normalOversteps || '-'} (Status: ${figureEightNormalStatus || '-'})
  Fast Pace: ${tests.figureEight.fastTime || '-'} s, Oversteps: ${tests.figureEight.fastOversteps || '-'} (Status: ${figureEightFastStatus || '-'})
Comments: ${comments}
  `.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    alert('Summary copied to clipboard!');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Results Summary</h2>
      <textarea
        className="border p-2 w-full h-64 mb-2 rounded"
        value={summary}
        readOnly
      />
      <div className="mb-2">
        <label className="block text-sm font-medium">Comments</label>
        <textarea
          className="border p-2 w-full rounded"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add comments on test performance"
        />
      </div>
      <button className="bg-blue-500 text-white p-2 rounded mr-2" onClick={copyToClipboard}>
        Copy to Clipboard
      </button>
      <button className="bg-red-500 text-white p-2 rounded" onClick={resetData}>
        Delete Data
      </button>
    </div>
  );
}

export default Summary;