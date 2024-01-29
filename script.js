let yourWeather = document.querySelector('.your-weather');
let searchWeather = document.querySelector('.search-weather');
let searchBox = document.querySelector('.search-box');
let locationAccess = document.querySelector('.access-location');
let userWeather = document.querySelector('.user-weather');
let loadingBox = document.querySelector('.loading-box');
let errBox = document.querySelector('.err-box');
let customerr = document.querySelector('.custom-err');
let sBTN = document.querySelector('.s-btn');

let API_KEY = '11be61f1c320d777e9fc0d03a43b72b5';

let currentTab = yourWeather;
currentTab.classList.add('switch-active');
locationAccess.classList.add('active')


// ================================================================
let dataCity = '';

async function apiCall(dataCity) {

    if (dataCity == '') {
        alert('Enter any City Name');
    }
    else {
        searchBox.classList.remove('active');
        locationAccess.classList.remove('active');
        userWeather.classList.remove('active');
        loadingBox.classList.add('active');
        errBox.classList.remove('active');

        try {
            let find = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${dataCity}&appid=${API_KEY}&units=metric`);
            let actualValue = await find.json();

            console.log(actualValue)

            if (actualValue?.name == undefined) {
                searchBox.classList.remove('active');
                locationAccess.classList.remove('active');
                userWeather.classList.remove('active');
                loadingBox.classList.remove('active');
                errBox.classList.add('active');
            }
            else {
                errBox.classList.remove('active');
                loadingBox.classList.remove('active');
                userWeather.classList.add('active');
                searchBox.classList.add('active');
                locationAccess.classList.remove('active');

                displayGUI(actualValue);
            }
        }
        catch (err) {
            errBox.classList.add('active');
        }

    }

}



// ================================================================


function switchTab(clickTab) {
    if (currentTab != clickTab) {
        currentTab.classList.remove('switch-active');
        currentTab = clickTab;
        currentTab.classList.add('switch-active');

        if (clickTab == searchWeather) {
            if (!searchBox.classList.contains('active')) {
                searchBox.classList.add('active');
                locationAccess.classList.remove('active')
                userWeather.classList.remove('active');
                loadingBox.classList.remove('active');
                errBox.classList.remove('active');

                searchBox.addEventListener('input', (val) => {
                    dataCity = val.target.value
                    console.log(dataCity)
                })

                sBTN.addEventListener('click', () => {
                    apiCall(dataCity);
                });
            }
        }
        else {
            searchBox.classList.remove('active');
            locationAccess.classList.add('active')
            userWeather.classList.remove('active');
            loadingBox.classList.remove('active');
            errBox.classList.remove('active');

            checkLocation();
        }
    }
}

yourWeather.addEventListener('click', () => {
    switchTab(yourWeather);
})

searchWeather.addEventListener('click', () => {
    switchTab(searchWeather);
})

let localCordinates = '';

function checkLocation() {
    localCordinates = sessionStorage.getItem('user-cordinates');
    if (!localCordinates) {
        searchBox.classList.remove('active');
        locationAccess.classList.add('active')
        userWeather.classList.remove('active');
        loadingBox.classList.remove('active');
        errBox.classList.remove('active');
    }
    else {
        let cordinates = JSON.parse(localCordinates);
        getweatherinfo(cordinates);
    }
}



async function getweatherinfo(cordinates) {
    let { lat, lon } = cordinates;
    
    locationAccess.classList.remove('active');
    loadingBox.classList.add('active');

    console.log(lat, lon)

    try {
        let api = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        let resp = await api.json();

        locationAccess.classList.remove('active');
        loadingBox.classList.remove('active');
        userWeather.classList.add('active');

        displayGUI(resp);

    }
    catch (err) {
        errBox.classList.add('active');
    }
}

function displayGUI(resp) {
    let temp = document.querySelector('.temp');
    let maxTemp = document.querySelector('.max-temp');
    let minTemp = document.querySelector('.min-temp');
    let cityName = document.querySelector('.cityName');
    let date = document.querySelector('.date');
    let time = document.querySelector('.time');
    let desc = document.querySelector('.desc');
    let windSpeed = document.querySelector('.Wind-speed');
    let Humidity = document.querySelector('.Humidity');
    let clouds = document.querySelector('.clouds');
    let rain = document.querySelector('.rain');

    temp.innerText = resp?.main?.temp;
    maxTemp.innerText = resp?.main?.temp_max;
    minTemp.innerText = resp?.main?.temp_min;
    Humidity.innerText = resp?.main?.humidity;
    cityName.innerHTML = resp?.name;
    desc.innerText = resp?.weather[0]?.description;
    clouds.innerText = resp?.clouds?.all;
    rain.innerText = resp?.sys?.country;
    windSpeed.innerText = resp?.wind?.speed;

    const today = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    date.innerText = today.toLocaleDateString('en-US', options);

    setInterval(function () {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();

        let dddd = `Current Time: ${hours}:${minutes}:${seconds}`;
        time.innerText = dddd
    }, 1000);

}


let access = document.querySelector('.grant-access-btn');
access.addEventListener('click', getlocation);

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert('Location are not supported');
    }
}

function showPosition(position) {
    const userCordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-cordinates", JSON.stringify(userCordinates));
    getweatherinfo(userCordinates);
}

