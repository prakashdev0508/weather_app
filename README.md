## Weather App – Expo + WeatherAPI

This is a simple, modern weather application built with **Expo Router** and **React Native**.  
Users can search by city, see the **current weather**, and view a **multi‑day forecast** powered by [WeatherAPI](https://www.weatherapi.com/docs/).

---

### 1. Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node) or **yarn**
- **Expo** tooling:

```bash
npm install -g expo-cli
```

- A free **WeatherAPI** account and API key  
  Sign up and get a key here: `https://www.weatherapi.com/` (see their docs at `https://www.weatherapi.com/docs/`).

---

### 2. Install dependencies

Run this from the project root:

```bash
npm install
```

or

```bash
yarn
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
npm run start
```

or

```bash
yarn start
```

You can then choose:

- **Android emulator**  
- **iOS simulator** (on macOS)  
- **Physical device** using the Expo Go app  

There are also convenience scripts:

```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

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

### 6. Project structure (high level)

- `app/`
  - `_layout.tsx` – root layout using Expo Router.
  - `index.tsx` – main weather screen (search, current weather, forecast list).
  - `forecast/[date].tsx` – detail view for a specific forecast day.
- `lib/`
  - `weather-api.ts` – small typed wrapper around WeatherAPI (forecast + search).
- `components/`
  - Shared UI components (themed text/view, etc.).
- `hooks/`
  - Reusable hooks (e.g., color scheme, theme).

---

### 7. Linting

This project uses the Expo ESLint config.

Run:

```bash
npm run lint
```

Fix any issues shown before pushing to production.

---

### 8. Customization tips

- **Change default city**: update the initial query/default city in the main screen/state logic (e.g., set to your city).
- **Units**: currently shows °C; you can extend `lib/weather-api.ts` and the UI to support °F.
- **Branding**: update colors, typography, and icons in the components to match your brand.

---

### 9. Troubleshooting

- **Blank data / API errors**
  - Confirm your `.env` exists and `EXPO_PUBLIC_WEATHER_API_KEY` is correct.
  - Check that your WeatherAPI plan allows the number of forecast days you are requesting.
- **Changes to `.env` not applied**
  - Stop the dev server and run `npm run start` again.
- **Network issues**
  - Ensure your device/emulator has internet access; WeatherAPI calls require it.
