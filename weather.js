const API_KEY = CONFIG.API_KEY;

async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    console.log("Geolocation error:", error);
                    resolve({
                        lat: 42.3505,
                        lon: -71.1054
                    });
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            resolve({
                lat: 42.3505,
                lon: -71.1054
            });
        }
    });
}

async function fetchWeather() {
    try {
        const coords = await getLocation();
        const location = coords.lat + "," + coords.lon;
        console.log("Location: " + location);

        const q = location;
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${q}&aqi=no`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const weather = {
            location: data.location.name,
            temp_f: data.current.temp_f,
            condition: data.current.condition.text,
            icon: data.current.condition.icon
        };
        
        document.getElementById("location").innerText = weather.location;
        document.getElementById("temperature").innerText = weather.temp_f + "°F";
        document.getElementById("condition").innerText = weather.condition;
        document.getElementById("icon").src = "https:" + weather.icon;
        document.getElementById("icon").style.display = "block";
    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById("location").innerText = "Error loading location";
        document.getElementById("temperature").innerText = "Error loading temperature";
        document.getElementById("condition").innerText = "Error loading condition";
    }
}

document.addEventListener("DOMContentLoaded", fetchWeather);