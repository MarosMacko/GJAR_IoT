function graf1 (teplota, humidity, light) {
        this.teplota = teplota;
        this.humidity = humidity;
        this.light = light;
    }

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://iot.gjar-po.sk/api/v1/view",
    "method": "POST",
    "dataType": "json",
    "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache",
    },
    "processData": false,
    "data": "{\"room\":0}"
}

$.ajax(settings).done(function getdata (response) {
        graf1.teplota = response.data[0].temperature;
        graf1.light = response.data[0].noise;
        graf1.humidity = response.data[0].humidity;
        document.getElementById('room1_temp').innerHTML = graf1.teplota;
        document.getElementById('room1_humidity').innerHTML = graf1.humidity;
        document.getElementById('room1_light').innerHTML = graf1.light;
});







