import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const App = () => {
  const cities = [
    { name: "Cairo", country: "Egypt", lat: 30.0444, long: 31.2357 },
    { name: "London", country: "UK", lat: 51.5074, long: -0.1278 },
    { name: "Tokyo", country: "Japan", lat: 35.6762, long: 139.6503 },
    { name: "New York", country: "USA", lat: 40.7128, long: -74.006 },
    { name: "Paris", country: "France", lat: 48.8566, long: 2.3522 },
    { name: "Dubai", country: "UAE", lat: 25.2048, long: 55.2708 },
    { name: "Sydney", country: "Australia", lat: -33.8688, long: 151.2093 },
    { name: "Berlin", country: "Germany", lat: 52.52, long: 13.405 },
    { name: "Moscow", country: "Russia", lat: 55.7558, long: 37.6173 },
    { name: "Rome", country: "Italy", lat: 41.9028, long: 12.4964 },
    { name: "Madrid", country: "Spain", lat: 40.4168, long: -3.7038 },
    { name: "Beijing", country: "China", lat: 39.9042, long: 116.4074 },
    { name: "Toronto", country: "Canada", lat: 43.6532, long: -79.3832 },
    {
      name: "Rio de Janeiro",
      country: "Brazil",
      lat: -22.9068,
      long: -43.1729,
    },
    {
      name: "Cape Town",
      country: "South Africa",
      lat: -33.9249,
      long: 18.4241,
    },
    { name: "Mumbai", country: "India", lat: 19.076, long: 72.8777 },
    { name: "Seoul", country: "South Korea", lat: 37.5665, long: 126.978 },
    { name: "Bangkok", country: "Thailand", lat: 13.7563, long: 100.5018 },
    { name: "Singapore", country: "Singapore", lat: 1.3521, long: 103.8198 },
    { name: "Hong Kong", country: "China", lat: 22.3193, long: 114.1694 },
    { name: "Istanbul", country: "Turkey", lat: 41.0082, long: 28.9784 },
    { name: "Mexico City", country: "Mexico", lat: 19.4326, long: -99.1332 },
    { name: "Jakarta", country: "Indonesia", lat: -6.2088, long: 106.8456 },
    { name: "Lima", country: "Peru", lat: -12.0464, long: -77.0428 },
    {
      name: "Buenos Aires",
      country: "Argentina",
      lat: -34.6037,
      long: -58.3816,
    },
    { name: "Vienna", country: "Austria", lat: 48.2082, long: 16.3738 },
    { name: "Prague", country: "Czech Republic", lat: 50.0755, long: 14.4378 },
    { name: "Athens", country: "Greece", lat: 37.9838, long: 23.7275 },
    { name: "Stockholm", country: "Sweden", lat: 59.3293, long: 18.0686 },
    { name: "Oslo", country: "Norway", lat: 59.9139, long: 10.7522 },
    { name: "Helsinki", country: "Finland", lat: 60.1699, long: 24.9384 },
    { name: "Copenhagen", country: "Denmark", lat: 55.6761, long: 12.5683 },
    { name: "Dublin", country: "Ireland", lat: 53.3498, long: -6.2603 },
    { name: "Lisbon", country: "Portugal", lat: 38.7223, long: -9.1393 },
    { name: "Brussels", country: "Belgium", lat: 50.8503, long: 4.3517 },
    { name: "Amsterdam", country: "Netherlands", lat: 52.3676, long: 4.9041 },
    { name: "Zurich", country: "Switzerland", lat: 47.3769, long: 8.5417 },
    { name: "Warsaw", country: "Poland", lat: 52.2297, long: 21.0122 },
    { name: "Budapest", country: "Hungary", lat: 47.4979, long: 19.0402 },
    { name: "Bucharest", country: "Romania", lat: 44.4268, long: 26.1025 },
    { name: "Sofia", country: "Bulgaria", lat: 42.6977, long: 23.3219 },
    { name: "Belgrade", country: "Serbia", lat: 44.7866, long: 20.4489 },
    { name: "Zagreb", country: "Croatia", lat: 45.815, long: 15.9819 },
    { name: "Reykjavik", country: "Iceland", lat: 64.1466, long: -21.9426 },
    { name: "Luxembourg", country: "Luxembourg", lat: 49.6116, long: 6.1319 },
    { name: "Monaco", country: "Monaco", lat: 43.7384, long: 7.4246 },
    { name: "San Marino", country: "San Marino", lat: 43.9424, long: 12.4578 },
    { name: "Andorra", country: "Andorra", lat: 42.5063, long: 1.5218 },
    {
      name: "Vatican City",
      country: "Vatican City",
      lat: 41.9029,
      long: 12.4534,
    },
  ];

  const [selectedCity, setSelectedCity] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [userLocation, setUserLocation] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [units, setUnits] = useState("celsius");
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchWeatherData = async (cityIndex) => {
    setLoading(true);
    const { lat, long, name, country } = cities[cityIndex];

    try {
      const [weatherRes, airQualityRes] = await Promise.all([
        axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&timezone=auto`
        ),
        axios.get(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&hourly=pm10,pm2_5,carbon_monoxide`
        ),
      ]);

      const now = new Date();
      const currentHour = now.getHours();
      const hourlyData = [];

      for (let i = 0; i < 24; i++) {
        const hourIndex = currentHour + i;
        hourlyData.push({
          time: weatherRes.data.hourly.time[hourIndex],
          temperature: weatherRes.data.hourly.temperature_2m[hourIndex],
          weathercode: weatherRes.data.hourly.weathercode[hourIndex],
          windspeed: weatherRes.data.hourly.windspeed_10m[hourIndex],
          precipitation:
            weatherRes.data.hourly.precipitation_probability[hourIndex],
        });
      }

      setWeatherData({
        ...weatherRes.data,
        currentCity: name,
        currentCountry: country,
        airQuality: {
          pm10: airQualityRes.data.hourly.pm10[currentHour],
          pm2_5: airQualityRes.data.hourly.pm2_5[currentHour],
          co: airQualityRes.data.hourly.carbon_monoxide[currentHour],
          lastUpdated: new Date().toISOString(),
        },
      });

      setHourlyForecast(hourlyData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      let closestCity = null;
      let minDistance = Infinity;

      cities.forEach((city, index) => {
        const distance = Math.sqrt(
          Math.pow(city.lat - userLocation.lat, 2) +
            Math.pow(city.long - userLocation.long, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestCity = index;
        }
      });

      if (closestCity !== null) {
        setSelectedCity(closestCity);
      }
    }
  }, [userLocation]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleUnits = () => {
    setUnits(units === "celsius" ? "fahrenheit" : "celsius");
  };

  const convertTemp = (temp) => {
    if (units === "fahrenheit") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 0) return "fa-sun";
    if (weatherCode <= 3) return "fa-cloud-sun";
    if (weatherCode <= 48) return "fa-smog";
    if (weatherCode <= 55) return "fa-cloud-rain";
    if (weatherCode <= 65) return "fa-cloud-showers-heavy";
    if (weatherCode <= 77) return "fa-snowflake";
    if (weatherCode <= 82) return "fa-cloud-rain";
    if (weatherCode <= 86) return "fa-snowflake";
    if (weatherCode <= 99) return "fa-cloud-bolt";
    return "fa-cloud";
  };

  const getWeatherDescription = (weatherCode) => {
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return descriptions[weatherCode] || "Unknown weather condition";
  };

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (index) => {
    setSelectedCity(index);
    setShowDropdown(false);
    setSearchQuery("");
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev >= filteredCities.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev <= 0 ? filteredCities.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const cityName = filteredCities[focusedIndex].name;
      const actualIndex = cities.findIndex((c) => c.name === cityName);
      handleCitySelect(actualIndex);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll(".city-item");
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [focusedIndex]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !weatherData) {
    return (
      <div
        className={`d-flex justify-content-center align-items-center vh-100 bg-${theme}`}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-vh-100 bg-${theme} text-${
        theme === "dark" ? "white" : "dark"
      }`}
    >
      <style jsx>{`
        .hover-effect {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .bg-dark {
          background-color: #2c3e50 !important;
        }
        .bg-secondary {
          background-color: #34495e !important;
        }
        .search-container {
          position: relative;
        }
        .cities-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
          display: ${showDropdown && searchQuery ? "block" : "none"};
        }
        .city-item {
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .city-item:hover,
        .city-item.focused {
          background-color: ${theme === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)"};
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        .slide-down {
          animation: slideDown 0.3s ease-out;
        }
        .pulse {
          animation: pulse 2s infinite;
        }
        .nav-tabs .nav-link {
          color: ${theme === "dark" ? "#adb5bd" : "#495057"};
        }
        .nav-tabs .nav-link.active {
          color: ${theme === "dark" ? "white" : "#495057"};
          background-color: ${theme === "dark" ? "#2c3e50" : "white"};
          border-color: ${theme === "dark"
            ? "#dee2e6 #dee2e6 #2c3e50"
            : "#dee2e6 #dee2e6 #fff"};
        }
        .hourly-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        .hourly-item:hover {
          background-color: ${theme === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)"};
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      <div className="container py-4">
        {/* Header with search */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="m-0">
            <i className="fas fa-cloud-sun me-2 text-primary"></i>
            Weather Forecast
          </h1>
          <div>
            <button
              onClick={toggleTheme}
              className="btn btn-outline-primary me-2"
            >
              <i className={`fas fa-${theme === "light" ? "moon" : "sun"}`}></i>
            </button>
            <button onClick={toggleUnits} className="btn btn-outline-primary">
              °{units === "celsius" ? "C" : "F"}
            </button>
          </div>
        </div>

        {/* Search and City Selector */}
        <div className="mb-4 slide-down">
          <div className="search-container">
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${
                  theme === "dark" ? "bg-dark text-white" : ""
                }`}
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={handleKeyDown}
                ref={searchInputRef}
              />
              <button
                className={`btn btn-primary ${
                  theme === "dark" ? "bg-dark border-dark" : ""
                }`}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>

            <div
              className={`cities-dropdown ${
                theme === "dark" ? "bg-dark" : "bg-light"
              } shadow rounded mt-1`}
              ref={dropdownRef}
            >
              {filteredCities.map((city, index) => (
                <div
                  key={index}
                  className={`city-item p-2 ${
                    focusedIndex === index ? "focused" : ""
                  } ${theme === "dark" ? "text-white" : "text-dark"}`}
                  onClick={() =>
                    handleCitySelect(
                      cities.findIndex((c) => c.name === city.name)
                    )
                  }
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="d-flex justify-content-between">
                    <span>{city.name}</span>
                    <span className="text-muted">{city.country}</span>
                  </div>
                </div>
              ))}
              {filteredCities.length === 0 && (
                <div className="p-2 text-center text-muted">
                  No cities found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Location Button */}
        {userLocation && (
          <div className="mb-4">
            <button
              className="btn btn-outline-info"
              onClick={() => {
                let closestCity = null;
                let minDistance = Infinity;

                cities.forEach((city, index) => {
                  const distance = Math.sqrt(
                    Math.pow(city.lat - userLocation.lat, 2) +
                      Math.pow(city.long - userLocation.long, 2)
                  );

                  if (distance < minDistance) {
                    minDistance = distance;
                    closestCity = index;
                  }
                });

                if (closestCity !== null) {
                  setSelectedCity(closestCity);
                }
              }}
            >
              <i className="fas fa-location-arrow me-2"></i>
              Use My Current Location
            </button>
          </div>
        )}

        <div className="row g-4 fade-in">
          {/* Current Weather */}
          <div className="col-md-6 col-lg-4">
            <div
              className={`card h-100 border-0 shadow-lg bg-${
                theme === "dark" ? "secondary" : "light"
              }`}
            >
              <div className="card-body text-center p-4">
                <h5 className="card-title mb-3">
                  <i className="fas fa-map-marker-alt text-danger me-2"></i>
                  {weatherData?.currentCity || cities[selectedCity].name},{" "}
                  {weatherData?.currentCountry || cities[selectedCity].country}
                </h5>
                <div className="my-4">
                  <i
                    className={`fas ${getWeatherIcon(
                      weatherData?.current_weather?.weathercode
                    )} fa-4x mb-3 text-warning pulse`}
                  ></i>
                  <h2 className="display-4">
                    {convertTemp(
                      weatherData?.current_weather?.temperature
                    ).toFixed(1)}
                    °{units === "celsius" ? "C" : "F"}
                  </h2>
                  <p className="text-muted">
                    {getWeatherDescription(
                      weatherData?.current_weather?.weathercode
                    )}
                  </p>
                </div>
                <div className="d-flex justify-content-around">
                  <div>
                    <i className="fas fa-wind me-2 text-info"></i>
                    {weatherData?.current_weather?.windspeed} km/h
                  </div>
                  <div>
                    <i className="fas fa-clock me-2 text-primary"></i>
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                <small className="text-muted">
                  Updated: {new Date().toLocaleString()}
                </small>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="col-md-6 col-lg-4">
            <div
              className={`card h-100 border-0 shadow-lg bg-${
                theme === "dark" ? "secondary" : "light"
              }`}
            >
              <div className="card-body p-4">
                <h5 className="card-title mb-4">
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                  Weather Details
                </h5>
                <div className="list-group list-group-flush">
                  <div className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                    <span>
                      <i className="fas fa-temperature-low me-2 text-info"></i>
                      Feels Like
                    </span>
                    <span>
                      {convertTemp(
                        weatherData?.current_weather?.temperature
                      ).toFixed(1)}
                      °{units === "celsius" ? "C" : "F"}
                    </span>
                  </div>
                  <div className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                    <span>
                      <i className="fas fa-tint me-2 text-primary"></i>
                      Humidity
                    </span>
                    <span>65%</span>
                  </div>
                  <div className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                    <span>
                      <i className="fas fa-eye me-2 text-success"></i>
                      Visibility
                    </span>
                    <span>10 km</span>
                  </div>
                  <div className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                    <span>
                      <i className="fas fa-cloud-rain me-2 text-info"></i>
                      Precipitation
                    </span>
                    <span>{hourlyForecast[0]?.precipitation || 0}%</span>
                  </div>
                  <div className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                    <span>
                      <i className="fas fa-compass me-2 text-warning"></i>
                      Wind Direction
                    </span>
                    <span>{weatherData?.current_weather?.winddirection}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today Highlight */}
          <div className="col-md-12 col-lg-4">
            <div
              className={`card h-100 border-0 shadow-lg bg-${
                theme === "dark" ? "secondary" : "light"
              }`}
            >
              <div className="card-body p-4">
                <h5 className="card-title mb-4">
                  <i className="fas fa-star me-2 text-warning"></i>
                  Today's Highlight
                </h5>
                <div className="row g-3">
                  <div className="col-6">
                    <div
                      className={`p-3 rounded text-center bg-${
                        theme === "dark" ? "dark" : "primary"
                      } text-white`}
                    >
                      <div>
                        <i className="fas fa-temperature-high fa-2x mb-2"></i>
                      </div>
                      <h6>High</h6>
                      <h4>
                        {convertTemp(
                          weatherData?.daily?.temperature_2m_max[0]
                        ).toFixed(1)}
                        °{units === "celsius" ? "C" : "F"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className={`p-3 rounded text-center bg-${
                        theme === "dark" ? "dark" : "info"
                      } text-white`}
                    >
                      <div>
                        <i className="fas fa-temperature-low fa-2x mb-2"></i>
                      </div>
                      <h6>Low</h6>
                      <h4>
                        {convertTemp(
                          weatherData?.daily?.temperature_2m_min[0]
                        ).toFixed(1)}
                        °{units === "celsius" ? "C" : "F"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className={`p-3 rounded text-center bg-${
                        theme === "dark" ? "dark" : "success"
                      } text-white`}
                    >
                      <div>
                        <i className="fas fa-sun fa-2x mb-2"></i>
                      </div>
                      <h6>Sunrise</h6>
                      <h4>{formatTime(weatherData?.daily?.sunrise[0])}</h4>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className={`p-3 rounded text-center bg-${
                        theme === "dark" ? "dark" : "warning"
                      } text-white`}
                    >
                      <div>
                        <i className="fas fa-moon fa-2x mb-2"></i>
                      </div>
                      <h6>Sunset</h6>
                      <h4>{formatTime(weatherData?.daily?.sunset[0])}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Tabs */}
        <div
          className={`card mt-4 border-0 shadow-lg bg-${
            theme === "dark" ? "secondary" : "light"
          } fade-in`}
        >
          <div className="card-body p-4">
            <ul className="nav nav-tabs" id="forecastTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "today" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("today")}
                >
                  <i className="fas fa-clock me-2"></i>
                  Hourly
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "weekly" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("weekly")}
                >
                  <i className="fas fa-calendar-week me-2"></i>
                  7-Day Forecast
                </button>
              </li>
            </ul>

            <div className="tab-content mt-3">
              {activeTab === "today" && (
                <div className="tab-pane fade show active">
                  <div className="d-flex overflow-auto pb-2">
                    {hourlyForecast.map((hour, index) => (
                      <div key={index} className="hourly-item mx-2 text-center">
                        <small>{formatTime(hour.time)}</small>
                        <i
                          className={`fas ${getWeatherIcon(
                            hour.weathercode
                          )} my-2 text-warning`}
                        ></i>
                        <div>
                          {convertTemp(hour.temperature).toFixed(0)}°
                          {units === "celsius" ? "C" : "F"}
                        </div>
                        <small className="text-muted">
                          {hour.precipitation}%
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "weekly" && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    {weatherData?.daily?.time.map((date, index) => {
                      const dayName = new Date(date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                        }
                      );
                      return (
                        <div
                          key={index}
                          className="col-6 col-md-4 col-lg-3 col-xl-2"
                        >
                          <div
                            className={`p-3 rounded text-center bg-${
                              theme === "dark" ? "dark" : "white"
                            } hover-effect`}
                          >
                            <h6>{dayName}</h6>
                            <small>{formatDate(date)}</small>
                            <i
                              className={`fas ${getWeatherIcon(
                                weatherData?.daily?.weathercode[index]
                              )} fa-2x my-2 text-warning`}
                            ></i>
                            <div className="d-flex justify-content-around">
                              <span className="text-danger fw-bold">
                                {convertTemp(
                                  weatherData?.daily?.temperature_2m_max[index]
                                ).toFixed(0)}
                                °
                              </span>
                              <span className="text-primary">
                                {convertTemp(
                                  weatherData?.daily?.temperature_2m_min[index]
                                ).toFixed(0)}
                                °
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Air Quality */}
        <div
          className={`card mt-4 border-0 shadow-lg bg-${
            theme === "dark" ? "secondary" : "light"
          } fade-in`}
        >
          <div className="card-body p-4">
            <h5 className="card-title mb-4">
              <i className="fas fa-wind me-2 text-primary"></i>
              Air Quality
            </h5>
            {weatherData?.airQuality ? (
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="fas fa-smog fa-2x text-info"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">PM2.5</h6>
                      <p className="mb-0">
                        {weatherData.airQuality.pm2_5} µg/m³
                        <small className="ms-2 text-muted">(current)</small>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="fas fa-industry fa-2x text-warning"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">PM10</h6>
                      <p className="mb-0">
                        {weatherData.airQuality.pm10} µg/m³
                        <small className="ms-2 text-muted">(current)</small>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="fas fa-smoke fa-2x text-danger"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">CO</h6>
                      <p className="mb-0">
                        {weatherData.airQuality.co} µg/m³
                        <small className="ms-2 text-muted">(current)</small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">
                Air quality data not available for this location.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
