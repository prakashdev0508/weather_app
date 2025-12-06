import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { WeatherForecastDay } from '@/lib/weather-api';

type DetailParams = {
  date?: string;
  city?: string;
  country?: string;
  data?: string;
};

export default function ForecastDetailScreen() {
  const params = useLocalSearchParams<DetailParams>();

  const day: WeatherForecastDay | null = params.data
    ? (JSON.parse(params.data) as WeatherForecastDay)
    : null;

  if (!day) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.headerRow}>
          <Ionicons name="chevron-back" size={24} color="#141B2E" onPress={router.back} />
          <ThemedText style={styles.headerTitle}>Forecast detail</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centered}>
          <ThemedText>Unable to load forecast details.</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const cityLabel = [params.city, params.country].filter(Boolean).join(', ');

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Ionicons name="chevron-back" size={24} color="#141B2E" onPress={router.back} />
          <ThemedText style={styles.headerTitle}>Forecast detail</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.mainCard}>
          <ThemedText style={styles.cityLabel}>{cityLabel}</ThemedText>
          <ThemedText style={styles.dateLabel}>{day.date}</ThemedText>

          <View style={styles.mainRow}>
            <View style={styles.temperatureCircleOuter}>
              <View style={styles.temperatureCircleInner}>
                <ThemedText style={styles.temperatureValue}>
                  {Math.round(day.day.avgtemp_c)}°
                </ThemedText>
                <ThemedText style={styles.temperatureUnit}>C</ThemedText>
              </View>
            </View>

            <View style={styles.mainMeta}>
              <ThemedText style={styles.conditionText}>{day.day.condition.text}</ThemedText>
              <ThemedText style={styles.metaLine}>
                High {Math.round(day.day.maxtemp_c)}° · Low {Math.round(day.day.mintemp_c)}°
              </ThemedText>
              <ThemedText style={styles.metaLine}>
                Rain chance {day.day.daily_chance_of_rain}% · Humidity {day.day.avghumidity}%
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.secondaryRow}>
          <View style={styles.infoCard}>
            <ThemedText style={styles.cardTitle}>Sun & Moon</ThemedText>
            <ThemedText style={styles.cardLine}>Sunrise: {day.astro.sunrise}</ThemedText>
            <ThemedText style={styles.cardLine}>Sunset: {day.astro.sunset}</ThemedText>
            <ThemedText style={styles.cardLine}>Moonrise: {day.astro.moonrise}</ThemedText>
            <ThemedText style={styles.cardLine}>Moonset: {day.astro.moonset}</ThemedText>
            <ThemedText style={styles.cardLine}>Phase: {day.astro.moon_phase}</ThemedText>
          </View>
        </View>

        <View style={styles.hourlySection}>
          <View style={styles.hourlyHeader}>
            <ThemedText style={styles.cardTitle}>Hourly</ThemedText>
            <ThemedText style={styles.cardSubTitle}>Every 3 hours</ThemedText>
          </View>

          <View style={styles.hourlyList}>
            {day.hour
              .filter((_, index) => index % 3 === 0)
              .map((hour) => (
                <View key={hour.time_epoch} style={styles.hourRow}>
                  <ThemedText style={styles.hourTime}>
                    {hour.time.split(' ')[1] ?? hour.time}
                  </ThemedText>
                  <ThemedText style={styles.hourCondition}>{hour.condition.text}</ThemedText>
                  <ThemedText style={styles.hourTemp}>
                    {Math.round(hour.temp_c)}° / {Math.round(hour.feelslike_c)}°
                  </ThemedText>
                  <ThemedText style={styles.hourMeta}>
                    Humidity {hour.humidity}% · Rain {hour.chance_of_rain}%
                  </ThemedText>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3FF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#141B2E',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    borderRadius: 32,
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
    marginBottom: 20,
  },
  cityLabel: {
    fontSize: 16,
    color: '#6C7393',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#141B2E',
    marginBottom: 16,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatureCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1FF',
  },
  temperatureCircleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  temperatureUnit: {
    marginTop: 2,
    fontSize: 14,
    color: '#D9DEFF',
  },
  mainMeta: {
    flex: 1,
    paddingLeft: 20,
  },
  conditionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#141B2E',
    marginBottom: 4,
  },
  metaLine: {
    fontSize: 14,
    color: '#6C7393',
    marginTop: 2,
  },
  secondaryRow: {
    marginBottom: 20,
  },
  infoCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#141B2E',
    marginBottom: 8,
  },
  cardSubTitle: {
    fontSize: 13,
    color: '#9BA4C0',
  },
  cardLine: {
    fontSize: 14,
    color: '#6C7393',
    marginTop: 4,
  },
  hourlySection: {
    marginTop: 4,
  },
  hourlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hourlyList: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  hourRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E3E6F5',
  },
  hourTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#141B2E',
  },
  hourCondition: {
    fontSize: 13,
    color: '#6C7393',
    marginTop: 2,
  },
  hourTemp: {
    fontSize: 14,
    color: '#141B2E',
    marginTop: 2,
  },
  hourMeta: {
    fontSize: 12,
    color: '#9BA4C0',
    marginTop: 2,
  },
});


