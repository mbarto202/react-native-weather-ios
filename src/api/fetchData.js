export async function fetchWeatherData(lat, lon) {
  const apiKey = "0b119156d44fd4ae748de6662549bb18";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Convert temperatures to Celsius
    const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(1);

    return {
      location: data.name || "Unknown location",
      country: data.sys.country,
      temperature: kelvinToCelsius(data.main.temp),
      feelsLike: kelvinToCelsius(data.main.feels_like),
      weather: data.weather[0].description,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      humidity: data.main.humidity,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}
