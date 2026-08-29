/**
 * Maps an OpenWeatherMap icon code (e.g. "10d") to an emoji glyph.
 * Keeping this emoji-based avoids shipping a large icon asset pack while still
 * giving each condition (and day/night variant) a distinct look.
 */
const ICON_MAP: Record<string, string> = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '⛅',
  '02n': '☁️',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌦️',
  '10n': '🌧️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};

export function weatherEmoji(icon: string): string {
  return ICON_MAP[icon] ?? '🌡️';
}

export function uvLevelKey(uv: number): string {
  if (uv <= 2) return 'uv.low';
  if (uv <= 5) return 'uv.moderate';
  if (uv <= 7) return 'uv.high';
  if (uv <= 10) return 'uv.veryHigh';
  return 'uv.extreme';
}

/** OpenWeatherMap Air Pollution API returns AQI on a 1-5 scale. */
export function aqiLevelKey(aqi: number): string {
  const map: Record<number, string> = {
    1: 'aqi.good',
    2: 'aqi.fair',
    3: 'aqi.moderate',
    4: 'aqi.poor',
    5: 'aqi.veryPoor',
  };
  return map[aqi] ?? 'aqi.moderate';
}

export function dewPoint(tempC: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
}
