function openNav() {
    document.getElementById('m_menu').style.width = '250px';
}

function closeNav() {
    document.getElementById("m_menu").style.width = "0";
}


var activeroom = "{\"room\":0}"
















var data;
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
    "data": activeroom,
    "data": "{\"room\":0, \"time\": {\"time-from\": \"2018-01-01 00:00:00\", \"time-to\": \"2019-01-01 00:00:00\"}}"
}

$.ajax(settings).done(getdata);


var room, activetemp, activehum, activelight, teploty, vlhkosti








function getdata (response) {
    
    
    function active_room (e) {
            activetemp = response.data.temperature;
            activehum = response.data[e].humidity;
            activelight = response.data[e].noise;
    }
    
        time = [];
        teploty = [];
        vlhkosti = [];
        for(i = 0; i < 3; i++) {
            teploty.push(response.data[i].temperature);
            vlhkosti.push(response.data[i].humidity);
            time.push(response.data[i].time);
        }
        
        
    
    
        data = response
        usedata();
}


function usedata() {
        var myChart = document.getElementById('myChart1').getContext('2d');
                Chart.defaults.global.defaultFontColor = 'black';
        var barChart = new Chart(myChart, {
            type: 'line',
            data: {
                    labels: time,
            datasets: [{
            label: 'Teplota',
            data: teploty,
            fill: false,
            borderWidth: 4,
            borderColor: 'rgb(20, 89, 197)',
            }, {
            label: 'Vlhkosť',
            data: vlhkosti,
            fill: false,
            borderWidth: 4,
            borderColor: 'orange',
            },{
            label: 'Svietivosť',
            data: [22, 35, 27, 14, 12, 45, 60, ],
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
                text: 'Teplota, Vlhkosť a Svietivosť',
                fontSize: 25,
            },
            legend: {
            position: 'bottom'
            },
            hover: {
                mode: 'index',
            },
            scales: {
            yAxes: [ {ticks: {
                        min: 0,
                        max: 100,
                    }
                 }],
        },
    }
});
}


function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function myFunction1() {
    document.getElementById("myDropdown1").clasName.display.toggle = 'block';
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
