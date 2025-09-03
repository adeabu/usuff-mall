import React, { useState } from 'react';
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

  const fmt = (n, maxFrac = 2) => {
    if (n === '' || n === undefined || n === null) return '-';
    const num = Number(n);
    if (Number.isNaN(num)) return '-';
    return num.toLocaleString('sv-SE', { maximumFractionDigits: maxFrac });
  };
  const fmtRange = (r) => {
    if (!r || typeof r !== 'string' || !r.includes('–')) return r || '-';
    const [a, b] = r.split('–');
    return `${fmt(a)}–${fmt(b)}`;
  };
  const statusChip = (status) => {
    if (!status) return '-';
    const map = { 'Sämre': 'chip chip-red', 'Norm': 'chip chip-green', 'Bättre': 'chip chip-blue' };
    const cls = map[status] || 'chip';
    return <span className={cls}>{status}</span>;
  };
  const gradeChip = (label) => {
    if (!label || label === '-') return '-';
    const map = {
      'Ingen nedsättning': 'chip chip-green',
      'Lätt nedsättning': 'chip chip-yellow',
      'Måttlig nedsättning': 'chip chip-orange',
      'Stor nedsättning': 'chip chip-red',
      'Total nedsättning': 'chip chip-red-dark',
    };
    const cls = map[label] || 'chip';
    return <span className={cls}>{label}</span>;
  };
  const statusAccent = (status) => {
    if (!status) return 'accent';
    if (status === 'Sämre') return 'accent-red';
    if (status === 'Bättre') return 'accent-blue';
    return 'accent-green';
  };
  const gradeAccent = (label) => {
    switch (label) {
      case 'Ingen nedsättning': return 'accent-green';
      case 'Lätt nedsättning': return 'accent-yellow';
      case 'Måttlig nedsättning': return 'accent-orange';
      case 'Stor nedsättning': return 'accent-red';
      case 'Total nedsättning': return 'accent-red-dark';
      default: return 'accent';
    }
  };
  const handleChange = (e, section, field) => {
    const raw = e.target.value;
    const sanitized = typeof raw === 'string' ? raw.replace(',', '.') : raw;
    setFormData({
      ...formData,
      tests: {
        ...formData.tests,
        [section]: { ...formData.tests[section], [field]: sanitized },
      },
    });
  };

  const handleMeasurementChange = (e) => {
    const raw = e.target.value;
    const sanitized = typeof raw === 'string' ? raw.replace(',', '.') : raw;
    setFormData({
      ...formData,
      measurements: { ...formData.measurements, [e.target.name]: sanitized },
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
  const req = (v) => v !== '' && v !== undefined && v !== null;
  const hasSix = req(formData.measurements.age) && req(formData.measurements.height) && req(formData.measurements.weight) && req(tests.sixMwt.distance);
  const hasStair = req(tests.stair.time);
  const hasWalk = req(tests.walk2x20m.time);
  const hasHand = req(tests.handStrength.dominant) && (req(tests.handStrength.dominantKg) || req(tests.handStrength.nonDominantKg));
  const hasNhpt = req(tests.nineHolePeg.dominantTime) || req(tests.nineHolePeg.nonDominantTime);
  const hasBalance = req(tests.oneLegBalance.open) || req(tests.oneLegBalance.closed);
  const hasPileLumbar = req(tests.pileLumbar.weight);
  const hasPileCervical = req(tests.pileCervical.weight);
  const hasFig8 = req(tests.figureEight.normalTime) || req(tests.figureEight.fastTime);

  return (
    <div>
      <h2 className="title" style={{marginBottom: 12}}>Funktionella tester</h2>
      <div className="card shadow" style={{marginBottom: 16}}>
        <h3 className="title">Ålder, längd och vikt</h3>
        <div className="grid-3">
          <div className="field" style={{marginBottom: 0}}>
            <label>Ålder</label>
            <div className="input-with-unit">
              <input type="number" name="age" value={formData.measurements.age} onChange={handleMeasurementChange} className="input" min="0" step="1" />
              <span className="unit">år</span>
            </div>
          </div>
          <div className="field" style={{marginBottom: 0}}>
            <label>Längd</label>
            <div className="input-with-unit">
              <input type="number" name="height" value={formData.measurements.height} onChange={handleMeasurementChange} className="input" min="0" step="0.1" />
              <span className="unit">cm</span>
            </div>
          </div>
          <div className="field" style={{marginBottom: 0}}>
            <label>Vikt</label>
            <div className="input-with-unit">
              <input type="number" name="weight" value={formData.measurements.weight} onChange={handleMeasurementChange} className="input" min="0" step="0.1" />
              <span className="unit">kg</span>
            </div>
          </div>
        </div>
      </div>
      {/* Start rutnät för testkort */}
      <div className="grid-2">
      {/* 1) 6MWT */}
      <div className={`card shadow span-2 ${six.status ? statusAccent(six.status) : 'accent'}`}>
        <h3 className="title">6-minuters gångtest</h3>
        <div className="card-grid-2">
          <div className="col left">
            <div className="field" style={{marginBottom: 0}}>
              <label>Distans</label>
              <div className="input-with-unit">
                <input type="number" value={tests.sixMwt.distance} onChange={(e) => handleChange(e, 'sixMwt', 'distance')} className="input" min="0" step="1" />
                <span className="unit">m</span>
              </div>
            </div>
          </div>
          <div className="col right">
            {hasSix && (
              <div className="out-list">
                <div className="kv"><span className="k">Status</span><span className="v">{statusChip(six.status)}</span></div>
                <div className="kv"><span className="k">Förväntat</span><span className="v">{fmt(six.predicted, 0)} m</span></div>
                <div className="kv"><span className="k">Nedre gräns</span><span className="v">{fmt(six.lower, 0)} m</span></div>
                <div className="kv"><span className="k">Förmåga</span><span className="v">{fmt(six.abilityPct, 0)}%</span></div>
                <div className="kv"><span className="k">Nedsättning</span><span className="v">{fmt(six.impairmentPct, 0)}% {gradeChip(gradeLabel(six.grade) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 2) Stair climb */}
      <div className={`card shadow span-2 ${stair.status ? statusAccent(stair.status) : 'accent'}`}>
        <h3 className="title">Trappgång (17 steg, 18,5 cm)</h3>
        <div className="card-grid-2">
          <div className="col left">
            <div className="field" style={{marginBottom: 0}}>
              <label>Tid</label>
              <div className="input-with-unit">
                <input type="number" value={tests.stair.time} onChange={(e) => handleChange(e, 'stair', 'time')} className="input" min="0" step="0.01" />
                <span className="unit">s</span>
              </div>
            </div>
          </div>
          <div className="col right">
            {hasStair && (
              <div className="out-list">
                <div className="kv"><span className="k">Status</span><span className="v">{statusChip(stair.status)}</span></div>
                <div className="kv"><span className="k">Hastighet</span><span className="v">{fmt(stair.speed, 3)} m/s</span></div>
                <div className="kv"><span className="k">Förväntat</span><span className="v">{fmtRange(stair.predictedRange)} m/s</span></div>
                <div className="kv"><span className="k">Förmåga</span><span className="v">{fmt(stair.abilityPct, 0)}%</span></div>
                <div className="kv"><span className="k">Nedsättning</span><span className="v">{fmt(stair.impairmentPct, 0)}% {gradeChip(gradeLabel(stair.grade) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 3) 2x20m */}
      <div className={`card shadow span-2 ${walk.status ? statusAccent(walk.status) : 'accent'}`}>
        <h3 className="title">2x20 m gångtest ({gender === 'male' ? '8 kg' : '4 kg'})</h3>
        <div className="card-grid-2">
          <div className="col left">
            <div className="field" style={{marginBottom: 0}}>
              <label>Tid</label>
              <div className="input-with-unit">
                <input type="number" value={tests.walk2x20m.time} onChange={(e) => handleChange(e, 'walk2x20m', 'time')} className="input" min="0" step="0.01" />
                <span className="unit">s</span>
              </div>
            </div>
          </div>
          <div className="col right">
            {hasWalk && (
              <div className="out-list">
                <div className="kv"><span className="k">Status</span><span className="v">{statusChip(walk.status)}</span></div>
                <div className="kv"><span className="k">Hastighet</span><span className="v">{fmt(walk.speed, 2)} m/s</span></div>
                <div className="kv"><span className="k">Förväntat</span><span className="v">{fmtRange(walk.predictedRange)} m/s</span></div>
                <div className="kv"><span className="k">Förmåga</span><span className="v">{fmt(walk.abilityPct, 0)}%</span></div>
                <div className="kv"><span className="k">Nedsättning</span><span className="v">{fmt(walk.impairmentPct, 0)}% {gradeChip(gradeLabel(walk.grade) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`card shadow span-2 ${gradeLabel(hand.grade.dominant) ? gradeAccent(gradeLabel(hand.grade.dominant)) : 'accent'}`}>
        <h3 className="title">Handstyrka (Jamar)</h3>
        <div className="card-grid-2">
          <div className="col left">
          <label className="block text-sm font-medium">Dominant hand</label>
          <div className="flex items-center gap-4" style={{margin: '6px 0 12px'}}>
            <label className="inline-flex items-center gap-1">
              <input type="radio" name="dominantHand" checked={tests.handStrength.dominant === 'Right'} onChange={() => handleChange({ target: { value: 'Right' } }, 'handStrength', 'dominant')} />
              <span>Höger</span>
            </label>
            <label className="inline-flex items-center gap-1">
              <input type="radio" name="dominantHand" checked={tests.handStrength.dominant === 'Left'} onChange={() => handleChange({ target: { value: 'Left' } }, 'handStrength', 'dominant')} />
              <span>Vänster</span>
            </label>
          </div>
          <div className="field" style={{marginBottom: 8}}>
            <label>Dominant hand</label>
            <div className="input-with-unit">
              <input type="number" value={tests.handStrength.dominantKg} onChange={(e) => handleChange(e, 'handStrength', 'dominantKg')} className="input" min="0" step="0.1" />
              <span className="unit">kg</span>
            </div>
          </div>
          <div className="field" style={{marginBottom: 0}}>
            <label>Icke-dominant hand</label>
            <div className="input-with-unit">
              <input type="number" value={tests.handStrength.nonDominantKg} onChange={(e) => handleChange(e, 'handStrength', 'nonDominantKg')} className="input" min="0" step="0.1" />
              <span className="unit">kg</span>
            </div>
          </div>
          </div>
          <div className="col right">
            {hasHand && (
              <div className="out-list">
                <div className="kv"><span className="k">Förv. intervall (dom)</span><span className="v">{fmtRange(hand.predictedRange.dominant)} kg</span></div>
                <div className="kv"><span className="k">Förv. intervall (icke)</span><span className="v">{fmtRange(hand.predictedRange.nonDominant)} kg</span></div>
                <div className="kv"><span className="k">Förmåga (dom)</span><span className="v">{fmt(hand.abilityPct.dominant, 0)}% {gradeChip(gradeLabel(hand.grade.dominant) || '-')}</span></div>
                <div className="kv"><span className="k">Förmåga (icke)</span><span className="v">{fmt(hand.abilityPct.nonDominant, 0)}% {gradeChip(gradeLabel(hand.grade.nonDominant) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`card shadow span-2 ${gradeLabel(nhpt.grade.dominant) ? gradeAccent(gradeLabel(nhpt.grade.dominant)) : 'accent'}`}>
        <h3 className="title">Finmotorik (Nine-Hole Peg Test)</h3>
        <div className="card-grid-2">
          <div className="col left">
            <div className="field" style={{marginBottom: 8}}>
              <label>Dominant hand (s)</label>
              <input type="number" value={tests.nineHolePeg.dominantTime} onChange={(e) => handleChange(e, 'nineHolePeg', 'dominantTime')} className="input" min="0" step="0.01" />
            </div>
            <div className="field" style={{marginBottom: 0}}>
              <label>Icke-dominant hand (s)</label>
              <input type="number" value={tests.nineHolePeg.nonDominantTime} onChange={(e) => handleChange(e, 'nineHolePeg', 'nonDominantTime')} className="input" min="0" step="0.01" />
            </div>
          </div>
          <div className="col right">
            {hasNhpt && (
              <div className="out-list">
                <div className="kv"><span className="k">Förv. intervall (dom)</span><span className="v">{fmtRange(nhpt.predictedRange.dominant)} s</span></div>
                <div className="kv"><span className="k">Förv. intervall (icke)</span><span className="v">{fmtRange(nhpt.predictedRange.nonDominant)} s</span></div>
                <div className="kv"><span className="k">Förmåga (dom)</span><span className="v">{fmt(nhpt.abilityPct.dominant, 0)}% {gradeChip(gradeLabel(nhpt.grade.dominant) || '-')}</span></div>
                <div className="kv"><span className="k">Förmåga (icke)</span><span className="v">{fmt(nhpt.abilityPct.nonDominant, 0)}% {gradeChip(gradeLabel(nhpt.grade.nonDominant) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 6) Balans */}
        <div className={`card shadow span-2 ${(balance.open.status || balance.closed.status) ? statusAccent(balance.open.status || balance.closed.status) : 'accent'}`}>
        <h3 className="title">Balans (enbensstående)</h3>
        <div className="card-grid-2">
          <div className="col left">
            <div className="field" style={{marginBottom: 8}}>
              <label>Öppna ögon (s)</label>
              <input type="number" value={tests.oneLegBalance.open} onChange={(e) => handleChange(e, 'oneLegBalance', 'open')} className="input" min="0" step="1" />
            </div>
            <div className="field" style={{marginBottom: 0}}>
              <label>Stängda ögon (s)</label>
              <input type="number" value={tests.oneLegBalance.closed} onChange={(e) => handleChange(e, 'oneLegBalance', 'closed')} className="input" min="0" step="1" />
            </div>
          </div>
          <div className="col right">
            {hasBalance && (
              <div className="out-list">
                <div className="kv"><span className="k">Status (öppna)</span><span className="v">{statusChip(balance.open.status)}</span></div>
                <div className="kv"><span className="k">Förväntat (öppna)</span><span className="v">{fmtRange(balance.open.predictedRange)} s</span></div>
                <div className="kv"><span className="k">Förmåga (öppna)</span><span className="v">{fmt(balance.open.abilityPct, 0)}% {gradeChip(gradeLabel(balance.open.grade) || '-')}</span></div>
                <div className="kv"><span className="k">Status (stängda)</span><span className="v">{statusChip(balance.closed.status)}</span></div>
                <div className="kv"><span className="k">Förväntat (stängda)</span><span className="v">{fmtRange(balance.closed.predictedRange)} s</span></div>
                <div className="kv"><span className="k">Förmåga (stängda)</span><span className="v">{fmt(balance.closed.abilityPct, 0)}% {gradeChip(gradeLabel(balance.closed.grade) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`card shadow span-2 ${gradeLabel(pile.grade.lumbar) ? gradeAccent(gradeLabel(pile.grade.lumbar)) : 'accent'}`}>
        <h3 className="title">PILE lumbal</h3>
        <div className="card-grid-2">
          <div className="col left">
            <div className="field" style={{marginBottom: 0}}>
              <label>Slutvikt</label>
              <div className="input-with-unit">
                <input type="number" value={tests.pileLumbar.weight} onChange={(e) => handleChange(e, 'pileLumbar', 'weight')} className="input" min="0" step="0.1" />
                <span className="unit">kg</span>
              </div>
            </div>
          </div>
          <div className="col right">
            {hasPileLumbar && (
              <div className="out-list">
                <div className="kv"><span className="k">Förväntat</span><span className="v">{fmtRange(pile.predictedRange.lumbar)} kg</span></div>
                <div className="kv"><span className="k">Förmåga</span><span className="v">{fmt(pile.abilityPct.lumbar, 0)}% {gradeChip(gradeLabel(pile.grade.lumbar) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`card shadow span-2 ${gradeLabel(pile.grade.cervical) ? gradeAccent(gradeLabel(pile.grade.cervical)) : 'accent'}`}>
        <h3 className="title">PILE cervikal</h3>
        <div className="card-grid-2">
          <div className="col left">
            <div className="field" style={{marginBottom: 0}}>
              <label>Slutvikt</label>
              <div className="input-with-unit">
                <input type="number" value={tests.pileCervical.weight} onChange={(e) => handleChange(e, 'pileCervical', 'weight')} className="input" min="0" step="0.1" />
                <span className="unit">kg</span>
              </div>
            </div>
          </div>
          <div className="col right">
            {hasPileCervical && (
              <div className="out-list">
                <div className="kv"><span className="k">Förväntat</span><span className="v">{fmtRange(pile.predictedRange.cervical)} kg</span></div>
                <div className="kv"><span className="k">Förmåga</span><span className="v">{fmt(pile.abilityPct.cervical, 0)}% {gradeChip(gradeLabel(pile.grade.cervical) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`card shadow span-2 ${(fig8.normal.status || fig8.fast.status) ? statusAccent(fig8.normal.status || fig8.fast.status) : 'accent'}`}>
        <h3 className="title">Figur‑8 gångtest</h3>
        <div className="card-grid-2">
          <div className="col left">
            <div className="field" style={{marginBottom: 8}}>
              <label>Normal takt tid (s)</label>
              <input type="number" value={tests.figureEight.normalTime} onChange={(e) => handleChange(e, 'figureEight', 'normalTime')} className="input" min="0" step="0.01" />
            </div>
            <div className="field" style={{marginBottom: 8}}>
              <label>Normal takt övertramp</label>
              <input type="number" value={tests.figureEight.normalOversteps} onChange={(e) => handleChange(e, 'figureEight', 'normalOversteps')} className="input" min="0" step="1" />
            </div>
            <div className="field" style={{marginBottom: 8}}>
              <label>Snabb takt tid (s)</label>
              <input type="number" value={tests.figureEight.fastTime} onChange={(e) => handleChange(e, 'figureEight', 'fastTime')} className="input" min="0" step="0.01" />
            </div>
            <div className="field" style={{marginBottom: 0}}>
              <label>Snabb takt övertramp</label>
              <input type="number" value={tests.figureEight.fastOversteps} onChange={(e) => handleChange(e, 'figureEight', 'fastOversteps')} className="input" min="0" step="1" />
            </div>
          </div>
          <div className="col right">
            {hasFig8 && (
              <div className="out-list">
                <div className="kv"><span className="k">Status (normal)</span><span className="v">{statusChip(fig8.normal.status)}</span></div>
                <div className="kv"><span className="k">Förväntat (normal)</span><span className="v">{fmtRange(fig8.normal.predictedRange)} s</span></div>
                <div className="kv"><span className="k">Förmåga (normal)</span><span className="v">{fmt(fig8.normal.abilityPct, 0)}% {gradeChip(gradeLabel(fig8.normal.grade) || '-')}</span></div>
                <div className="kv"><span className="k">Status (snabb)</span><span className="v">{statusChip(fig8.fast.status)}</span></div>
                <div className="kv"><span className="k">Förväntat (snabb)</span><span className="v">{fmtRange(fig8.fast.predictedRange)} s</span></div>
                <div className="kv"><span className="k">Förmåga (snabb)</span><span className="v">{fmt(fig8.fast.abilityPct, 0)}% {gradeChip(gradeLabel(fig8.fast.grade) || '-')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Slut rutnät */}
    </div>
    </div>
  );
}

export default FunctionalTests;
