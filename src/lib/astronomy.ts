
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

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    let jd = day + Math.floor((153 * m + 2) / 5) +
             365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) -
             32045.5; // .5 to start from midnight instead of noon

    jd += (hour / 24) + (minute / 1440) + (second / 86400);
    
    return jd;
}

/**
 * Calculates the Ecliptic Longitude of the Sun.
 * Uses a simplified algorithm from the US Naval Observatory, valid for ~200 years from J2000.
 * @param jd The Julian Day in UT.
 * @returns The Sun's ecliptic longitude in degrees.
 */
export function getSunLongitude(jd: number): number {
    const D = jd - 2451545.0; // Days from J2000.0

    // Mean anomaly of the Sun
    const g = normalizeAngle(357.529 + 0.98560028 * D);
    
    // Mean longitude of the Sun
    const q = normalizeAngle(280.459 + 0.98564736 * D);

    // Ecliptic longitude
    const lambda = q + 1.915 * Math.sin(degToRad(g)) + 0.020 * Math.sin(degToRad(2 * g));

    return normalizeAngle(lambda);
}

/**
 * Calculates the Ecliptic Longitude of the Moon.
 * Uses a simplified version of Meeus' formulas with the main perturbation terms.
 * Accuracy is sufficient to determine the zodiac sign.
 * @param jd The Julian Day in UT.
 * @returns The Moon's ecliptic longitude in degrees.
 */
export function getMoonLongitude(jd: number): number {
    const D = jd - 2451545.0; // Days from J2000.0

    // Moon's mean longitude
    const L = normalizeAngle(218.316 + 13.176396 * D);
    // Moon's mean anomaly
    const M = normalizeAngle(134.963 + 13.064993 * D);
    // Moon's argument of latitude
    const F = normalizeAngle(93.272 + 13.229350 * D);
    // Sun's mean anomaly
    const Ms = normalizeAngle(357.529 + 0.98560028 * D);
    // Moon's mean elongation
    const D_moon = normalizeAngle(297.850 + 12.190749 * D);


    let lambda = L;
    // Add major perturbations
    lambda += 6.289 * Math.sin(degToRad(M));
    lambda += 1.274 * Math.sin(degToRad(2 * D_moon - M));
    lambda += 0.658 * Math.sin(degToRad(2 * D_moon));
    lambda += 0.214 * Math.sin(degToRad(2 * M));
    lambda -= 0.186 * Math.sin(degToRad(Ms));
    lambda -= 0.114 * Math.sin(degToRad(2 * F));

    return normalizeAngle(lambda);
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
