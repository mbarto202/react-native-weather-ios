import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchWeatherData } from "./src/api/fetchData";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function getWeather() {
      const data = await fetchWeatherData(39.6293, 75.6583); // Coordinates for Kashgar
      setWeather(data);
    }
    getWeather();
  }, []);

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text>Loading weather data...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <Text>
        <Text style={styles.label}>Location:</Text> {weather.location},{" "}
        {weather.country}
      </Text>
      <Text>
        <Text style={styles.label}>Temperature:</Text> {weather.temperature}°C
      </Text>
      <Text>
        <Text style={styles.label}>Feels Like:</Text> {weather.feelsLike}°C
      </Text>
      <Text>
        <Text style={styles.label}>Weather:</Text> {weather.weather}
      </Text>
      <Text>
        <Text style={styles.label}>Wind Speed:</Text> {weather.windSpeed} m/s
      </Text>
      <Text>
        <Text style={styles.label}>Wind Direction:</Text>{" "}
        {weather.windDirection}°
      </Text>
      <Text>
        <Text style={styles.label}>Humidity:</Text> {weather.humidity}%
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
  },
});
