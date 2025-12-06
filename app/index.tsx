import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  fetchForecast,
  searchLocations,
  type SearchLocation,
  type WeatherForecastDay,
  type WeatherForecastResponse,
} from '@/lib/weather-api';

export default function HomeScreen() {
  const [query, setQuery] = useState('Delhi , india');
  const [forecastDays, setForecastDays] = useState(3);
  const [weather, setWeather] = useState<WeatherForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const selectedCityLabel = useMemo(
    () =>
      weather
        ? `${weather.location.name}, ${weather.location.region || weather.location.country}`
        : query,
    [weather, query]
  );

  const currentWeather = useMemo(
    () =>
      weather
        ? {
            city: weather.location.name,
            temperature: Math.round(weather.current.temp_c),
            feelsLike: Math.round(weather.current.feelslike_c),
            condition: weather.current.condition.text,
            time: weather.location.localtime.split(' ')[1] ?? '',
            date: weather.location.localtime.split(' ')[0] ?? '',
          }
        : null,
    [weather]
  );

  const handleFetchWeather = async (city: string, days = forecastDays) => {
    const trimmed = city.trim();
    if (!trimmed) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchForecast(trimmed, days);
      setWeather(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong while fetching weather.';
      setError(message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    handleFetchWeather(query, forecastDays);
  };

  const handleSuggestionPress = (item: SearchLocation) => {
    const label = `${item.name}${item.region ? `, ${item.region}` : ''}, ${item.country}`;
    setQuery(label);
    setSuggestions([]);
    handleFetchWeather(label, forecastDays);
  };

  const handleChangeDays = (delta: number) => {
    setForecastDays((prev) => {
      const next = Math.min(14, Math.max(1, prev + delta));
      if (weather) {
        handleFetchWeather(query || weather.location.name, next);
      }
      return next;
    });
  };

  useEffect(() => {
    // Initial load with default city.
    handleFetchWeather(query, forecastDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }

    setIsSearching(true);

    const timeout = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        if (!active) return;
        setSuggestions(results.slice(0, 5));
      } catch {
        if (!active) return;
        setSuggestions([]);
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.headerLabel}>
              Global
            </ThemedText>
            <ThemedText type="title" style={styles.headerTitle}>
              Temperature
            </ThemedText>
          </View>

          <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#9BA4C0" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSubmit}
                placeholder="Search city"
                placeholderTextColor="#9BA4C0"
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>
            {suggestions.length > 0 && (
              <View style={styles.suggestionCard}>
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestionRow}
                    onPress={() => handleSuggestionPress(item)}
                  >
                    <View>
                      <ThemedText style={styles.suggestionName}>{item.name}</ThemedText>
                      <ThemedText style={styles.suggestionMeta}>
                        {[item.region, item.country].filter(Boolean).join(', ')}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {isSearching && (
              <View style={styles.searchingRow}>
                <ActivityIndicator size="small" color="#4F46E5" />
                <ThemedText style={styles.searchingText}>Searching cities…</ThemedText>
              </View>
            )}
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#B91C1C" />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          <View style={styles.currentSection}>
            <View style={styles.currentCard}>
              <View style={styles.currentHeaderRow}>
                <View>
                  <ThemedText style={styles.currentCity}>{selectedCityLabel}</ThemedText>
                  <ThemedText style={styles.currentCondition}>
                    {currentWeather?.condition ?? '—'}
                  </ThemedText>
                </View>

                <View style={styles.currentMeta}>
                  <ThemedText style={styles.metaLabel}>Time</ThemedText>
                  <ThemedText style={styles.metaValue}>
                    {currentWeather?.time || '--:--'}
                  </ThemedText>
                  <ThemedText style={styles.metaSubValue}>
                    {currentWeather?.date || '—'}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.temperatureRow}>
                <View style={styles.temperatureCircleOuter}>
                  <View style={styles.temperatureCircleInner}>
                    <ThemedText style={styles.temperatureValue}>
                      {currentWeather ? currentWeather.temperature : '--'}°
                    </ThemedText>
                    <ThemedText style={styles.temperatureUnit}>C</ThemedText>
                  </View>
                </View>

                <View style={styles.temperatureDetails}>
                  <ThemedText style={styles.goalLabel}>Feels like</ThemedText>
                  <ThemedText style={styles.goalValue}>
                    {currentWeather ? `${currentWeather.feelsLike}°C` : '--'}
                  </ThemedText>
                  <ThemedText style={styles.goalDescription}>
                    {currentWeather
                      ? 'Great outdoor weather with clear skies.'
                      : 'Search for a city to see the latest weather.'}
                  </ThemedText>
                </View>
              </View>

              {isLoading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#4F46E5" />
                  <ThemedText style={styles.loadingText}>Fetching latest forecast…</ThemedText>
                </View>
              )}
            </View>
          </View>

          <View style={styles.forecastSection}>
            <View style={styles.forecastHeader}>
              <ThemedText type="subtitle" style={styles.forecastTitle}>
                Weather Forecast
              </ThemedText>
              <View style={styles.daysSelector}>
                <TouchableOpacity
                  onPress={() => handleChangeDays(-1)}
                  style={[styles.daysChip, styles.daysChipIcon]}
                >
                  <Ionicons name="remove" size={16} color="#4F46E5" />
                </TouchableOpacity>
                <View style={styles.daysChip}>
                  <ThemedText style={styles.daysChipText}>
                    {forecastDays} day{forecastDays > 1 ? 's' : ''}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => handleChangeDays(1)}
                  style={[styles.daysChip, styles.daysChipIcon]}
                >
                  <Ionicons name="add" size={16} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.forecastCard}>
              {weather?.forecast.forecastday.map((day: WeatherForecastDay) => (
                <TouchableOpacity
                  key={day.date_epoch}
                  style={styles.forecastRow}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: '/forecast/[date]',
                      params: {
                        date: day.date,
                        city: weather.location.name,
                        country: weather.location.country,
                        data: JSON.stringify(day),
                      },
                    })
                  }
                >
                  <View style={styles.forecastDayColumn}>
                    <ThemedText style={styles.forecastDay}>{day.date}</ThemedText>
                    <ThemedText style={styles.forecastCondition}>
                      {day.day.condition.text}
                    </ThemedText>
                  </View>

                  <View style={styles.forecastBars}>
                    <View style={[styles.barBackground, styles.barBackgroundLow]} />
                    <View style={[styles.barBackground, styles.barBackgroundHigh]} />
                    <View
                      style={[
                        styles.barOverlay,
                        styles.barOverlayPrimary,
                        { height: 50 + (day.day.maxtemp_c - 10) * 2 },
                      ]}
                    />
                    <View
                      style={[
                        styles.barOverlay,
                        styles.barOverlaySecondary,
                        { height: 40 + (day.day.mintemp_c - 5) * 2 },
                      ]}
                    />
                  </View>

                  <View style={styles.forecastMetaColumn}>
                    <ThemedText style={styles.forecastTemp}>
                      {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
                    </ThemedText>
                    <ThemedText style={styles.forecastMeta}>
                      Rain {day.day.daily_chance_of_rain}%
                    </ThemedText>
                    <ThemedText style={styles.forecastMeta}>
                      Humidity {Math.round(day.day.avghumidity)}%
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
              {!weather && !isLoading && (
                <View style={styles.emptyState}>
                  <ThemedText style={styles.emptyText}>
                    Start by searching for a city to see the forecast.
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3FF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.select({ ios: 8, android: 24 }),
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  headerLabel: {
    fontSize: 16,
    color: '#9BA4C0',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 36,
    color: '#141B2E',
  },
  searchWrapper: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#141B2E',
  },
  suggestionCard: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E3E6F5',
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#141B2E',
  },
  suggestionMeta: {
    fontSize: 12,
    color: '#6C7393',
    marginTop: 2,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  searchingText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#6C7393',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#B91C1C',
  },
  currentSection: {
    marginBottom: 28,
  },
  currentCard: {
    borderRadius: 32,
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  currentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  currentCity: {
    fontSize: 20,
    fontWeight: '600',
    color: '#141B2E',
  },
  currentCondition: {
    marginTop: 4,
    fontSize: 14,
    color: '#6C7393',
  },
  currentMeta: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 12,
    color: '#9BA4C0',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#141B2E',
  },
  metaSubValue: {
    marginTop: 2,
    fontSize: 12,
    color: '#9BA4C0',
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatureCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1FF',
  },
  temperatureCircleInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  temperatureUnit: {
    marginTop: 2,
    fontSize: 14,
    color: '#D9DEFF',
  },
  temperatureDetails: {
    flex: 1,
    paddingLeft: 20,
  },
  goalLabel: {
    fontSize: 14,
    color: '#9BA4C0',
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#141B2E',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 13,
    color: '#6C7393',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#6C7393',
  },
  forecastSection: {
    marginTop: 12,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forecastTitle: {
    fontSize: 22,
    color: '#141B2E',
  },
  forecastSubtitle: {
    fontSize: 14,
    color: '#9BA4C0',
  },
  daysSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF1FF',
    marginLeft: 6,
  },
  daysChipIcon: {
    backgroundColor: '#E0E7FF',
  },
  daysChipText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '500',
  },
  forecastCard: {
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  forecastDayColumn: {
    flex: 1.2,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#141B2E',
  },
  forecastCondition: {
    marginTop: 2,
    fontSize: 13,
    color: '#6C7393',
  },
  forecastBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: 12,
    height: 90,
    position: 'relative',
  },
  barBackground: {
    width: 8,
    borderRadius: 999,
    position: 'absolute',
    bottom: 0,
  },
  barBackgroundLow: {
    left: 12,
    height: 80,
    backgroundColor: '#EEF1FF',
  },
  barBackgroundHigh: {
    right: 12,
    height: 80,
    backgroundColor: '#EEF1FF',
  },
  barOverlay: {
    width: 8,
    borderRadius: 999,
    position: 'absolute',
    bottom: 0,
  },
  barOverlayPrimary: {
    right: 12,
    backgroundColor: '#4F46E5',
  },
  barOverlaySecondary: {
    left: 12,
    backgroundColor: '#7DD3FC',
  },
  forecastMetaColumn: {
    flex: 1.2,
    alignItems: 'flex-end',
  },
  forecastTemp: {
    fontSize: 15,
    fontWeight: '600',
    color: '#141B2E',
  },
  forecastMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#6C7393',
  },
  emptyState: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#6C7393',
  },
});


