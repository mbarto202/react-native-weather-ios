import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { fetchWeatherData, fetchHourlyWeather } from "./src/api/fetchData";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const city = "Bear";

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchWeatherData(city);
        setWeather(data);

        const hourlyData = await fetchHourlyWeather(city);
        setHourlyForecast(hourlyData);
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
        <Text>Loading weather data...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000f2f",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 60,
  },
  currentWeatherContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    color: "white",
  },
  city: {
    fontSize: 24,
    color: "white",
    marginVertical: 8,
  },
  temperature: {
    fontSize: 64,
    color: "white",
    marginVertical: 16,
  },
  tempRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
    marginBottom: 16,
  },
  minMax: {
    color: "#fff",
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
    width: "100%",
    backgroundColor: "#002a4f",
    padding: 15,
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
    marginRight: 10,
  },
  hourlyTime: {
    fontSize: 16,
    color: "white",
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  hourlyCondition: {
    fontSize: 14,
    color: "lightgray",
  },
});
