// astronomy.ts

import type { Dictionary, Locale, MoonPhaseKey, UpcomingPhase } from '@/types';

// Helper functions for degree/radian conversion
const degToRad = (degrees: number): number => degrees * (Math.PI / 180);
const radToDeg = (radians: number): number => radians * (180 / Math.PI);
const normalizeAngle = (angle: number): number => (angle % 360 + 360) % 360;

/**
 * Calculates the Julian Day for a given Date object.
 * The calculation is based on the UTC components of the date.
 * @param date The JavaScript Date object.
 * @returns The Julian Day number.
 */
export function getJulianDay(date: Date): number {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // JS month is 0-indexed
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();

    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;

    let jd = day + Math.floor((153 * m + 2) / 5) +
             365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) -
             32045;
    
    // Add fractional day
    jd += (hour - 12) / 24 + minute / 1440 + second / 86400;
    
    return jd;
}


/**
 * Calculates the Ecliptic Longitude of the Sun using a more accurate algorithm.
 * Based on Jean Meeus' "Astronomical Algorithms".
 * @param jd The Julian Day in UT.
 * @returns The Sun's ecliptic longitude in degrees.
 */
export function getSunLongitude(jd: number): number {
    const T = (jd - 2451545.0) / 36525; // Julian centuries

    // Mean longitude of the Sun
    const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    
    // Mean anomaly of the Sun
    const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);

    // Equation of the center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M))
            + (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M))
            + 0.000289 * Math.sin(degToRad(3 * M));
    
    // True longitude
    const lambda = L0 + C;

    return normalizeAngle(lambda);
}


/**
 * Calculates the Ecliptic Longitude of the Moon with improved accuracy.
 * Uses a more complete version of Meeus' formulas with major perturbation terms.
 * @param jd The Julian Day in UT.
 * @returns The Moon's ecliptic longitude in degrees.
 */
export function getMoonLongitude(jd: number): number {
    const T = (jd - 2451545.0) / 36525;      // Julian centuries since J2000.0

    // Moon's mean longitude (L')
    const L_prime = normalizeAngle(218.3164477 + 481267.88123421 * T - 0.0015786 * T*T + T*T*T / 538841 - T*T*T*T / 65194000);

    // Sun's mean anomaly (M_sun)
    const M_sun = normalizeAngle(357.5291092 + 35999.0502909 * T - 0.0001536 * T*T + T*T*T / 24490000);

    // Moon's mean anomaly (M')
    const M_prime = normalizeAngle(134.9633964 + 477198.8675055 * T + 0.0087414 * T*T + T*T*T / 69199 - T*T*T*T / 14712000);

    // Moon's mean elongation from the Sun (D_moon)
    const D_moon = normalizeAngle(297.8501921 + 445267.1114034 * T - 0.0018819 * T*T + T*T*T / 545868 - T*T*T*T / 113065000);

    // Moon's argument of latitude (F)
    const F = normalizeAngle(93.2720950 + 483202.0175233 * T - 0.0036539 * T*T - T*T*T / 3526000 + T*T*T*T / 863310000);

    // Sum of major perturbations (in degrees)
    let sum = 0;
    sum += -1.274 * Math.sin(degToRad(M_prime - 2 * D_moon));
    sum += +6.289 * Math.sin(degToRad(M_prime));
    sum += -0.658 * Math.sin(degToRad(2 * D_moon));
    sum += +0.214 * Math.sin(degToRad(2 * M_prime));
    sum += -0.186 * Math.sin(degToRad(M_sun));
    sum += -0.114 * Math.sin(degToRad(2 * F));
    sum += +0.059 * Math.sin(degToRad(2 * M_prime - 2 * D_moon));
    sum += +0.057 * Math.sin(degToRad(M_prime - 2 * D_moon + M_sun));
    sum += +0.053 * Math.sin(degToRad(M_prime + 2 * D_moon));
    sum += +0.046 * Math.sin(degToRad(2 * D_moon - M_sun));
    sum += +0.041 * Math.sin(degToRad(M_prime - M_sun));
    sum += -0.035 * Math.sin(degToRad(D_moon));
    sum += -0.031 * Math.sin(degToRad(M_prime + M_sun));
    sum += -0.015 * Math.sin(degToRad(2 * F - 2 * D_moon));
    sum += +0.011 * Math.sin(degToRad(M_prime + 2 * F));

    // True ecliptic longitude of the Moon
    const lambda_moon = L_prime + sum;

    return normalizeAngle(lambda_moon);
}

/**
 * Calculates the Ecliptic Longitude of the Ascendant.
 * @param jd The Julian Day in UT.
 * @param lat The latitude of the birth location in degrees.
 * @param lon The longitude of the birth location in degrees.
 * @returns The Ascendant's ecliptic longitude in degrees.
 */
export function getAscendantLongitude(jd: number, lat: number, lon: number): number {
    // 1. Sidereal Time Calculation
    const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000
    
    // Greenwich Mean Sidereal Time at 0h UT
    let GMST0 = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000;
    GMST0 = normalizeAngle(GMST0);

    // Local Sidereal Time
    const LST = normalizeAngle(GMST0 + lon);
    
    // 2. Ascendant Calculation
    const epsilon = degToRad(23.4392911); // Obliquity of the ecliptic
    const lstRad = degToRad(LST);
    const latRad = degToRad(lat);

    const Y = -Math.cos(lstRad);
    const X = Math.sin(lstRad) * Math.cos(epsilon) + Math.tan(latRad) * Math.sin(epsilon);
    
    let ascendantRad = Math.atan2(Y, X);
    
    return normalizeAngle(radToDeg(ascendantRad));
}

/**
 * Computes the Julian Day for a specific lunar phase using Meeus' algorithm.
 * @param k The lunation number.
 * @param phase The phase to calculate (0=New, 1=FirstQ, 2=Full, 3=LastQ).
 * @returns The Julian Day of the specified phase.
 */
function getJulianDayOfPhase(k: number, phase: number): number {
    const T = k / 1236.85;
    const T2 = T * T;

    // Mean time of the new moon for lunation k
    let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.000000150 * T * T2 + 0.00000000073 * T2 * T2;

    // Apply phase offset (0 for New, 0.25 for FQ, 0.5 for Full, 0.75 for LQ)
    jde += phase * 0.25 * 29.530588861;

    // Eccentricity of Earth's orbit
    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    const E2 = E * E;

    // Sun's mean anomaly
    const M = degToRad(normalizeAngle(2.5534 + 29.10535670 * k));
    
    // Moon's mean anomaly
    const M_prime = degToRad(normalizeAngle(201.5643 + 385.81693528 * k));
    
    // Moon's argument of latitude
    const F = degToRad(normalizeAngle(160.7108 + 390.67050284 * k));

    let corrections = 0;
    if (phase === 0 || phase === 2) { // New and Full Moon corrections
        corrections = 
            -0.40720 * Math.sin(M_prime) +
             0.17241 * E * Math.sin(M) +
             0.01608 * Math.sin(2 * M_prime) +
             0.01039 * Math.sin(2 * F) +
             0.00739 * E * Math.sin(M_prime - M) -
             0.00514 * E * Math.sin(M_prime + M) +
             0.00208 * E2 * Math.sin(2 * M);
    } else { // First and Last Quarter corrections
        corrections =
            -0.62801 * Math.sin(M_prime) +
             0.17302 * E * Math.sin(M) +
             0.01179 * Math.sin(2 * M_prime) +
             0.01043 * Math.sin(2 * F) -
             0.00739 * E * Math.sin(M_prime - M) +
             0.00514 * E * Math.sin(M_prime + M) +
             0.00337 * E2 * Math.sin(2 * M);

        // Additional correction term for quarters
        const phaseCorrection = (phase === 1) ? 0.00325 : -0.00325;
        corrections += phaseCorrection;
    }
    
    return jde + corrections;
}

/**
 * Calculates the primary moon phases for a given month and year.
 * This function no longer filters by month, allowing the caller to get a continuous stream.
 * @param year The target year.
 * @param month The target month (0-indexed, e.g., 0 for January).
 * @returns An array of objects containing the date and phase key for each primary phase.
 */
export function computeLunarPhasesForMonth(year: number, month: number): { date: Date, phaseKey: MoonPhaseKey }[] {
    const phases: { date: Date, phaseKey: MoonPhaseKey }[] = [];
    const jsMonth = (month % 12 + 12) % 12;
    const jsYear = year + Math.floor(month / 12);

    // Calculate lunation number 'k' for the start of the month
    const k_base = Math.floor((jsYear - 2000) * 12.3685);

    // Check a wider range of lunations to ensure we catch all phases around the target month
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
