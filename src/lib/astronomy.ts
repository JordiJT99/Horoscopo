// astronomy.ts
import type { MoonPhaseKey } from '@/types';

// ───── helpers básicos ─────────────────────────────────────────────
const degToRad = (degrees: number): number => degrees * (Math.PI / 180);
const radToDeg = (radians: number): number => radians * (180 / Math.PI);
const normalizeAngle = (angle: number): number => (angle % 360 + 360) % 360;

// ───── Julian Day ——————————————————————————————
export function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // JS month 0-indexed
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // fracción del día
  jd += (hour - 12) / 24 + minute / 1440 + second / 86400;
  return jd;
}

// ───── Longitud eclíptica del Sol ——————————————
export function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525; // siglos julianos
  const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);

  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
    (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
    0.000289 * Math.sin(degToRad(3 * M));

  return normalizeAngle(L0 + C);
}

// ───── Longitud eclíptica de la Luna ————————————
export function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L_prime = normalizeAngle(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      (T * T * T) / 538841 -
      (T * T * T * T) / 65194000
  );
  const M_sun = normalizeAngle(
    357.5291092 +
      35999.0502909 * T -
      0.0001536 * T * T +
      (T * T * T) / 24490000
  );
  const M_prime = normalizeAngle(
    134.9633964 +
      477198.8675055 * T +
      0.0087414 * T * T +
      (T * T * T) / 69199 -
      (T * T * T * T) / 14712000
  );
  const D_moon = normalizeAngle(
    297.8501921 +
      445267.1114034 * T -
      0.0018819 * T * T +
      (T * T * T) / 545868 -
      (T * T * T * T) / 113065000
  );
  const F = normalizeAngle(
    93.272095 +
      483202.0175233 * T -
      0.0036539 * T * T -
      (T * T * T) / 3526000 +
      (T * T * T * T) / 863310000
  );

  let sum = 0;
  sum += -1.274 * Math.sin(degToRad(M_prime - 2 * D_moon));
  sum += 6.289 * Math.sin(degToRad(M_prime));
  sum += -0.658 * Math.sin(degToRad(2 * D_moon));
  sum += 0.214 * Math.sin(degToRad(2 * M_prime));
  sum += -0.186 * Math.sin(degToRad(M_sun));
  sum += -0.114 * Math.sin(degToRad(2 * F));
  sum += 0.059 * Math.sin(degToRad(2 * M_prime - 2 * D_moon));
  sum += 0.057 * Math.sin(degToRad(M_prime - 2 * D_moon + M_sun));
  sum += 0.053 * Math.sin(degToRad(M_prime + 2 * D_moon));
  sum += 0.046 * Math.sin(degToRad(2 * D_moon - M_sun));
  sum += 0.041 * Math.sin(degToRad(M_prime - M_sun));
  sum += -0.035 * Math.sin(degToRad(D_moon));
  sum += -0.031 * Math.sin(degToRad(M_prime + M_sun));
  sum += -0.015 * Math.sin(degToRad(2 * F - 2 * D_moon));
  sum += 0.011 * Math.sin(degToRad(M_prime + 2 * F));

  return normalizeAngle(L_prime + sum);
}

// ───── Ascendente ————————————————————————————————
export function getAscendantLongitude(
  jd: number,
  lat: number,
  lon: number
): number {
  const T = (jd - 2451545.0) / 36525;
  let GMST0 =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  GMST0 = normalizeAngle(GMST0);

  const LST = normalizeAngle(GMST0 + lon);
  const epsilon = degToRad(23.4392911);
  const lstRad = degToRad(LST);
  const latRad = degToRad(lat);

  const Y = -Math.cos(lstRad);
  const X =
    Math.sin(lstRad) * Math.cos(epsilon) + Math.tan(latRad) * Math.sin(epsilon);
  const ascendantRad = Math.atan2(Y, X);

  return normalizeAngle(radToDeg(ascendantRad));
}

// ───── Meeus: instante de cada fase ——————————————————
function getJulianDayOfPhase(k: number, phase: number): number {
  const T = k / 1236.85;
  const T2 = T * T;

  let jde =
    2451550.09766 +
    29.530588861 * k +
    0.00015437 * T2 -
    0.00000015 * T * T2 +
    0.00000000073 * T2 * T2;

  jde += phase * 0.25 * 29.530588861;

  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;

  const M = degToRad(normalizeAngle(2.5534 + 29.1053567 * k));
  const M_prime = degToRad(normalizeAngle(201.5643 + 385.81693528 * k));
  const F = degToRad(normalizeAngle(160.7108 + 390.67050284 * k));

  let corr = 0;
  if (phase === 0 || phase === 2) {
    corr =
      -0.4072 * Math.sin(M_prime) +
      0.17241 * E * Math.sin(M) +
      0.01608 * Math.sin(2 * M_prime) +
      0.01039 * Math.sin(2 * F) +
      0.00739 * E * Math.sin(M_prime - M) -
      0.00514 * E * Math.sin(M_prime + M) +
      0.00208 * E2 * Math.sin(2 * M);
  } else {
    corr =
      -0.62801 * Math.sin(M_prime) +
      0.17302 * E * Math.sin(M) +
      0.01179 * Math.sin(2 * M_prime) +
      0.01043 * Math.sin(2 * F) -
      0.00739 * E * Math.sin(M_prime - M) +
      0.00514 * E * Math.sin(M_prime + M) +
      0.00337 * E2 * Math.sin(2 * M);

    corr += phase === 1 ? 0.00325 : -0.00325;
  }

  return jde + corr;
}

// ───── Fases principales de un mes ——————————————
export function computeLunarPhasesForMonth(
  year: number,
  month: number
): { date: Date; phaseKey: MoonPhaseKey }[] {
  const phases: { date: Date; phaseKey: MoonPhaseKey }[] = [];
  const jsMonth = (month % 12 + 12) % 12;
  const jsYear = year + Math.floor(month / 12);

  const k_base = Math.floor((jsYear - 2000) * 12.3685);

  for (let i = -2; i <= 2; i++) {
    const k = k_base + i;
    for (let phase = 0; phase < 4; phase++) {
      const jde = getJulianDayOfPhase(k, phase);
      const dateUtc = new Date((jde - 2440587.5) * 86400000);

      let phaseKey: MoonPhaseKey = 'unknown';
      if (phase === 0) phaseKey = 'new';
      else if (phase === 1) phaseKey = 'firstQuarter';
      else if (phase === 2) phaseKey = 'full';
      else if (phase === 3) phaseKey = 'lastQuarter';

      phases.push({ date: dateUtc, phaseKey });
    }
  }
  return phases;
}