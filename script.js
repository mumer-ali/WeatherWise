import codes from './data.js';
const degree = "\u00B0";
function weatherApi(city) {
    // Weather API
    const weatherApiKey = "d7b0543c695c44c5af2151610240103";
    return `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=5&aqi=no&alerts=no`;
}
const geolocationApi = (latitude, longitude) => {
    // // Geolocation API
    const geoApiKey = "bdc_0c260dc9261a46649e540124d4e42ba6";
    return `https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${geoApiKey}`;
};
const getCity = async (geoApi) => {
    let response = await fetch(geoApi);
    let data = await response.json();
    return data["city"];
};
const getData = async (dataApi) => {
    let response = await fetch(dataApi);
    let data = await response.json();
    return data;
};
const locBtn = document.querySelector("#location-btn");
locBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        const result = document.querySelector("#entered-city");
        result.value = "";
        navigator.geolocation.getCurrentPosition((position) => {
            const geoApi = geolocationApi(position.coords.latitude, position.coords.longitude);
            const cityPro = getCity(geoApi);
            cityPro
            .then((result) => {
                const dataApi = weatherApi(result);
                getData(dataApi)
                .then((result) => {
                    parseCurrent(result);
                    parseFore(result);
                })
                .catch((error) => {
                    alert(`Error: ${error.code}`);
                });
            })
            .catch((error) => {
                alert(`Error: ${error.code}`);
            });
        });
    } else { 
        alert("Geolocation is not supported");
    }
});
const searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener("click", () => {
    const result = document.querySelector("#entered-city").value;
    const dataApi = weatherApi(result);
    getData(dataApi)
    .then((result) => {
        parseCurrent(result);
        parseFore(result);
    })
    .catch((error) => {
        alert(`Error: ${error.code}`);
    });
});
const parseCurrent = (data) => {
    let code = data["current"]["condition"]["code"];
    let icon = "";
    for (let obj of codes) {
        if (obj["code"] === code) {
            icon = obj["icon"];
            break;
        }
    }
    document.querySelector("#city-name").innerText = data["location"]["name"];
    document.querySelector("#today-date").innerText = data["location"]["localtime"].slice(0, 10);
    document.querySelector("#img-today").setAttribute("src", `weather/day/${icon}.png`);
    document.querySelector("#img-today").style.visibility = "visible";
    document.querySelector("#today-temp").innerText = `Temperature: ${data["current"]["temp_c"]} ${degree}C`;
    document.querySelector("#today-wind").innerText = `Wind: ${data["current"]["wind_kph"]} km/h`;
    document.querySelector("#today-hum").innerText = `Humidity: ${data["current"]["humidity"]} %`;
}
const parseFore = (data) => {
    for (let i = 1; i < 5; i++) {
        document.getElementById(`${i}-date`.toString()).innerText = data["forecast"]["forecastday"][i]["date"];
        document.getElementById(`${i}-temp`.toString()).innerText = `Temperature: ${data["forecast"]["forecastday"][i]["day"]["avgtemp_c"]} ${degree}C`;
        document.getElementById(`${i}-wind`.toString()).innerText = `Wind: ${data["forecast"]["forecastday"][i]["day"]["maxwind_kph"]} %`;
        document.getElementById(`${i}-hum`.toString()).innerText = `Humidity: ${data["forecast"]["forecastday"][i]["day"]["avghumidity"]} %`;
        let code = data["forecast"]["forecastday"][i]["day"]["condition"]["code"];
        console.log(code);
        let icon = "";
        for (let obj of codes) {
            if (obj["code"] === code) {
                icon = obj["icon"];
                break;
            }
        }
        document.getElementById(`${i}-img`.toString()).setAttribute("src", `weather/day/${icon}.png`);
        document.getElementById(`${i}-img`.toString()).style.visibility = "visible";
    }
}