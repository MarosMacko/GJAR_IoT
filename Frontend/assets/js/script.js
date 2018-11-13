/***********************contacting the server******************************************/





/***************************************scroll function**************************************/

$("#scrollToTop").click(function() {
    $('html, body').animate({
        scrollTop: parseInt(0)
    }, 500);
});
/*
var destination;

function scrollToProject(e) {
    destination = document.getElementById(e).offsetTop;
    window.scroll({
        behavior: 'smooth',
        top: destination,
    });
}
*/
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

function grafukazka () {
    var myChart = document.getElementById('myChart').getContext('2d');
Chart.defaults.global.defaultFontColor = 'black';
var barChart = new Chart(myChart, {
    type: 'line',
    data: {
        labels: ['1am', '2am', '3am', '4am', '5am', '6am'],
        datasets: [{
            label: 'Teplota',
            data: [7, 13, 15, 18, 24, 22, 30, ],
            fill: false,
            borderWidth: 4,
            borderColor: 'rgb(20, 89, 197)',
        }, {
            label: 'Vlhkost',
            data: [60, 70, 50, 40, 60, 10, 20],
            fill: false,
            borderWidth: 4,
            borderColor: 'orange',
        },{
            label: 'Svietivost',
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

window.addEventListener('mouseup', function(event) {
    
    var menu = document.getElementById("m_menu");
    
    if(event.target != menu && event.target.parentNode != menu) {
        document.getElementById("m_menu").style.width = "0";
    }
})
grafukazka();


