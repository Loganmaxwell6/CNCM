/*
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
*/

function score(word1, word2){
    let match = [0, 0, 0, 0, 0];
    for (let a = 0; a < 5; a++){
        for (let b = 0; b < 5; b++){
            if (word1[a] == word2[b]){
                match[a] += 1;
                if (a == b){
                    match[a] += 1;
                }
            }
        }
    }
    return match;
}

for (let i = 0; i < allWordsLen; i++){
    let firstWord = allWords[i];
    for (let j = 0; j < trainWordsLen; j++){
        let trainWord = trainWords[j];
        let match = score(firstWord, trainWord);
        
    }
}