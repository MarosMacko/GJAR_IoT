

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

$.ajax(settings).done(function (response) {
  console.log(response);
    var teplota = data[0].temperature
});






var destination;
    
function scrollToProject (e) {
    destination = document.getElementById(e).offsetTop;
    window.scroll({
        behavior: 'smooth',
        top: destination,
    });
}

window.onscroll = function () {scrollToTopButtonDisplay()};

function scrollToTopButtonDisplay () {
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById('scrollToTop').style.display = 'inline-block';
    } else {
        document.getElementById('scrollToTop').style.display = 'none';
    };
}











//temperature chart

var myChart = document.getElementById('myChart').getContext('2d');

Chart.defaults.global.defaultFontColor = 'black';

var barChart = new Chart(myChart, {
    type: 'line',
    data: {
        labels: ['1am', '2am', '3am', '4am', '5am', '6am'],
        datasets: [{
            label: 'Temperature',
            data: [1, 13, 15, 18, 24, 22, 30,],
            fill: false,
            borderWidth: 4,
            borderColor: 'rgb(20, 89, 197)',
        }, {
            label: 'Humidity',
            data: [60, 70, 50, 40, 60, 10, 20],
            fill: false,
            borderWidth: 4,
            borderColor: 'orange',
        }, {
            label: 'Light',
            data: [15, 20, 30, 40, 50, 60, 70],
            fill: false,
            borderWidth: 4,
            borderColor: 'lightgreen',
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Temperature, Light and Humidity',
            fontSize: 25,
        },
        legend: {
            position: 'bottom'
        },
        hover: {
            mode: 'index',
        },
        scales: {
                     yAxes: [
                            {
                            ticks: {
                                min: 0,
                                max: 100,
                                userCallback: function(value, index, values) {
                                // Convert the number to a false string and splite the string every 3 charaters from the end
                                value = value.toString();
                                value = value.split(/(?=(?:...)*$)/);

                                // Convert the array to a false string and format the output
                                value = value.join(' ');
                                return value;
                                },
                                callback: function(value, index, values) {
                                return value.toExponential();
                                }
                            }
                            }
                    ],

    },
}});










