var chart = new Chart('freqChart', {
    type: "bar",
    data: {
        labels: alpha,
        datasets: [{
            label: 'All Words',
            data: allWordsLetterFreq,
            backgroundColor : 'rgba(153, 102, 255, 0.6)'
        },{
            label: 'Train Words',
            data: trainWordsLetterFreq,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
    },
    options: {
        legend: {
            display: false
        }
    }
});