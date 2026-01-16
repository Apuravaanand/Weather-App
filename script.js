const weaterForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

const apikey = "ff91f563511bbdd7507cccfdf78ed00a";

weaterForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError("Please enter a valid city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("City not found");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {
        name,
        main: { temp, humidity },
        weather
    } = data;

    console.log(name + "\n" + temp + "\n" + humidity + " ");
    const tempC = (temp - 273.15).toFixed(1);

    card.style.display = "block";
    card.innerHTML = `
        <h1 class="cityDisplay">${name}</h1>
        <p class="tempDisplay">${tempC}°C</p>
        <p class="humidityDisplay">Humidity : ${humidity}%</p>
        <p class="desDisplay">${weather[0].description}</p>
        <p class="weatherEmoji">${getWeatherEmoji(weather[0].id)}</p>
    `;
}

function getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return "⛈️";
    if (weatherId >= 300 && weatherId < 500) return "🌦️";
    if (weatherId >= 500 && weatherId < 600) return "🌧️";
    if (weatherId >= 600 && weatherId < 700) return "❄️";
    if (weatherId >= 700 && weatherId < 800) return "🌫️";
    if (weatherId === 800) return "☀️";
    if (weatherId > 800) return "☁️";
    return "❓";
}

function displayError(message) {
    card.style.display = "block";
    card.innerHTML = `<p class="errorDisplay">${message}</p>`;
}
