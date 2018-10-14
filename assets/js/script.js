/***********************contacting the server******************************************/



/***************************************scroll function**************************************/
var destination;

function scrollToProject(e) {
    destination = document.getElementById(e).offsetTop;
    window.scroll({
        behavior: 'smooth',
        top: destination,
    });
}

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



//main chart ukazka

var myChart = document.getElementById('myChart').getContext('2d');

Chart.defaults.global.defaultFontColor = 'black';

var barChart = new Chart(myChart, {
    type: 'line',
    data: {
        labels: ['1am', '2am', '3am', '4am', '5am', '6am'],
        datasets: [{
            label: 'Temperature',
            data: [1, 13, 15, 18, 24, 22, 30, ],
            fill: false,
            borderWidth: 4,
            borderColor: 'rgb(20, 89, 197)',
        }, {
            label: 'Humidity',
            data: [60, 70, 50, 40, 60, 10, 20],
            fill: false,
            borderWidth: 4,
            borderColor: 'orange',
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
            display: true,
            text: 'Temperature and Humidity',
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
