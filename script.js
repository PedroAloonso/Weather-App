const API_KEY = 'de5c9dbafc3bc34635551391a7739e3b';
var cityName =  'São Paulo';

const btnInputCity = document.querySelector('#btnCityInput');
const inputCity = document.querySelector('#cityInput');

async function getForecastCityData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`, {mode: 'cors'});
    const cityData = await response.json();
    return cityData  
}

async function getWeatherCityData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`, {mode: 'cors'});
    const cityData = await response.json();
    return cityData
}

function showForecast() {
    getForecastCityData()
    .then((data) => {
        if (data.cod == '200') {
            let container = document.querySelector('.side-info');
            data.list.forEach(e => {
                
                let temp = Math.floor(e.main.temp) + '°C';
                let date = new Date(e.dt_txt);
                let hour = transformTime(date.getHours());
                let minute = transformTime(date.getMinutes());
                let time = hour + ':' + minute;
                let url = chooseWeatherIcon(e.weather[0].main, 'forecast');
                container.appendChild(createForecastElement(time, temp, url));
            });
        } else if (data.cod == '404') {
            console.log('City not found');
        }
    })
    .catch((err) => console.log(err))
}

function showRealTimeWeather() {
    getWeatherCityData()
    .then((data) => {
        if (data.cod == '200') {
            let container = document.querySelector('.main-info');
            
            let cityName = document.querySelector('.main-info div h1');
            let temp = document.querySelector('.main-info div h2');
            let time = document.querySelector('.main-info div h3');
            let date = document.querySelector('#date');
            let icon = document.querySelector('.main-info img');
            
            let now = new Date;

            let hour = transformTime(now.getHours());
            let minute = transformTime(now.getMinutes());

            let weekday =  now.toLocaleDateString(undefined, {weekday: 'long'});
            let day =  now.toLocaleDateString(undefined, {day: 'numeric'});
            let month = capitalizeFirstLetter(now.toLocaleDateString(undefined, {month: 'short'}));
            let year = now.getFullYear();

            cityName.innerHTML = data.name;
            temp.innerHTML = Math.floor(data.main.temp) + '°C';
            time.innerHTML = hour + ':' + minute;
            date.innerHTML = `${weekday}, ${day} ${month} ${year}`
            console.log(chooseWeatherIcon(data.weather[0].main));
            icon.src = chooseWeatherIcon(data.weather[0].main, 'Weather');
        }
    })
    .catch((err) => console.log(err))
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function chooseWeatherIcon (weather, place) {
    let url = './images/scattered-clouds-';
    let size = 64;
    let type = '.png';
    switch (weather) {
        case 'Thunderstorm' :
            url = './images/thunderstorm-';
            break;
        case 'Drizzle' :
            url = './images/shower-rain-';
            break;
        case 'Rain' :
            url = './images/rain-';
            break;
        case 'Snow' :
            url = './images/snow-';
            break;
        case 'Clear' :
            url = './images/clear-sky-';
            break;
        case 'Clouds' :
            url = './images/few-clouds-';
            break;
        case 'Mist':	
        case 'Smoke': 
        case 'Haze':
        case 'Dust':
        case 'Fog':
        case 'Sand':
        case 'Dust':
        case 'Ash':
        case 'Squall':
        case 'Tornado':
            url = './images/mist-';
    }  

    if (place == 'forecast') {
        size = 64;
    } else {
        size = 96;
    }

    return url + size + type
}


function createForecastElement(hour, temp, icon = './images/few-clouds-64.png'){
    let div = document.createElement('div');
    div.classList.add('side-info-item');

    let h1 = document.createElement('h1');
    let h2 = document.createElement('h2');
    let img = document.createElement('img');

    h1.innerHTML = hour;
    h2.innerHTML = temp;
    img.src = icon;
    
    div.appendChild(h1);
    div.appendChild(h2);
    div.appendChild(img);
    return div
}

function transformTime(time) {
    let stringTime = String(time)
    if (stringTime.length < 2) {
        stringTime = '0' + stringTime;
        return stringTime
    } else {
        return stringTime
    }
}

function clearSideInfo() {
    let sideInfo = document.querySelector('.side-info');
    sideInfo.innerHTML = '';
}






btnInputCity.addEventListener('click',() => { 
    cityName = inputCity.value
    clearSideInfo();
    showForecast();
    showRealTimeWeather();

    inputCity.value = '';

});

inputCity.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
        cityName = inputCity.value
        clearSideInfo();
        showForecast();
        showRealTimeWeather();

        inputCity.value = '';
    }
});

window.onload = () => {
    showForecast();
    showRealTimeWeather();
}
