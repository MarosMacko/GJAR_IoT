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

var data;

async function call_on_server() {
    try {
        const rawdata = await fetch(`http://iot.gjar-po.sk/api/v1/view`, {
        method: 'POST',
        headers: {"content-type": "application/json", "cache-control": "no-cache"},
        body: "{\"room\":" + activeroom  + ", \"time\": {\"time-from\": \"2018-01-01 00:00:00\", \"time-to\": \"2020-01-01 00:00:00\"}}",
        });
        data = await rawdata.json();
        processData();
    } catch (error) {
        alert(error);
    }
}

var room, activetemp, activehum, activelight, teploty, vlhkosti

let values;

function processData() {
    values = {
        temperature: [],
        humidity: [],
        brightness: [],
        times: [],
        last_time: undefined,
    };
    const response = data;
    response_length = response.data.length;
    let pocet_hodnot = 15;
    if(response_length < 16) {
        pocet_hodnot = response_length;
    }
    if(response_length > 1) {
        for(let i = response.data.length - 1; i > response_length - pocet_hodnot; i--) {
            values.temperature.unshift(response.data[i].temperature);
            values.humidity.unshift(response.data[i].humidity);
            values.brightness.unshift(response.data[i].brightness);
            values.times.unshift((response.data[i].time).split(" ", 2)[1]);
        }
        values.last_time = response.data[(response_length - 1)].time;
    }
    updateValues();
    usedata();
}

const strings = {
    temp: '#temp_1',
    hum: '#humidity_1',
    brig: '#light_1',
    time: '#time_1',
};
function updateValues() {
    //todo => spravit na querySelectorAll
    const val = [document.querySelector(strings.temp), document.querySelector(strings.hum), document.querySelector(strings.brig), document.querySelector(strings.time)];
    val[0].innerHTML = values.temperature[values.temperature.length - 1] + '°C';
    val[1].innerHTML = values.humidity[values.humidity.length - 1] + '%';
    val[2].innerHTML = values.brightness[values.brightness.length - 1] + '%';
    val[3].innerHTML = values.last_time;
}

var myChart = document.getElementById('graph').getContext('2d');



var barChart;

function usedata() {
        barChart = new Chart(myChart, {
            type: 'line',
            data: {
                    labels: values.times,
            datasets: [{
            label: 'Teplota',
            data: values.temperature,
            fill: false,
            borderWidth: 4,
            borderColor: 'rgb(20, 89, 197)',
            }, {
            label: 'Vlhkosť',
            data: values.humidity,
            fill: false,
            borderWidth: 4,
            borderColor: 'orange',
            },{
            label: 'Svietivosť',
            data: values.brightness,
            fill: false,
            borderWidth: 4,
            borderColor: 'lightgreen',
            }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            legend: {
            position: 'bottom'
            },
            hover: {
                mode: 'index',
            },
    }
});
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
