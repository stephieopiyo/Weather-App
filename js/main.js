//check service worker support
if ('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker
    .register("../sw.js")
    .then(reg => console.log('Service worker: Registered'))
    .catch(err => console.log(`Service worker: ${err}`));
  });
}


//DOM ELEMENTS
const search = document.getElementById('searchBar');
const searchBtn = document.querySelector('.searchBtn');
const localDate = document.querySelector('.date p');
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temp-value p');
const descriptionElement = document.querySelector('.temp-description p');
const locationElement = document.querySelector('.location p');
const maxTemp = document.querySelector('.max-temp p');
const minTemp = document.querySelector('.min-temp p');
const windElem = document.querySelector('.wind');
const humidityElem = document.querySelector('.humidity');
const errorNotification = document.querySelector('.errorNotification');

//Api key
const key = '271d184e62d8de934ed004e8740eef84';


const kelvin = 273;

window.addEventListener("load", function(e){
  e.preventDefault();
  if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  }
  else{
    errorNotification.style.display = 'block';
    errorNotification.innerHtml = "<p>Browser does not support the Geolocation Api</p>";
  }

  function showPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
  
    getWeather(latitude, longitude);
  }

  function showError(error){
    errorNotification.style.display = 'block';
    errorNotification.innerHtml = `<p>${error.message}</p>`;
  }

  function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  
    fetch(api)
    .then(function(response){
      let data = response.json();
      return data;
    })
    .then(function(data){
      displayWeather(data);
    })
    .catch(function(error){
      console.log(error);
    });
  }


  function displayWeather(data) {
    const {name,weather, wind, sys, main, dt} = data;
    iconElement.innerHTML = `<img src="icons/${weather[0].icon}.png">`;
    tempElement.innerHTML= Math.floor(main.temp-kelvin) + '<span>°C</span>';
    descriptionElement.textContent = weather[0].description;
    locationElement.textContent  = `${name}, ${sys.country}`;
    localDate.textContent = dateBuilder(dt);
    maxTemp.innerHTML = Math.floor(main.temp_max-kelvin) + '<span>°C</span>';
    minTemp.innerHTML = Math.floor(main.temp_min-kelvin) + '<span>°C</span>';
    windElem.textContent = wind.speed;
    humidityElem.textContent = main.humidity;
  }


 searchBtn.addEventListener('click', function getCity(e){
    e.preventDefault();
    let url= `http://api.openweathermap.org/data/2.5/weather?q=${search.value}&appid=${key}`;

    fetch(url)
      .then(function(response){
      let data = response.json();
      return data;
    })
    .then(function(data){
      displayWeather(data);
    })
    .catch(function(error){
      console.log(error);
    });
  });

});

function dateBuilder(dt){
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let date = new Date (dt*1000);
 
  let day = days[date.getDay()];
  let dateNumber = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
 
  return `${day}, ${dateNumber}, ${month}, ${year}`;
}

function saveToLocalStorage(){
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem('weatherInfo', JSON.stringify(data));
    } else {
    alert('No web storage support');
}

}
