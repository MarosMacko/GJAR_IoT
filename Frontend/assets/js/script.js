$("#scrollToTop").click(function() {
    $('html, body').animate({
        scrollTop: parseInt(0)
    }, 500);
});

window.onscroll = function () {
    scrollToTopButtonDisplay()
};

function scrollToTopButtonDisplay() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById('scrollToTop').style.display = 'inline-block';
        document.getElementById('topScroll').classList.add('active');
    } else {
        document.getElementById('scrollToTop').style.display = 'none';
        document.getElementById('topScroll').classList.remove('active');
    };
}

function openNav() {
    document.getElementById('m_menu').style.width = '250px';
}

function closeNav() {
    document.getElementById("m_menu").style.width = "0";
}

window.addEventListener('mouseup', function(event) {
    
    var menu = document.getElementById("m_menu");
    
    if(event.target != menu && event.target.parentNode != menu) {
        document.getElementById("m_menu").style.width = "0";
    }
})
let activeroom = 16;
//main chart ukazka
async function getData(room) {
    try {
        const rawdata = await fetch(`http://iot.gjar-po.sk/api/v1/view`, {
        method: 'POST',
        headers: {"content-type": "application/json", "cache-control": "no-cache"},
        body: "{\"room\":" + room  + ", \"time\": {\"time-from\": \"2018-01-01 00:00:00\", \"time-to\": \"2020-01-01 00:00:00\"}}",
        });
        const data = await rawdata.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}

getData(activeroom).then(data => {
    processData(data);
    showGraph();
});

graph = document.getElementById('graph').getContext("2d");

const values = {
    temperature: [],
    humidity: [],
    brightness: [],
    times: [],
};

function processData(data) {
    const response = data;
    response_length = response.data.length;
    for(let i = response.data.length - 1; i > response_length - 7; i--) {
        values.temperature.unshift(response.data[i].temperature);
        values.humidity.unshift(response.data[i].humidity);
        values.brightness.unshift(response.data[i].brightness);
        values.times.unshift((response.data[i].time).split(" ", 2)[1]);
    }
}


function showGraph() {
        barChart = new Chart(graph, {
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
            title: {
                display: true,
                text: `Miestnosť č.${/*activeroom*/26}`, //TODO po oprave na 26 prepnut
                fontSize: 25,
            },
            legend: {
            position: 'bottom'
            },
            hover: {
                mode: 'index',
            },
    }
});
}