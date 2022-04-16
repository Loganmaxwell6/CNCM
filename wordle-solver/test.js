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
function add(a, b){
    let carry = 0;
    let str = "";
    for (let i = 0; i < Math.max(Math.floor(Math.log10(a)) + 1, Math.floor(Math.log10(b)) + 1); i++){
        str = (((a % (10**(i+1))) + (b % (10**(i+1))) + carry) % (10**(i+1))).toString()[0] + str;
        carry = Math.floor(((a % (10 ** (i+1))) + (b % (10 ** (i+1))) + carry) / (10 ** (i+1)));
    }
    if (carry > 0){
        str = carry.toString() + str;
    }
    return parseInt(str);
}
memo = [0, 1, 1]
function fib(n){
    if (memo[n] === undefined) memo[n] = add(fib(n-1), fib(n-2))
    return memo[n];
}
// start = performance.now()
// for (let i = 0; i < 10; i++){
//     fib(i);//console.log(i + ": " + fib(i))
// }
// console.log("Array: " + (performance.now() - start) / 1000);

// memo = {[0]: 0, [1]: 1, [2]: 1};
// start = performance.now()
// for (let i = 0; i < 10; i++){
//     fib(i);//console.log(i + ": " + fib(i))
// }
// console.log("Dictionary: " + (performance.now() - start) / 1000);