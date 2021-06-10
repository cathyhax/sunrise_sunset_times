/*********** API Calls **************/
const SUNRISE_SUNSET_BASE_URL = 'https://api.sunrise-sunset.org/json?'

function getSunriseSunsetData(lat, lon) {
    let params = new URLSearchParams({
        lat: lat,
        lng: lon,
    })
    return new Promise((resolve, reject) => {
        fetch(SUNRISE_SUNSET_BASE_URL + params)
            .then(resp => resolve(resp.json()))
            .catch(err => {
                reject(err)
            });
    })
}

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?'

function getWeather(lat, lon) {
    let params = new URLSearchParams({
        lat: lat,
        lon: lon,
        appid: 'YOUR_API_ID',
        units: 'metric'
    })

    return new Promise((resolve, reject) => {
        fetch(WEATHER_BASE_URL + params)
            .then(resp => resolve(resp.json()))
            .catch(err => {
                reject(err)
            });
    })
}

const ADDRESS_SEARCH_BASE_URL = 'https://nominatim.openstreetmap.org/search?'

function addressSearch(v) {
    let params = new URLSearchParams({
        format: 'json',
        limit: 3,
        q: v
    })

    return new Promise((resolve, reject) => {
        fetch(ADDRESS_SEARCH_BASE_URL + params)
            .then(resp => resolve(resp.json()))
            .catch(err => {
                reject(err)
            });
    })
}

function getData(lat, lon) {
    return new Promise((resolve, reject) => {
        let promises = [getSunriseSunsetData(lat, lon), getWeather(lat, lon)];
        Promise.all(promises).then(resp => {
            resolve({
                sunrise_sunset: resp[0].results,
                weather: resp[1]
            })
        }).catch(err => reject(err))
    })
}

/************* Leaflet Tiles, Popup and Click Listener **************/

var CENTER_COORDS = [26.971266, -22.514623];
var ZOOM_LEVEL = 3;
var MAP_ID = 'map';
var ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
var BOUNDS = new L.LatLngBounds(new L.LatLng(-180, -180), new L.LatLng(180, 180));

var map = L.map(MAP_ID, {
    maxBounds: BOUNDS,
    maxBoundsViscosity: 1
}).setView(CENTER_COORDS, ZOOM_LEVEL);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager//{z}/{x}/{y}{r}.png', {
	attribution: ATTRIBUTION,
    minZoom: 2,
	maxZoom: 18,
}).addTo(map);

map.zoomControl.setPosition('bottomright');

var popup = L.popup();

function setPopup(lat, lon, resp) {
    let sunriseSunset = resp.sunrise_sunset;
    let weather = resp.weather;
    popup.setLatLng({ lat: lat, lng: lon })
        .setContent(
            `<div class="popup">
                <div class="mb-2">
                    <div><span class="stat__header">Lat: </span>${lat}</div>
                    <div><span class="stat__header">Lon: </span>${lon}</div>
                </div>
                <hr>
                <div class="row-wrapper">
                    <div class="stat">
                        <div class="stat__header">Sunrise: </div> 
                        <div class="stat__number">${sunriseSunset.sunrise}</div>
                    </div>
                    <div class="stat">
                        <div class="stat__header">Sunset: </div> 
                        <div class="stat__number">${sunriseSunset.sunset}</div>
                    </div>
                </div>
                <hr>
                <div class="weather">
                    <img 
                        class="weather__icon" 
                        src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"/>
                    <div class="weather__desc">${weather.weather[0].description}</div>
                    <div class="stat">
                        <div class="stat__header">Temperature</div> 
                        <div class="stat__number">${weather.main.temp}&#176; Celsius</div>
                    </div>
                </div>
            </div>`
        )
        .openOn(map)
}

function onMapClick(e) {
    getData(e.latlng.lat, e.latlng.lng)
    .then(
        resp => {
            setPopup(e.latlng.lat, e.latlng.lng, resp);
        }
    )
}

map.on('click', onMapClick);

/************* Functions Called by HTML listeners **************/

function changed(e) {
    addressSearch(e.target.value).then(
        resp => {
            let list = document.querySelector('#search-dropdown');
            list.innerHTML = '';

            if (resp.length > 0) {
                var fragment = new DocumentFragment()

                resp.forEach(address => {
                    var li = document.createElement('li')
                    var anchor = document.createElement('a')
                    anchor.classList.add('dropdown-item')
                    anchor.innerHTML = address.display_name
                    li.appendChild(anchor)
                    fragment.appendChild(li)
                    addClickListener(li, address);
                })

                list.appendChild(fragment);
                list.classList.add('show');
            } else {
                list.classList.remove('show');
            }
        }
    )
}

function addClickListener(el, address) {
    el.addEventListener('click', () => chooseAddress(address))
}

function chooseAddress(address) {
    getData(address.lat, address.lon)
        .then(
            resp => {
                setPopup(address.lat, address.lon, resp);
                map.setView([address.lat, address.lon], 5);
                blurIt();
            }
        )
}

function focusIt() {
    let list = document.querySelector('#search-dropdown');
    if (list.children.length > 0) {
        list.classList.add('show');
    }
}

function blurIt() {
    let list = document.querySelector('#search-dropdown');
    list.classList.remove('show');
}