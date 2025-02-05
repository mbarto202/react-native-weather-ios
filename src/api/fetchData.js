export async function fetchWeatherData(city) {
  const apiKey = "0b119156d44fd4ae748de6662549bb18";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    return {
      location: data.name || "Unknown location",
      country: data.sys.country || "Unknown country",
      temperature: Math.round(data.main.temp),
      minTemperature: Math.round(data.main.temp_min),
      maxTemperature: Math.round(data.main.temp_max),
      feelsLike: Math.round(data.main.feels_like),
      weather: data.weather[0]?.description || "No description available",
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      humidity: data.main.humidity,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export async function fetchHourlyWeather(city) {
  const apiKey = "0b119156d44fd4ae748de6662549bb18";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    const now = new Date();
    const currentHour = now.toLocaleTimeString([], {
      hour: "numeric",
      hour12: true,
    });

    const hourlyForecast = data.list.slice(0, 5).map((hour) => ({
      time: new Date(hour.dt * 1000).toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      }),
      temperature: Math.round(hour.main.temp),
      icon: `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
    }));

    hourlyForecast.unshift({
      time: "Now",
      temperature: Math.round(data.list[0].main.temp),
      icon: `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`,
    });

    return hourlyForecast;
  } catch (error) {
    console.error("Error fetching hourly weather data:", error);
    return [];
  }
}

export async function fetchFiveDayForecast(city) {
  const apiKey = "0b119156d44fd4ae748de6662549bb18";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    const dailyForecasts = {};

    data.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });

      if (!dailyForecasts[day]) {
        dailyForecasts[day] = {
          day,
          maxTemperature: forecast.main.temp_max,
          minTemperature: forecast.main.temp_min,
          icon: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`, // Weather icon URL
        };
      } else {
        dailyForecasts[day].maxTemperature = Math.max(
          dailyForecasts[day].maxTemperature,
          forecast.main.temp_max
        );
        dailyForecasts[day].minTemperature = Math.min(
          dailyForecasts[day].minTemperature,
          forecast.main.temp_min
        );
      }
    });

    const fiveDayData = Object.values(dailyForecasts).slice(0, 5);

    return fiveDayData;
  } catch (error) {
    console.error("Error fetching 5-day forecast:", error);
    return [];
  }
}
