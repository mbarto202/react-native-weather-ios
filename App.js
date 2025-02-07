import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import {
  fetchWeatherData,
  fetchHourlyWeather,
  fetchFiveDayForecast,
} from "./src/api/fetchData";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

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

  const getGradientColors = (weather) => {
    switch (weather) {
      case "Clear":
        return ["#4A90E2", "#145DA0"]; // Sunny gradient
      case "Clouds":
        return ["#757F9A", "#D7DDE8"]; // Cloudy gradient
      case "Rain":
        return ["#5C258D", "#4389A2"]; // Rainy gradient
      case "Snow":
        return ["#E6DADA", "#274046"]; // Snowy gradient
      default:
        return ["#4A90E2", "#145DA0"];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors(weather.weather)}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Current Weather Forecast Container */}
        <View style={styles.currentWeatherContainer}>
          <Text style={styles.title}>My Location</Text>
          <Text style={styles.city}>{weather.location}</Text>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{weather.temperature}</Text>
            <Text style={styles.degreeSymbol}>°</Text>
          </View>

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

                <Image source={{ uri: hour.icon }} style={styles.weatherIcon} />

                <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 5-Day Forecast Container */}
        <View style={styles.fiveDayForecastContainer}>
          <Text style={styles.fiveDayTitle}>5-DAY FORECAST</Text>

          {fiveDayForecast.map((day, index) => (
            <View
              key={index}
              style={[
                styles.fiveDayItem,
                index === fiveDayForecast.length - 1 ? styles.lastItem : {},
              ]}
            >
              <View style={styles.dayContainer}>
                <Text style={styles.dayText}>
                  {index === 0 ? "Today" : day.day}
                </Text>
              </View>

              <View style={styles.iconWrapper}>
                <Image source={{ uri: day.icon }} style={styles.weatherIcon} />
              </View>

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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    position: "relative",
  },
  temperature: {
    fontSize: 80,
    color: "white",
    fontWeight: "300",
    textAlign: "center",
  },
  degreeSymbol: {
    fontSize: 80,
    color: "white",
    fontWeight: "300",
    position: "absolute",
    right: -30,
  },

  tempRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "30%",
    alignItems: "center",
  },
  minMax: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
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
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
    marginTop: 10,
    paddingTop: -10,
    paddingBottom: -10,
  },
  fiveDayTitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.6)",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  fiveDayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  dayContainer: {
    width: 80,
    alignItems: "center",
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
  weatherIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
