function cleanText(text){
    a = [];
    b= {};
    c = [];
    for (let i = 0; i < text.length; i++){
        char = text[i];
        if (char.toUpperCase() in alphaDict) {
            if (char == char.toUpperCase()){
                c.push(true);
            }else{
                c.push(false)
            }
            a.push(alphaDict[char.toUpperCase()]);
        }else{
            b[i] = char;
        }
    }
    return [a,b,c]
}

function updateText(){
    clean = cleanText(textIn.value)
    globalText = clean[0];
    globalGrammar = clean[1];
    globalLetterCase = clean[2]
}

function determineCipher(text = globalText.slice(0, globalText.length)){
    let c = chiTest(text);
    if (c < 120){
        return "Transposition";
    }
    let i = indexOfCoincidence(text);
    if (i >= 0.064 && i <= 0.069){
        return "Substitution"; //placeholder until we narrow down substitution ciphers
    }
    let k = getKeyLength(text)
    if (k != 0){
        return "Vigenere"
    }
    return "idk lol";
}

function indexOfCoincidence(text){
    let o = observedCount(text);
    let n = 0;
    let sum = 0;
    for (let i = 0; i < 26; i++){
        sum += o[i] * (o[i] - 1);
        n += o[i];
    }
    let N = (n * (n - 1))/26;
    return (sum / N) / 26;
}

function chiTest(text){
    let o = observedCount(text);
    let e = expectedCount(text.length);
    let sum = 0;
    for(let i = 0; i < 26; i++){
        sum += chiHelper(o[i],e[i]);
    }
    return Math.sqrt(sum);
}

function chiHelper(o,e){
    return (o - e)**2/e;
}

function observedCount(text){
    let o = {};
    for (let i = 0; i < 26; i++){
        o[i] = 0;
    }
    for (let i = 0; i <text.length; i++){
        o[text[i]] ++;
    }
    return o;
}

function expectedCount(t){
    let e = [];
    for(a in ALPHA){
        e.push(check[ALPHA[a]] * t);
    }
    return e;
}

function getKeyLength(text){
    let limit = 16;
    let keyLength = 0; 
    let highestAvg = 0;
    let ioc = 0;
    for (let step = 2; step < limit; step++){
        let sum = 0;
        let allVals = returnEveryNth(text, step);     
        for (i of allVals){
            sum += indexOfCoincidence(i);
        }
        let avg = sum/step;
        if ((avg > ioc && avg > 0.55|| avg > 0.055 && step > keyLength) && (avg > highestAvg)){
            highestAvg = avg;
            keyLength = step;
        }
    }
    return keyLength;
}

function returnEveryNth(text, step){
    let allVals = [];
    for (let x = 0; x < step; x++){
        allVals.push([])
    }
    for (let i =0; i < text.length; i++){
        allVals[i %step].push(text[i])
    }
    return allVals;
}

function observedBigramCount(text){
    let o = [];
    for (let i = 0; i < 676; i++){
        o.push(0);
    }
    for (let i = 0; i < text.length-1; i++){
        let p = text.slice(i, i+2)
        o[(p[0] * 26) + (p[1])]++;
    }
    return o;
}

function expectedBigramCount(t){
    let e = [];
    for (let a = 0; a < ALPHA.length; a++){
        for (let b = 0; b < ALPHA.length; b++){
            e.push(bigrams[(a * 26) + b] * t);
        }
    }
    return e;
}

function bigramTest(text, cutOff = 2000){
    text = text.slice(0,Math.min(text.length, cutOff));
    let o = observedBigramCount(text);
    let e = expectedBigramCount(text.length);
    let sum = 0;
    for (let i = 0; i < 676; i++){
        sum += chiHelper(o[i],e[i]);
    }
    return Math.sqrt(sum);
}