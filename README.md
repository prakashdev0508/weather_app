## Weather App – Expo + WeatherAPI

This is a simple, modern weather application built with **Expo Router** and **React Native**.  
Users can search by city, see the **current weather**, and view a **multi‑day forecast** powered by [WeatherAPI](https://www.weatherapi.com/docs/).

---

### 1. Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node) or **yarn**

- A free **WeatherAPI** account and API key  
  Sign up and get a key here: `https://www.weatherapi.com/` (see their docs at `https://www.weatherapi.com/docs/`).

---

### 2. Install dependencies

Run this from the project root:

```bash
npm install
```

---

### 3. Environment variables

The app expects your WeatherAPI key in an Expo public env variable so it can be used on the client.

1. Create a `.env` file in the project root (same level as `package.json`).
2. Add your key:

```bash
EXPO_PUBLIC_WEATHER_API_KEY=YOUR_WEATHER_API_KEY_HERE
```

> **Note**: The code uses `process.env.EXPO_PUBLIC_WEATHER_API_KEY` in `lib/weather-api.ts` to authenticate requests against WeatherAPI’s `/forecast.json` and `/search.json` endpoints (see [WeatherAPI docs](https://www.weatherapi.com/docs/)).

Restart the Expo dev server after changing `.env`.

---

### 4. Running the app

From the project root:

#### Start the Expo dev server

```bash
npx expo start --clear
```


You can then choose:

- **Android emulator**  
- **iOS simulator** (on macOS)  
- **Physical device** using the Expo Go app  

---

### 5. Features

- **City search** with autosuggest using WeatherAPI’s Search API.
- **Current weather** for the selected city:
  - Temperature and “feels like” in °C  
  - Condition text and icon (if wired)  
  - Local date and time
- **Forecast view**:
  - 3‑day forecast by default
  - Controls to change the number of forecast days (up to 14, as allowed by WeatherAPI)
- **Detail screen** for each forecast day:
  - High/low temperatures
  - Rain chance and humidity
  - Sunrise, sunset, moon info
  - Hourly breakdown every few hours
- **Graceful error handling** for invalid cities or network/API issues.

---
