# Sunrise Sunset Times (+ Weather!)
A small front-end only web application to get the sunrise and sunset times, as well as weather data for geographic locations based on latitude and longitude

# Instructions
- Change the `appid` parameter in the `script.js` file for making requests to OpenWeatherMap before proceeding to run the application
- Launch application by opening the `index.html` file in your browser
- This application uses the browser's fetch API and [may/ will not run in certain browsers](https://caniuse.com/?search=fetch), notably IE

# APIs Used and Links to Documentation
- [Nominatim](https://nominatim.org/release-docs/develop/api/Search/): for converting addresses to latitude and longitude
- [Sunrise Sunset Times](https://sunrise-sunset.org/api): for getting the sunrise and sunset times using latitude and longitude
- [OpenWeather](https://openweathermap.org/current): for getting weather information using latitude and longitude

# External Frameworks Used
- [Bootstrap](https://getbootstrap.com/): minimal styling for the input element
- [Leaflet](https://leafletjs.com/): for creating the interactive map
- [Carto](https://carto.com/attribution/): for map tiles

