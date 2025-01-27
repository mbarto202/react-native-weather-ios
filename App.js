import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchWeatherData } from "./src/api/fetchData";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchWeatherData("Bear");
        setWeather(data);
      } catch (error) {
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
    <View style={styles.container}>
      <Text style={styles.title}>My Location</Text>
      <Text style={styles.city}>
        {weather.location}, {weather.country}
      </Text>
      <Text style={styles.temperature}>{weather.temperature}°</Text>
      <Text style={styles.condition}>{weather.weather}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000f2f",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
  condition: {
    fontSize: 24,
    color: "white",
  },
  error: {
    fontSize: 18,
    color: "red",
  },
});
