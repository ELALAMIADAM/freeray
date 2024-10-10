import React, { useState, useEffect } from 'react';
import styles from './WeatherComponent.module.css';

const Weatherdata = () => {
  const [city, setCity] = useState('rabat');
  const [units, setUnits] = useState('metric');
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [city, units, API_KEY]);

  const convertTimeStamp = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC',
      hour12: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.city.value;
    if (searchValue) {
      setCity(searchValue);
      e.target.city.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <form className={styles.search} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search for a city..."
            name="city"
            className={styles.input}
          />
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
        <div className={styles.units}>
          <span onClick={() => setUnits('metric')} className={units === 'metric' ? styles.active : ''}>°C</span>
          <span onClick={() => setUnits('imperial')} className={units === 'imperial' ? styles.active : ''}>°F</span>
        </div>
      </div>
      {weatherData && (
        <div className={styles.body}>
          <h1 className={styles.city}>{weatherData.name}, {weatherData.sys.country}</h1>
          <div className={styles.datetime}>{convertTimeStamp(weatherData.dt, weatherData.timezone)}</div>
          <div className={styles.forecast}>{weatherData.weather[0].main}</div>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt="weather icon"
            className={styles.icon}
          />
          <p className={styles.temperature}>{Math.round(weatherData.main.temp)}°</p>
          <div className={styles.minmax}>
            <p>Min: {Math.round(weatherData.main.temp_min)}°</p>
            <p>Max: {Math.round(weatherData.main.temp_max)}°</p>
          </div>
          <div className={styles.info}>
            <div className={styles.card}>
              <i className="fa-solid fa-temperature-full"></i>
              <div>
                <p>Real Feel</p>
                <p>{Math.round(weatherData.main.feels_like)}°</p>
              </div>
            </div>
            <div className={styles.card}>
              <i className="fa-solid fa-droplet"></i>
              <div>
                <p>Humidity</p>
                <p>{weatherData.main.humidity}%</p>
              </div>
            </div>
            <div className={styles.card}>
              <i className="fa-solid fa-wind"></i>
              <div>
                <p>Wind</p>
                <p>{weatherData.wind.speed} {units === 'imperial' ? 'mph' : 'm/s'}</p>
              </div>
            </div>
            <div className={styles.card}>
              <i className="fa-solid fa-gauge-high"></i>
              <div>
                <p>Pressure</p>
                <p>{weatherData.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weatherdata;
