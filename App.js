import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  fetchWeatherData,
  fetchHourlyWeather,
  fetchFiveDayForecast,
} from "./src/api/fetchData";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const city = "Bear";

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchWeatherData(city);
        setWeather(data);

        const hourlyData = await fetchHourlyWeather(city);
        setHourlyForecast(hourlyData);

        const fiveDayData = await fetchFiveDayForecast(city);
        setFiveDayForecast(fiveDayData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setErrorMessage("Failed to fetch weather data.");
      }
    };

    getWeather();
  }, []);

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading weather data...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Current Weather Forecast Container */}
      <View style={styles.currentWeatherContainer}>
        <Text style={styles.title}>My Location</Text>
        <Text style={styles.city}>{weather.location}</Text>
        <Text style={styles.temperature}>{weather.temperature}°</Text>
        <Text style={styles.condition}>{weather.weather}</Text>
        <View style={styles.tempRange}>
          <Text style={styles.minMax}>H: {weather.maxTemperature}°</Text>
          <Text style={styles.minMax}>L: {weather.minTemperature}°</Text>
        </View>
      </View>
      {/* Hourly Forecast Container */}
      <View style={styles.hourlyForecastContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hourlyForecast.map((hour, index) => (
            <View key={index} style={styles.hourlyItem}>
              <Text
                style={[
                  styles.hourlyTime,
                  hour.time === "Now" && styles.nowText,
                ]}
              >
                {hour.time}
              </Text>
              <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* 5-Day Forecast Container */}
      <View style={styles.fiveDayForecastContainer}>
        <Text style={styles.fiveDayTitle}>Daily Forecast</Text>

        {fiveDayForecast.length === 0 && (
          <Text style={{ color: "red" }}>No 5-day forecast data found</Text>
        )}

        {fiveDayForecast.map((day, index) => (
          <View key={index} style={styles.fiveDayItem}>
            <Text style={styles.dayText}>{day.day}</Text>
            <View style={styles.tempRange}>
              <Text style={styles.minMax}>
                L: {Math.round(day.minTemperature)}°
              </Text>
              <Text style={styles.minMax}>
                H: {Math.round(day.maxTemperature)}°
              </Text>
            </View>
          </View>
        ))}
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1E2A47",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 80,
  },

  currentWeatherContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "white",
  },
  city: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  temperature: {
    fontSize: 80,
    color: "white",
    fontWeight: "300",
  },
  tempRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
  },
  minMax: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  condition: {
    fontSize: 24,
    color: "white",
  },
  error: {
    fontSize: 18,
    color: "red",
  },
  hourlyForecastContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(33, 68, 132, 0.38)",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  hourlyTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  hourlyItem: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  hourlyTime: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  hourlyCondition: {
    fontSize: 14,
    color: "lightgray",
  },
  fiveDayForecastContainer: {
    width: "100%",
    backgroundColor: "rgba(33, 68, 132, 0.38)",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  fiveDayTitle: {
    fontSize: 15,
    color: "white",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  fiveDayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 25,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  dayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  fiveDayTemp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  loadingText: {
    fontSize: 22,
    color: "white",
  },
});
