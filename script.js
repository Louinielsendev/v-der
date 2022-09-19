var weatherResponse
var cityValue
var value
var searchbtn
var dateIndex = 0
var HTMLcodeExpand = ""
var dayExpand





// init function
function init() {

	searchbtn = document.querySelector('#searchbtn')
	dayExpand = document.getElementsByClassName('daycover')
	logo = document.querySelector('.logo')
	weatherResponses = document.getElementById("cityname")
	cityValue = document.getElementById("cityInput")
	searchbtn.addEventListener("click", cityName)

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

// Get city coordinates
function getLonLat(value) {
	let request = new XMLHttpRequest(); // Object för Ajax-anropet
	request.open("GET", "http://api.positionstack.com/v1/forward?access_key=8d0c94662b432799b80e393e1b1de914&query=" + value + "", true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (request.readyState == 4)
			if (request.status == 200) lonLatResponse(request.responseText);
			else return;
	};
}
// Save coordinates in variabels
function lonLatResponse(response) {
	response = JSON.parse(response);
	if (response.data[0] == undefined) {
		document.getElementById('daycover').innerHTML = ""
		document.querySelector('#cityname').innerHTML = ""
		document.getElementById('top').innerHTML = "<h1>Tyvärr, platsen finns inte. Sök efter en plats inom Sverige!</h1><img src='img/error.svg' alt=''>"
		return;
	}
	let lat = response.data[0].latitude
	let lon = response.data[0].longitude
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
				document.getElementById('forecastcover').innerHTML = ""
				document.querySelector('#cityname').innerHTML = ""
				document.getElementById('top').innerHTML = "<h1>Tyvärr, platsen finns inte. Sök efter en plats inom Sverige!</h1><img src='img/error.svg' alt=''>"
			}
	};
}
// Print weather report 
function weatherResponse(response) {
	document.getElementById('top').innerHTML = ""
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
			HTMLcode += "<div class=daycover><div class=day><div><img class=weatherImg src=img/" + icon + ".png alt=><div class=date><h2 class=dag>" + weekday + "</h2><p class=month>" + currentDate + "</p></div></div><div><img class=icon src=img/temp.svg alt=><h3 class=temp>" + tempreture + "°C</h3></div><div><img class=icon src=img/rain.svg alt=><h3>" + rain + "mm</h3></div><div><img class=icon src=img/wind.svg alt=><h3>" + wind + "m/s</h3></div></div><div class=expand ><hr>" + HTMLcodeExpand + "</div></div>"
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
