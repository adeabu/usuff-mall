// Shared calculation utilities for norms lookups, predictions, and WHO grading
import norms from '../norms.json';

// Helper: parse band keys like "21-25" into [21,25]
const parseBandKey = (key) => {
  const m = /^(\d+)-(\d+)$/.exec(key);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
};

// Generic age band resolver: finds the band within norms[category][gender]
export function resolveAgeBand(category, gender, age) {
  const g = norms[category]?.[gender];
  if (!g || age === undefined || age === null || age === '') return null;
  const ageNum = parseInt(age, 10);
  const keys = Object.keys(g).filter((k) => /\d+-\d+/.test(k));
  for (const key of keys) {
    const band = parseBandKey(key);
    if (!band) continue;
    const [from, to] = band;
    if (ageNum >= from && ageNum <= to) return key;
  }
  return null;
}

// WHO impairment grading based on percent impairment ranges from the provided guide.
// impairmentPct = 100 - abilityPct (0..100). Returns grade 0..4 and label.
export function gradeImpairment(abilityPct) {
  if (abilityPct === null || abilityPct === undefined || abilityPct === '') return { grade: '', impairmentPct: '' };
  const ap = Math.max(0, Math.min(abilityPct, 200)); // cap extreme values for safety
  const impairmentPct = Math.max(0, Math.min(100, 100 - Math.min(ap, 100)));
  let grade = '';
  if (impairmentPct <= 4) grade = 0; // 0–4%
  else if (impairmentPct <= 24) grade = 1; // 5–24%
  else if (impairmentPct <= 49) grade = 2; // 25–49%
  else if (impairmentPct <= 95) grade = 3; // 50–95%
  else grade = 4; // 96–100%
  return { grade, impairmentPct: Number(impairmentPct.toFixed(0)) };
}

// Map numeric grade -> Swedish label
export function gradeLabel(grade) {
  if (grade === '' || grade === null || grade === undefined) return '';
  switch (grade) {
    case 0: return 'Ingen nedsättning';
    case 1: return 'Lätt nedsättning';
    case 2: return 'Måttlig nedsättning';
    case 3: return 'Stor nedsättning';
    case 4: return 'Total nedsättning';
    default: return '';
  }
}

// Common helpers
const mean = (a, b) => (a + b) / 2;

// 2x20m: compute speed; expected is interval; ability vs lower bound
export function calc2x20m({ timeSec, gender }) {
  if (!timeSec || !gender) return { speed: '', status: '', predictedRange: '', abilityPct: '', grade: '', impairmentPct: '' };
  const speed = 40 / parseFloat(timeSec);
  const range = norms['2x20m_walk']?.[gender]?.range;
  let status = '';
  let abilityPct = '';
  if (range) {
    const [lo, hi] = range;
    status = speed < lo ? 'Sämre' : speed > hi ? 'Bättre' : 'Norm';
    abilityPct = Math.min(100, Number(((speed / lo) * 100).toFixed(0)));
  }
  const { grade, impairmentPct } = abilityPct === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(abilityPct);
  const predictedRange = range ? `${range[0]}–${range[1]}` : '';
  return { speed: speed.toFixed(2), status, predictedRange, abilityPct, grade, impairmentPct };
}

// 6MWT: predicted distance from formulas; ability = measured / predicted
export function calc6MWT({ gender, age, heightCm, weightKg, distanceM }) {
  if (!gender || !age || !heightCm || !weightKg) return { predicted: '', lower: '', status: '', abilityPct: '', grade: '', impairmentPct: '' };
  const ageN = parseInt(age, 10);
  const h = parseFloat(heightCm);
  const w = parseFloat(weightKg);
  const predicted = gender === 'male' ? (7.57 * h) - (5.02 * ageN) - (1.76 * w) - 309 : (2.11 * h) - (5.78 * ageN) - (2.29 * w) + 667;
  const lowerOffset = norms['6MWT']?.[gender]?.lower_offset || (gender === 'male' ? 153 : 139);
  const lower = predicted - lowerOffset;
  let status = '';
  if (distanceM) {
    const dist = parseFloat(distanceM);
    status = dist < lower ? 'Sämre' : dist > predicted ? 'Bättre' : 'Norm';
  }
  const abilityPct = distanceM ? Math.min(100, Number(((parseFloat(distanceM) / lower) * 100).toFixed(0))) : '';
  const { grade, impairmentPct } = abilityPct === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(abilityPct);
  return { predicted: Number(predicted.toFixed(0)), lower: Number(lower.toFixed(0)), status, abilityPct, grade, impairmentPct };
}

// Stair climb: speed; expected is interval; ability vs lower bound
export function calcStair({ timeSec, gender }) {
  if (!timeSec || !gender) return { speed: '', status: '', predictedRange: '', abilityPct: '', grade: '', impairmentPct: '' };
  const speed = (17 * 0.185 * 2) / parseFloat(timeSec);
  const range = norms['stair_climb']?.[gender]?.range;
  let status = '';
  let abilityPct = '';
  if (range) {
    const [lo, hi] = range;
    status = speed < lo ? 'Sämre' : speed > hi ? 'Bättre' : 'Norm';
    abilityPct = Math.min(100, Number(((speed / lo) * 100).toFixed(0)));
  }
  const { grade, impairmentPct } = abilityPct === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(abilityPct);
  const predictedRange = range ? `${range[0]}–${range[1]}` : '';
  return { speed: speed.toFixed(3), status, predictedRange, abilityPct, grade, impairmentPct };
}

// Hand strength: predicted is interval per hand; ability vs lower bound per hand
export function calcHandStrength({ gender, age, dominantHand, domKg, nonDomKg }) {
  const cat = 'hand_strength';
  const bandKey = resolveAgeBand(cat, gender, age);
  const band = bandKey ? norms[cat]?.[gender]?.[bandKey] : null;
  const domKey = (dominantHand || 'Right').toLowerCase();
  const nonKey = domKey === 'right' ? 'left' : 'right';

  const domRange = band ? band[domKey] : '';
  const nonRange = band ? band[nonKey] : '';

  const domAbility = domKg && domRange ? Math.min(100, Number(((parseFloat(domKg) / domRange[0]) * 100).toFixed(0))) : '';
  const nonAbility = nonDomKg && nonRange ? Math.min(100, Number(((parseFloat(nonDomKg) / nonRange[0]) * 100).toFixed(0))) : '';

  const domGrade = domAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(domAbility);
  const nonGrade = nonAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(nonAbility);

  return {
    bandKey: bandKey || '',
    predictedRange: {
      dominant: domRange ? `${domRange[0]}–${domRange[1]}` : '',
      nonDominant: nonRange ? `${nonRange[0]}–${nonRange[1]}` : '',
    },
    abilityPct: { dominant: domAbility, nonDominant: nonAbility },
    grade: { dominant: domGrade.grade, nonDominant: nonGrade.grade },
    impairmentPct: { dominant: domGrade.impairmentPct, nonDominant: nonGrade.impairmentPct },
  };
}

// Nine-Hole Peg Test: lower time is better. predicted = interval; ability vs lower bound (lo / measured)
export function calcNHPT({ gender, age, dominantHand, domTime, nonDomTime }) {
  const cat = 'nine_hole_peg';
  const bandKey = resolveAgeBand(cat, gender, age);
  const band = bandKey ? norms[cat]?.[gender]?.[bandKey] : null;
  const domKey = (dominantHand || 'Right').toLowerCase();
  const nonKey = domKey === 'right' ? 'left' : 'right';

  const domRange = band ? band[domKey] : '';
  const nonRange = band ? band[nonKey] : '';

  const domAbility = domTime && domRange ? Math.min(100, Number(((domRange[0] / parseFloat(domTime)) * 100).toFixed(0))) : '';
  const nonAbility = nonDomTime && nonRange ? Math.min(100, Number(((nonRange[0] / parseFloat(nonDomTime)) * 100).toFixed(0))) : '';

  const domGrade = domAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(domAbility);
  const nonGrade = nonAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(nonAbility);

  return {
    bandKey: bandKey || '',
    predictedRange: {
      dominant: domRange ? `${domRange[0]}–${domRange[1]}` : '',
      nonDominant: nonRange ? `${nonRange[0]}–${nonRange[1]}` : '',
    },
    abilityPct: { dominant: domAbility, nonDominant: nonAbility },
    grade: { dominant: domGrade.grade, nonDominant: nonGrade.grade },
    impairmentPct: { dominant: domGrade.impairmentPct, nonDominant: nonGrade.impairmentPct },
  };
}

// PILE: predicted = interval; ability vs lower bound (absolute kg)
export function calcPILE({ gender, lumbarKg, cervicalKg }) {
  const lumRange = norms['pile_lumbar']?.[gender]?.range;
  const cervRange = norms['pile_cervical']?.[gender]?.range;
  const lumAbility = lumbarKg && lumRange ? Math.min(100, Number(((parseFloat(lumbarKg) / lumRange[0]) * 100).toFixed(0))) : '';
  const cervAbility = cervicalKg && cervRange ? Math.min(100, Number(((parseFloat(cervicalKg) / cervRange[0]) * 100).toFixed(0))) : '';
  const lumGrade = lumAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(lumAbility);
  const cervGrade = cervAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(cervAbility);
  return {
    predictedRange: {
      lumbar: lumRange ? `${lumRange[0]}–${lumRange[1]}` : '',
      cervical: cervRange ? `${cervRange[0]}–${cervRange[1]}` : '',
    },
    abilityPct: { lumbar: lumAbility, cervical: cervAbility },
    grade: { lumbar: lumGrade.grade, cervical: cervGrade.grade },
    impairmentPct: { lumbar: lumGrade.impairmentPct, cervical: cervGrade.impairmentPct },
  };
}

// Figure-of-8 walk: lower time is better; predicted interval; ability vs lower bound (lo / measured)
export function calcFigure8({ gender, normalTime, normalOver, fastTime, fastOver }) {
  const n = norms['figure_eight_walk']?.[gender];
  if (!n) return { normal: {}, fast: {} };
  const normalAbility = normalTime ? Math.min(100, Number(((n.normal.time[0] / parseFloat(normalTime)) * 100).toFixed(0))) : '';
  const fastAbility = fastTime ? Math.min(100, Number(((n.fast.time[0] / parseFloat(fastTime)) * 100).toFixed(0))) : '';
  const normalGrade = normalAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(normalAbility);
  const fastGrade = fastAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(fastAbility);
  const normalStatus = normalTime ? ((parseFloat(normalTime) > n.normal.time[1] || (normalOver && parseFloat(normalOver) > n.normal.oversteps)) ? 'Sämre' : (parseFloat(normalTime) < n.normal.time[0] && (!normalOver || parseFloat(normalOver) <= n.normal.oversteps)) ? 'Bättre' : 'Norm') : '';
  const fastStatus = fastTime ? ((parseFloat(fastTime) > n.fast.time[1] || (fastOver && parseFloat(fastOver) > n.fast.oversteps)) ? 'Sämre' : (parseFloat(fastTime) < n.fast.time[0] && (!fastOver || parseFloat(fastOver) <= n.fast.oversteps)) ? 'Bättre' : 'Norm') : '';
  return {
    normal: { predictedRange: `${n.normal.time[0]}–${n.normal.time[1]}`, abilityPct: normalAbility, grade: normalGrade.grade, impairmentPct: normalGrade.impairmentPct, status: normalStatus },
    fast: { predictedRange: `${n.fast.time[0]}–${n.fast.time[1]}`, abilityPct: fastAbility, grade: fastGrade.grade, impairmentPct: fastGrade.impairmentPct, status: fastStatus },
  };
}

// One-leg balance: higher seconds is better; ability vs lower bound
export function calcBalance({ gender, openSec, closedSec }) {
  const n = norms['one_leg_balance']?.[gender];
  if (!n) return { open: {}, closed: {} };
  const openRange = n.open.range;
  const closedRange = n.closed.range;
  const openAbility = openSec ? Math.min(100, Number(((parseFloat(openSec) / openRange[0]) * 100).toFixed(0))) : '';
  const closedAbility = closedSec ? Math.min(100, Number(((parseFloat(closedSec) / closedRange[0]) * 100).toFixed(0))) : '';
  const openGrade = openAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(openAbility);
  const closedGrade = closedAbility === '' ? { grade: '', impairmentPct: '' } : gradeImpairment(closedAbility);
  const openStatus = openSec ? (parseFloat(openSec) < openRange[0] ? 'Sämre' : parseFloat(openSec) > openRange[1] ? 'Bättre' : 'Norm') : '';
  const closedStatus = closedSec ? (parseFloat(closedSec) < closedRange[0] ? 'Sämre' : parseFloat(closedSec) > closedRange[1] ? 'Bättre' : 'Norm') : '';
  return {
    open: { predictedRange: `${openRange[0]}–${openRange[1]}`, abilityPct: openAbility, grade: openGrade.grade, impairmentPct: openGrade.impairmentPct, status: openStatus },
    closed: { predictedRange: `${closedRange[0]}–${closedRange[1]}`, abilityPct: closedAbility, grade: closedGrade.grade, impairmentPct: closedGrade.impairmentPct, status: closedStatus },
  };
}
