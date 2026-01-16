const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

const apiKey = "ff91f563511bbdd7507cccfdf78ed00a";

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    displayError("Please enter a valid city");
    return;
  }

  try {
    const data = await getWeatherData(city);
    displayWeatherInfo(data);
  } catch (error) {
    displayError(error.message);
  }
});

async function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await fetch(url);

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

function getWeatherEmoji(id) {
  if (id >= 200 && id < 300) return "⛈️";
  if (id >= 300 && id < 500) return "🌦️";
  if (id >= 500 && id < 600) return "🌧️";
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫️";
  if (id === 800) return "☀️";
  if (id > 800) return "☁️";
  return "❓";
}

function displayError(message) {
  card.style.display = "block";
  card.innerHTML = `<p class="errorDisplay">${message}</p>`;
}

const sentences = [
  "Enter city name Delhi",
  "Try Mumbai, London",
  "Search weather of Muzaffarpur",
  "also for Bongaigaon"
];

let sentenceIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

const TYPE_SPEED = 100;
const DELETE_SPEED = 50;
const PAUSE = 1200;

function placeholderTypingLoop() {
  if (isPaused) return;

  const current = sentences[sentenceIndex];

  if (!isDeleting) {
    cityInput.placeholder = current.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === current.length) {
      setTimeout(() => (isDeleting = true), PAUSE);
    }
  } else {
    cityInput.placeholder = current.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      sentenceIndex = (sentenceIndex + 1) % sentences.length;
    }
  }

  setTimeout(
    placeholderTypingLoop,
    isDeleting ? DELETE_SPEED : TYPE_SPEED
  );
}

placeholderTypingLoop();

cityInput.addEventListener("focus", () => {
  isPaused = true;
  cityInput.placeholder = "";
});

cityInput.addEventListener("blur", () => {
  if (!cityInput.value.trim()) {
    isPaused = false;
    charIndex = 0;
    isDeleting = false;
    placeholderTypingLoop();
  }
});
