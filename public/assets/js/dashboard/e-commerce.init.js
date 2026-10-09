/*
Template Name: Urbix - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: E-Commerce init js
*/
function renderCharts() {
  // Average line
  if (!document.querySelector("#average-line")) return;
  var options = {
    series: [
      {
        name: "Current Year",
        data: []
      },
      {
        name: "Prior Year",
        data: []
      }
    ],
    chart: {
      height: 380,
      type: "area",
      toolbar: { show: false }
    },
    colors: ["#5b66eb", "#ffc107"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    grid: { show: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov"],
      axisBorder: { show: false },
    },
    yaxis: {
      categories: ["$200", "$400", "$600", "$800", "$1k", "$1.2K", "$1.4K"],
      axisBorder: { show: false },
    },
    tooltip: { theme: "dark" }
  };

  var chart = new ApexCharts(document.querySelector("#average-line"), options);
  chart.render();


  // Average bar
  var options = {
    series: [{
      name: 'Current Year',
      data: []
    }, {
      name: 'Prior Year',
      data: []
    }],
    chart: {
      type: 'bar',
      height: 350
    },
    colors: ["#5b66eb", "#ffc107"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    fill: {
      opacity: 1
    },
  };

  var chart = new ApexCharts(document.querySelector("#average-bar"), options);
  chart.render();

  if (document.getElementById("gridjs_sort-table")) {
    new gridjs.Grid({
      columns: [
        { name: 'Date', formatter: (cell) => gridjs.html(`<span class="text-muted">${cell}</span>`) },
        { name: 'Type', formatter: (cell) => gridjs.html(`<span class="text-muted">${cell}</span>`) },
        { name: 'Montant', formatter: (cell) => gridjs.html(`<span class="text-muted">${cell}</span>`) }
      ],
      sort: true,
      data: []
    }).render(document.getElementById("gridjs_sort-table"));
  }

  // product-statistics
  var options = {
    series: [76, 67, 61],
    chart: {
      height: 330,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        track: {
          margin: 10,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          }
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: '16px',
          formatter: function (seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
          },
        },
      }
    },
    colors: ['#5b66eb', '#ffc107', '#dc3545'],
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          show: false
        }
      }
    }]
  };

  var chart = new ApexCharts(document.querySelector("#product-statistics"), options);
  chart.render();

}

setTimeout(() => {
  renderCharts();
}, 250);