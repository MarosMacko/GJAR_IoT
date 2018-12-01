function openNav() {
    document.getElementById('m_menu').style.width = '250px';
}

function closeNav() {
    document.getElementById("m_menu").style.width = "0";
}

var activeroom = 16;
var active_miestnost = document.getElementById('active_miestnost');
active_miestnost.innerHTML = 'Byt (29)';

function activeroomf(e) {
    activeroom = e;
    if(activeroom == 16) {
        active_miestnost.innerHTML = 'Byt (29)';
    } else if (activeroom == 53) {
        active_miestnost.innerHTML = 'Inf kabinet (53)';
    } else if (activeroom == 61) {
        active_miestnost.innerHTML = 'III.A (61)';
    } else if (activeroom == 70) {
        active_miestnost.innerHTML = 'Kniznica (70)';
    } else if (activeroom == 71) {
        active_miestnost.innerHTML = 'Aj 1 (71)';
    } else if (activeroom ==77) {
        active_miestnost.innerHTML = 'Nj 2 (77)';
    } else if (activeroom == 83) {
        active_miestnost.innerHTML = 'Bio kabinet (83)';
    } else if (activeroom == 0) {
         active_miestnost.innerHTML = 'VI.OA (84)';
    } else {
        active_miestnost.innerHTML = 'error';
    }
    barChart.destroy()
    call_on_server();
}
/*
!!!! spojazdnit call na server za poslednych 6hodin
var d = new Date();
var n = d.getHours() - 6;
*/
function call_on_server() {
    var data;
    var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://iot.gjar-po.sk/api/v1/view",
    "method": "POST",
    "dataType": "json",
    "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache",
    },
    "processData": false,
    "data": "{\"room\":" + activeroom  + ", \"time\": {\"time-from\": \"2018-01-01 00:00:00\", \"time-to\": \"2019-01-01 00:00:00\"}}"  
    }

    $.ajax(settings).done(getdata);  
}

var room, activetemp, activehum, activelight, teploty, vlhkosti

function getdata (response) {
        time = [];
        teploty = [];
        vlhkosti = [];
        brighteness = [];

        for(i = 0; i < response.data.length; i ++) {
            teploty.push(response.data[i].temperature);
            vlhkosti.push(response.data[i].humidity);
            time.push(response.data[i].time);
            brighteness.push(response.data[i].brightness);
        }

            active_hodnota = response.data.length - 1;
    
            document.getElementById('temp_1').innerHTML = teploty[active_hodnota] + '°C';
            document.getElementById('time_1').innerHTML = time[active_hodnota];
            document.getElementById('humidity_1').innerHTML = vlhkosti[active_hodnota];
            document.getElementById('light_1').innerHTML = brighteness[active_hodnota];       
    
        usedata();
}

var myChart = document.getElementById('myChart1').getContext('2d');
                Chart.defaults.global.defaultFontColor = 'black';


var barChart;

function usedata() {
        barChart = new Chart(myChart, {
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
            data: brighteness,
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
                fontSize: 20,
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
                        max: 275,
                    }
                 }],
        },
    }
});
/*barChart.update( )*/
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

document.querySelector(".dropbtn1").addEventListener("click", function () {
    document.querySelector(".dropdown-content1").classList.toggle("display");
    document.querySelector('.sipka').classList.toggle('rotate');
})

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
window.addEventListener('mouseup', function(event) {
    
    var menu = document.getElementById("m_menu");
    
    if(event.target != menu && event.target.parentNode != menu) {
        document.getElementById("m_menu").style.width = "0";
    }
})

call_on_server();