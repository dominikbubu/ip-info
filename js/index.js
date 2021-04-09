window.addEventListener('load', function() {
		fetch("https://api.ip2loc.com/dQXI9koZ2Si4DOhmOxVphdjt1IMDJ8d2/detect")
		.then(response => response.json())
		.then(data => {
		
		let ip = document.getElementById('ip'),
			continent = document.getElementById('continent'),
			currency = document.getElementById('currency'),
			country = document.getElementById('country'),
			city = document.getElementById('city')
			timezone = document.getElementById('timezone');

			ip.innerHTML = data.connection.ip;
			continent.innerHTML = data.location.continent.name;
			currency.innerHTML =  data.currency.code[0];
			country.innerHTML = data.location.country.name;
			city.innerHTML = data.location.city;
			timezone.innerHTML = data.time.zone;
	});
});

const input = document.getElementById('other-input-ip');

input.addEventListener('keypress', function getIpInfo(e) {
	if(e.key === "Enter") {
		const ip = input.value;

		fetch(`https://json.geoiplookup.io/${ip}`)
		.then(response => response.json()).catch()
		.then(data => {
			console.log(data)

		let other_ip = document.getElementById('other-ip') 
		other_continent = document.getElementById('other-continent'),
		other_currency = document.getElementById('other-currency'),
		other_country = document.getElementById('other-country'),
		other_city = document.getElementById('other-city')
		other_timezone = document.getElementById('other-timezone'),
		other_asn = document.getElementById('other-asn'),
		other_isp = document.getElementById('other-isp'),
		other_host = document.getElementById('other-host');

		other_ip.innerHTML = data.ip;
		other_continent.innerHTML = data.continent_name;
		other_currency.innerHTML =  data.currency_code;
		other_country.innerHTML = data.country_name;
		other_timezone.innerHTML = data.timezone_name;
		other_asn.innerHTML = data.asn;
		other_isp.innerHTML = data.isp;
		other_host.innerHTML = data.hostname;
		});
	} else{
		return
	};
});
