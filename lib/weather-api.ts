const BASE_URL = 'https://api.weatherapi.com/v1';

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

if (!API_KEY) {
  console.warn(
    'Missing EXPO_PUBLIC_WEATHER_API_KEY. Please add your WeatherAPI key to the .env file.'
  );
}

export type WeatherCondition = {
  text: string;
  icon: string;
  code: number;
};

export type WeatherLocation = {
  name: string;
  region: string;
  country: string;
  localtime: string;
};

export type WeatherCurrent = {
  temp_c: number;
  feelslike_c: number;
  condition: WeatherCondition;
  humidity: number;
  wind_kph: number;
  pressure_mb: number;
};

export type WeatherForecastDay = {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    daily_chance_of_rain: number;
    avghumidity: number;
    condition: WeatherCondition;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
  };
  hour: Array<{
    time_epoch: number;
    time: string;
    temp_c: number;
    feelslike_c: number;
    condition: WeatherCondition;
    wind_kph: number;
    humidity: number;
    will_it_rain: number;
    chance_of_rain: number;
  }>;
};

export type WeatherForecastResponse = {
  location: WeatherLocation;
  current: WeatherCurrent;
  forecast: {
    forecastday: WeatherForecastDay[];
  };
};

export type SearchLocation = {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
};

async function request<T>(path: string, params: Record<string, string | number>): Promise<T> {
  if (!API_KEY) {
    throw new Error('Weather API key is not configured.');
  }

  const searchParams = new URLSearchParams({
    key: API_KEY,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)] as [string, string])
    ),
  });

  const response = await fetch(`${BASE_URL}${path}?${searchParams.toString()}`);
  const json = await response.json();

  if (!response.ok || json.error) {
    const message = json?.error?.message ?? 'Unable to fetch weather data';
    throw new Error(message);
  }

  return json as T;
}

export async function fetchForecast(
  query: string,
  days: number
): Promise<WeatherForecastResponse> {
  const clampedDays = Math.min(Math.max(days, 1), 14);

  return request<WeatherForecastResponse>('/forecast.json', {
    q: query,
    days: clampedDays,
    aqi: 'no',
    alerts: 'no',
  });
}

export async function searchLocations(query: string): Promise<SearchLocation[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  return request<SearchLocation[]>('/search.json', {
    q: query.trim(),
  });
}


