var weatherResponse
var cityValue
var value
var searchbtn
var dateIndex = 0
var HTMLcodeExpand = ""
var dayExpand
var error

// init function
function init() {

	searchbtn = document.querySelector('#searchbtn')
	dayExpand = document.getElementsByClassName('daycover')
	logo = document.querySelector('.logo')
	weatherResponses = document.getElementById("cityname")
	cityValue = document.getElementById("cityInput")
	searchbtn.addEventListener("click", cityName)
	error = document.querySelector('#top')

}

window.addEventListener("load", init)
// Get the city name from the input tag
function cityName() {
	value = cityValue.value
	getLonLat(value)
}
// Prints city name on website
function printName(value) {
	String(value)
	let city = value.charAt(0).toUpperCase() +
		value.slice(1).toLowerCase()
	document.querySelector('#cityname').innerHTML = city
}

function errorMessage() {
	document.getElementById('forecastcover').innerHTML = ""
	document.querySelector('#cityname').innerHTML = ""
	error.innerHTML = "<h1>Tyvärr, något gick fel!</h1><img src='img/error.svg' alt=''>"
}

// Get city coordinates
function getLonLat(value) {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'ed86ccbbd2msh29e85e8dad6a702p1d6dbajsnfdfa0e3774c7',
			'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
		}
	};

	fetch('https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q='+value+'&accept-language=en&polygon_threshold=0.0', options)
		.then(response => response.json())
		.then(response => lonLatResponse(response))
		
}
// Save coordinates in variabels
function lonLatResponse(response) {
	console.log(response)
	if (response === undefined) {
		errorMessage()
		return
	}

	let lat = response[0].lat
	let lon = response[0].lon
	
	lat = parseFloat(lat);
	lon = parseFloat(lon);
	lat = lat.toFixed(6)	
	lon = lon.toFixed(6)	
	console.log(lat)
	
	requestWeatherResponse(lat, lon)
}
// Get Weather report 
function requestWeatherResponse(lat, lon) {

	let request = new XMLHttpRequest(); // Object för Ajax-anropet
	request.open("GET", "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" + lon + "/lat/" + lat + "/data.json", true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (request.readyState == 4)
			if (request.status == 200) weatherResponse(request.responseText);
			else {
				errorMessage()
			}
	};
}
// Print weather report 
function weatherResponse(response) {
	error.innerHTML = ""
	printName(value)
	response = JSON.parse(response);
	let HTMLcode = ""
	for (let i = 0; i < response.timeSeries.length; i++) {
		let day = response.timeSeries[i]
		let time = day["validTime"]
		const dayTime = "12:00"
		if (i == 2 || time.includes(dayTime) && i > 14) {
			expandDay(i, response)
			let date = time.slice(0, 10)
			let dateSeperator = date.replace(/-/g, ",")
			let d = new Date(dateSeperator)
			let text = d.toString();
			let weekday = text.slice(0, 3)
			let currentDate = text.slice(4, 11)
			let parameters = day.parameters
			parameters.sort(compare);
			let icon = parameters[18].values[0]
			let tempretureDecimal = parameters[12].values[0]
			let wind = parameters[17].values[0]
			let rain = parameters[7].values[0]
			let tempreture = Math.trunc(tempretureDecimal)
			HTMLcode += "<div class=daycover><div class=day><div><img class=weatherImg src=img/" + icon + ".png alt=><div class=date><h2 class=dag>" + weekday + "</h2><p class=month>" + currentDate + "</p></div></div><div><img class=icon src=img/temp.svg alt=><h3 class=temp>" + tempreture + "°C</h3></div><div><img class=icon src=img/rain.svg alt=><h3>" + rain + "mm</h3></div><div><img class=icon src=img/wind.svg alt=><h3>" + wind + "m/s</h3></div></div><div class=expand >" + HTMLcodeExpand + "</div></div>"
		}

	}
	document.querySelector('#forecastcover').innerHTML = HTMLcode

	const dayHeader = document.querySelectorAll('.dag')
	dayHeader[0].innerHTML = "Just nu"
	dayHeader[1].innerHTML = "Imorgon"
	dayExpand = document.getElementsByClassName("day");
	for (let i = 0; i < dayExpand.length; i++) {
		dayExpand[i].addEventListener("click", expandDayForecast)
	}

}


function expandDay(dayIndex, response) {
	let day = response.timeSeries[dayIndex]
	let time = day["validTime"]
	let date = time.slice(0, 10)
	HTMLcodeExpand = ""

	for (let i = 0; i < response.timeSeries.length; i++) {
		let dayCheck = response.timeSeries[i]
		let timeCheck = dayCheck["validTime"]

		if (timeCheck.includes(date)) {
			let currentTime = timeCheck.slice(11, 16)
			let parameters = dayCheck.parameters
			parameters.sort(compare);
			let icon = parameters[18].values[0]
			let tempretureDecimal = parameters[12].values[0]
			let wind = parameters[17].values[0]
			let rain = parameters[7].values[0]
			let tempreture = Math.trunc(tempretureDecimal)
			HTMLcodeExpand += "<div class=dayPart><div><h3 class=time>" + currentTime + "</h3><img src=img/" + icon + ".png alt=></div><div><img class=icon src=img/temp.svg alt=><h3 class=temp>" + tempreture + "°C</h3></div><div><img class=icon src=img/rain.svg alt=><h3>" + rain + "mm</h3></div><div><img class=icon src=img/wind.svg alt=><h3>" + wind + "m/s</h3></div></div>"

		}
	}
	return HTMLcodeExpand
}

// Sort an array with objects by name
function compare(a, b) {
	const dayA = a.name.toUpperCase();
	const dayB = b.name.toUpperCase();
	let comparison = 0;
	if (dayA > dayB) {
		comparison = 1;
	} else if (dayA < dayB) {
		comparison = -1;
	}
	return comparison;
}

function expandDayForecast() {
	this.classList.toggle("active");
	var content = this.nextElementSibling;
	if (content.style.display === "block") {
		content.style.display = "none";
	} else {
		content.style.display = "block";
	}
}
