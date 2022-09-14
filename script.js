var weatherResponse 
var cityvalue 
var logo


// init function
function init(){
	logo = document.querySelector('.logo')
 	weatherResponses = document.getElementById("cityname")
 	cityvalue = document.getElementById("cityInput")
	logo.addEventListener("click", cityName)
	cityvalue.addEventListener("keypress", function(event) {
		// If the user presses the "Enter" key on the keyboard
		if (event.key === "Enter") {
		  // Cancel the default action, if needed
		  event.preventDefault();
		  // Trigger the button element with a click
		  cityName()
		}
	  });
	  
}

window.addEventListener("load", init)
// Get the city name from the input tag
function cityName() {
	value = cityvalue.value
	printName(value)
	getLonLat(value)
}
// Prints city name on website
function printName(value){
	String(value)
	let city = value.charAt(0).toUpperCase() +
    value.slice(1).toLowerCase()
	document.querySelector('#cityname').innerHTML = city
}

// Get city coordinates
function getLonLat(value) {
	let request = new XMLHttpRequest(); // Object för Ajax-anropet
	request.open("GET","http://api.positionstack.com/v1/forward?access_key=8d0c94662b432799b80e393e1b1de914&query=" + value + "",true);
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
	let lat = response.data[0].latitude
	let lon = response.data[0].longitude
	requestWeatherResponse(lat, lon)
}
// Get Weather report 
function requestWeatherResponse(lat, lon) {
	let request = new XMLHttpRequest(); // Object för Ajax-anropet
	request.open("GET","https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" + lon + "/lat/" + lat + "/data.json",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (request.readyState == 4)
			if (request.status == 200) weatherResponse(request.responseText);
			else document.innerHTML = "Den begärda resursen finns inte.";
	};
}
// Print weather report 
function weatherResponse(response){
response = JSON.parse(response);
let HTMLcode = ""
console.log(response)
for (let i = 0; i < 74; i++){
	let day = response.timeSeries[i]
	let time = day["validTime"]
	const dayTime = "12:00"
	if (i == 2 || time.includes(dayTime) && i > 14) {
		let date = time.slice(0, 10)
		let dateSeperator = date.replace(/-/g, ",")
		let d = new Date(dateSeperator)
		let text = d.toString();
		let weekday = text.slice(0, 3)
		let currentDate = text.slice(4, 11)
		console.log(d)
		let parameters = day.parameters
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
		parameters.sort(compare);
		let icon = parameters[18].values[0]
		let tempreture = parameters[12].values[0]
		let wind = parameters[17].values[0]
		let rain = parameters[7].values[0]
		HTMLcode += "<div class=day><div><img src=img/" + icon + ".png alt=><div><h2 class=dag>" + weekday + "</h2><p>"+ currentDate +"</p></div></div><div><div><h3>" + tempreture +"°C</h3></div></div><div><div><h3>" + rain + "mm</h3></div></div><div><div><h3>" + wind + "m/s</h3></div></div></div>"
		}
	}
	document.getElementById('daycover').innerHTML = HTMLcode
	
	const dayHeader = document.querySelectorAll('.dag')
	dayHeader[0].innerHTML = "Idag"
	dayHeader[1].innerHTML = "Imorgon"

	


}








	