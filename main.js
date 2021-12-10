// Crooked Nazgul Code Men 2021

//--------------------------------------------------

// times
// caesar decrypt - 0.0003s
// affine decrypt - 0.0478s
// transposition simple decrypt - 0.48786s
// substitution automatic decrypt - 0.133s
//--------------------------------------------------

// global variables
var selectedCipher
var key = null;
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const d = new Date();

currentButton = "";
numthing = 0;

//--------------------------------------------------

// site startup stuff
function init(){
    initiateFrequencyTable();
    frequencyTable = document.getElementById("frequencyTable");
    IoC = document.getElementById("IoC");
    Chi = document.getElementById("Chi");
    fullLen = document.getElementById("fullLen");
    Len = document.getElementById("Len");
    likely = document.getElementById("likely");
    Time = document.getElementById("Time");
    textIn = document.getElementById("textIn");
    textOut = document.getElementById("textOut");
    encryptInputBox = document.getElementById("encryptInputBox");
}

function initiateFrequencyTable(){
    for (let i = 0; i < 13; i++){
        frequencyTable.insertRow(i+1).outerHTML = "<tr><td>"+ALPHA[i]+"</td><td id='"+ALPHA[i] +"'>0</td><td>"+ALPHA[i+13]+"</td><td id='"+ALPHA[i+13] +"'>0</td></tr>";
    }
}

function updateFrequencyTable(){
    let freq = observedCount(globalText);
    for (let i = 0;i < 26; i ++){
        document.getElementById(ALPHA[i]).innerHTML = freq[i];
    }
}

function updateDataValues(){
    if (globalText.length > 1){
        IoC.innerHTML = Number(Math.round(indexOfCoincidence(globalText)+'e4')+'e-4');
        Chi.innerHTML = Number(Math.round(chiTest(globalText)+'e2')+'e-2');
    }else{
        IoC.innerHTML = 0;
        Chi.innerHTML = 0;
    }
    fullLen.innerHTML = textIn.value.length;
    Len.innerHTML = globalText.length;
    likely.innerHTML = determineCipher();
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function rand(s, e){
    if (s == 0){
        return (Math.floor(Math.random() * e+1));
    }
    else{
        return (Math.floor(Math.random() * (e-s)) + s);
    }
}

function updateText(){
    clean = cleanText(textIn.value)
    globalText = clean[0];
    globalGrammar = clean[1];
    globalLetterCase = clean[2]

    updateFrequencyTable();
    updateDataValues();
}

function input(f){
    textOut.value = "";
    if(!(textIn.value) == ''){
        let s = Date.now();
        let out = f();
        let e = Date.now();
        Time.innerHTML = (e - s) + "ms";
        return out;
    }else{
        alert("Enter text into input box first")
    }
}

function output(text){
    text = addGrammar(text).map((char, index) => index in globalGrammar ? globalGrammar[index] : ALPHA[char]).join("");
    text = "Key : " + key + "\n\n" + text;
    if(!(textOut.value == text)){
        textOut.value += text + "\n";
    }
    setKey();
}

function addGrammar(text){
    for (let [key, value] of Object.entries(globalGrammar)){
        text.splice(key, 0, value);
    }
    return text;
}

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

//--------------------------------------------------

// clear input and output
function clearText(){
    textOut.value = ""
    textIn.value = ""
    updateText();
}

// make input text backwards
function reverseText() {
    textIn.value = textIn.value.split("").reverse().join("");
    updateText();
}

function copyText() {
    var copyText = textOut;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value.slice(findTextOutBreakPoint()+1));
    alert("Copied the text");
}

function swapText(){
    textIn.value = textOut.value.slice(findTextOutBreakPoint()+1);
    textOut.value = ""
    updateText();
}

function closeCipherDropdown(){
    document.getElementById("cipherDropdownMenu").classList.remove("show");
}

function openCipherDropdown(){
    let d = document.getElementById("cipherDropdownMenu");
    if (d.classList.contains("show")){
        d.classList.remove("show");
    }
    else{
        d.classList.add("show");
    }
}

function closeStyleDropdown(){
    document.getElementById("styleDropdownMenu").classList.remove("show");
}

function openStyleDropdown(){
    let d = document.getElementById("styleDropdownMenu");
    if (d.classList.contains("show")){
        d.classList.remove("show");
    }
    else{
        d.classList.add("show");
    }
}

function setStyle(style){
    var root = document.querySelector(':root');

    switch(style) {
        case "biStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("bi-flag");
            root.style.setProperty('--highlight', 'rgba(116,77,152,1)');
            root.style.setProperty("--highlightdark", '#5F3F7D');
            break;

        case "prideStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("pride-flag");
            root.style.setProperty('--highlight', 'rgba(0,121,64,1)');
            root.style.setProperty("--highlightdark", 'rgba(1, 87, 47, 1)');
            break;

        case "panStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("pan-flag");
            root.style.setProperty('--highlight', 'rgba(1,148,252,1)');
            root.style.setProperty("--highlightdark", 'rgba(0, 87, 150, 1)');
            break;
        case "transStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("trans-flag");
            root.style.setProperty('--highlight', 'rgba(247,168,184,1)');
            root.style.setProperty("--highlightdark", 'rgba(196, 133, 146, 1)');
    }
}


function findTextOutBreakPoint(){
    let findBreakText = textOut.value.split("");
    let num = 0;
    for (let i = 0 ; i < findBreakText.length; i++){
        if(findBreakText[i] == '\n'){
            num ++;
        }
        if (num == 2){
            return i;
        }
    }
    return 0;
}

//--------------------------------------------------

// store the selected cipher for global access
function setCipher(cipher){
    selectedCipher = cipher;
}

function setKey(){
    key = encryptInputBox.value;
}

function changeKeyInput(){
    switch(selectedCipher){
        case "caesar":
            encryptInputBox.placeholder = "Shift of n = ...";
            break;
        case "affine":
            encryptInputBox.placeholder = "Shift of ax + b (a,b = ...)";
            break;
        case "substitutionA":
            encryptInputBox.placeholder = "No key needed (encrypt generates random key)...";
            break;
        case "substitutionM":
            encryptInputBox.placeholder = "Map chars a:b,c:d etc.";
            break;    
        case "transpositionS":
            encryptInputBox.placeholder = "Cols order 1,2,3 etc. (for encrypt)"
            break;
        case "transpositionC":
            encryptInputBox.placeholder = "No key needed...";
            break;
        case "vigenere":
            encryptInputBox.placeholder = "Keyword = ...";
            break;
        case "keyword":
            encryptInputBox.placeholder = "Keyword = ...";
            break;
        case "polybius":
            encryptInputBox.placeholder = "String of 25 characters...";
            break;
        case "determine":
            encryptInputBox.placeholder = "No key needed...";
            break;
        default:
            alert("Something gone big wrong :(");
    }

}

// encrypt
function encrypt(){
    if (selectedCipher == "determine"){
        eval(selectedCipher + "Cipher")();
    }
    else{
        var f = eval(selectedCipher + "Encrypt");
        output(input(f));
    }
}

// decrypt
function decrypt(){
    if (selectedCipher == "determine"){
        eval(selectedCipher + "Cipher")();
    }else{
        var f = eval(selectedCipher + "Decrypt");
        output(input(f));
    }
}

//--------------------------------------------------

const caesarShift = (text, shift) => text.map((char) => (char + shift) % 26);

function affineShift(text,num,num2){
    let multis ={0:'1',1:'9',2:'21',3:'15',4:'3',5:'19',6:'7',7:'23',8:'11',9:'5',10:'17',11:'25'};
    return text.map((char) => (multis[num-1]*mod(char-num2,26))%26);
}

const affineShiftEncrypt = (text, num1, num2) => text.map((char)=> ((char*num1)+num2)%26);

//code for substitution
function substitutionCipher(text=globalText.slice(0)){
    let freq = findMostLikely(text, ALPHA.length).map((char)=> parseInt(char[0]));
    let key = new Array(ALPHA.length).fill(0);
    for (i in key){
        key[freq[i]] = mostLikelyNum[i];
    }
    let bigramFreq = observedBigramCount(text);
    let score = bigramTestForSub(bigramFreq, key, text.length);
    for (let i =0; i < 100; i++){
        let newKey = fullSwapTest(bigramFreq, key, text.length, score, freq);
        if (newKey == -1){
            break;
        }else{
            key = newKey[0].slice(0);
            score = newKey[1];
        }
    }
    //key = substitutionAnnealing(bigramFreq, key, text.length, score);
    return applySubstitutionKey(text, key);
}

function bigramTestForSub(freq, key, length){
    let sum = 0;
    for (i in freq){
        sum += (freq[i] - (bigrams[key[Math.floor(i / 26)] * 26 + key[i % 26]]*length)) ** 2; 
    }
    return sum;
}

function fullSwapTest(freq, key, length, keyScore){
    function s(score, freq, key, length, a, b){
        let testKey = key.slice(0);
        let firstLetter = testKey[a];
        testKey[a] = testKey[b];
        testKey[b] = firstLetter;
        for (let k = 0; k < key.length; k ++) {
            var changes = [k * 26 + a, k * 26 + b, a * 26 + k, b * 26 + k];
            for (i of changes){
                score -= (freq[i] - (bigrams[key[Math.floor(i / 26)] * 26 + key[i % 26]]*length)) ** 2;
                score += (freq[i] - (bigrams[testKey[Math.floor(i / 26)] * 26 + testKey[i % 26]]*length)) ** 2;
            }
        }
        return [testKey,score];
    }
    for (let i = 0; i < key.length; i++){
        for (let x = i; x < key.length; x++){
            if (!(i == x)){
                let test = s(keyScore, freq, key, length, i, x);
                let score = test[1];
                if (score < keyScore){
                    testKey = test[0];
                    return [testKey,score];
                }
            }
        }
    }
    return -1;
}

function substitutionAnnealing(freq, key, length, keyScore){
    function s(score, freq, key, length, a, b){
        let testKey = key.slice(0);
        let firstLetter = testKey[a];
        testKey[a] = testKey[b];
        testKey[b] = firstLetter;
        for (let k = 0; k < key.length; k ++) {
            var changes = [k * 26 + a, k * 26 + b, a * 26 + k, b * 26 + k];
            for (i of changes){
                score -= (freq[i] - (bigrams[key[Math.floor(i / 26)] * 26 + key[i % 26]]*length)) ** 2;
                score += (freq[i] - (bigrams[testKey[Math.floor(i / 26)] * 26 + testKey[i % 26]]*length)) ** 2;
            }
        }
        return [testKey,score];
    }
    let best = [-1,100000000]
    let temp = 50;
    for (let k = 0; k < 50; k++){
        let n = 0;
        for ( j = 0; j < 100 * key.length; j++){
            let a = rand(0,key.length - 1);
            let b = rand(0, key.length - 1);
            while(b == a){
                b = rand(0, key.length - 1);
            }
            let score = s(keyScore, freq, key, length, a, b);
            if (Math.random() <= Math.exp((score[1] - keyScore) / temp) || score > keyScore){
                key = score[0];
                keyScore = score[1];
                n ++;
                if (keyScore < best[1]){
                    best[0] = key;
                    best[1] = score;
                }
                if (n > 10 * key.length){
                    break;
                }
            }
        }
        if (n = 0){
            return key;
        }
    }
    return best[0];
}

applySubstitutionKey = (text, key) => text.map((char)=> key[char]);

function findMostLikely(text, accuracy){
    count = observedCount(text);
    a= [];
    for(const [key, value] of Object.entries(count)){
        a.push([key,value])
    }
    a = a.sort(function(a,b) {
        return b[1]-a[1]
    });
    return a.slice(0,accuracy);
}

function transpositionHillClimb(text, length){
    function s(key){
        return bigramTest(applyTranspositionKey(text, key));
    }
    let key = decryptTransposition(text, length);
    let best = [key, s(key)];

    let check = false;
    while(!check){
        check = true;
        for (let i = 0; i < key.length; i++){
            for (let x = i; x < key.length; x++){
                if (!(i == x)){
                    let testKey = best[0].slice(0, best[0].length);
                    if (Math.random() > 0.5){
                        [testKey[i], testKey[x]] = [testKey[x], testKey[i]];
                    }else {
                        testKey.unshift(testKey.pop());
                    }
                    
                    let test = s(testKey);
                    if (test < best[1]){
                        check = false;
                        best = [testKey,test];
                    }
                }
            }
        }
    }
    return applyTranspositionKey(text, key);
}

// run the full bigram decrypt cycle for a single keylength
function decryptTransposition(text ,length){
    let columns = returnEveryNth(text, length); //split into columns
    let following = []; // will store 2d array of column and then column that follows it
    var endVal = [-1,0]; //stores the index of the last column
    for (let i =0; i < columns.length; i++){ //loop through each column
        let scores = [];
        for (let x =0; x<columns.length;x++){ //checking each column against current collumn
            if (!(x == i)){ //asserts we are not checking column against the same column
                let sum = 0;
                for( let j = 0; j< columns[i].length; j++){ //generate frequency of bigrams
                    if (!(j >= columns[x].length)){
                        sum += -Math.log(bigrams[(columns[i][j] * 26) + columns[x][j]]);
                    }
                }
                scores.push(sum);//add bigram score to scores
            }else{
                scores.push(100000);//add placeholder number
            }
        }
        following.push([i,scores.indexOf(Math.min.apply(Math, scores))]);
        if (Math.min.apply(Math, scores) > endVal[1]){
            endVal = [i, Math.min.apply(Math, scores)];
        }
    }
    //generates key
    let key = [];
    var currentKey = endVal[0];
    if (!(currentKey == -1)){
        following[currentKey][1] = -1;
        for(let i = 0; i< length; i++){
            key.push(currentKey);
            for (let x =0; x < length; x++){
                if(following[x][1] == currentKey){
                    currentKey = x;
                    break;
                }
            }
        }
        key = key.reverse();
        return key;
    }
    return [...Array(length).keys()];
}

function applyTranspositionKey(text, key){
    let newString = [];
    let columns = returnEveryNth(text, key.length);
    for (let i = 0 ; i < columns[0].length;i++){
        for (let x = 0; x < columns.length; x++){
            newString.push(columns[key[x]][i]);
        }
    }
    return newString;
}

//function for putting columnar transposition text into form of normal transposition cipher
function columnsToTransposition(text, length){
    let num = text.length / length;
    let columns = [];
    for (let i = 0; i < text.length; i++){
        columns.push(text[(i % length) * (num) + Math.floor(i / length)]);
    }
    return columns
}

function putVigenereTogether(text, shifts){
    for (let i = 0; i < text.length; i++){
        text[i] = (text[i] +shifts[i%shifts.length]) % 26;
    }
    return text;
}

function getPolybiusEncryptors(text){
    enc = [];
    for (i of text){
        if (!(enc.includes(i))){
            enc.push(i);
        }
    }
    return enc;
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

// it worky now :)
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

function isEnglish(text, threshold = 85){
    let chiT = 250 - 2 * threshold; 
    if (chiTest(text) < chiT){
        numthing ++;
        return bigramTest(text) < 100;
    }
    return false;
}

//mapping of alpha to f as a index 0 in both etc.
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

//observed - expected ^ 2 / expected
function chiHelper(o,e){
    return (o - e)**2/e;
}

//<150 should be english
function chiTest(text){
    let o = observedCount(text);
    let e = expectedCount(text.length);
    let sum = 0;
    for(let i = 0; i < 26; i++){
        sum += chiHelper(o[i],e[i]);
    }
    return Math.sqrt(sum);
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

//--------------------------------------------------

function caesarEncrypt(text = globalText.slice(0,globalText.length)){
    // with key
    if (!key == ''){
        let thisKey = parseInt(key);
        if (thisKey >= 0){
            key = thisKey;
            return caesarShift(text, parseInt(thisKey));
        }
        else{
            alert("Incorrect key input, using automatic...");
        }
    }

    // keyless
    let n = rand(0,26);
    key = n;
    return caesarShift(text, n);   
}

function caesarDecrypt(text = globalText.slice(0,globalText.length)){
    // with key
    if (!key == ''){
        let n = parseInt(key);
        if (n > 0){
            key = n;
            return caesarShift(text, (26 - mod(n,26)));
        }
        else{
            alert("Incorrect key input, using automatic...");
        }
    }

    // keyless
    for (let i = 0; i < 26; i ++) {
        let t = caesarShift(text, i);
        if (isEnglish(t)){
            key = 26 - i;
            return t;
        }
    }
}

function affineEncrypt(text = globalText.slice(0,globalText.length)){
    //with key
    if (!key == ''){
        let k = key.split("");
        let s = k.indexOf(",");
        k = k.join("");
        let n1 = parseInt(k.substring(0,s));
        let n2 = parseInt(k.substring(s+1));
        if (n1 >= 0 && n2 >= 0){
            key = n1 + "n+" + n2;
            return affineShiftEncrypt(text, n1, n2);
        }
        else{
            alert("Incorrect key input, using automatic...");
        }
    }

    // keyless
    let n1 = rand(0,12) * 2 + 1;
    let n2 = rand(0,26);
    while(n1 == 13){
        n1 = rand(0,12) * 2 + 1;
    }
    key = n1 + "n+" + n2;
    return affineShiftEncrypt(text, n1, n2);
}

function affineDecrypt(text = globalText.slice(0,globalText.length)){
    // with key
    if (!key == ''){
        let k = key.split("");
        let s = k.indexOf(",");
        k = k.join("");
        let n1 = parseInt(k.substring(0,s));
        let n2 = parseInt(k.substring(s+1));
        if (n1 >= 0 && n2 >= 0){
            key = n1 + "n+" + n2;
            return affineShiftEncrypt(text, n1, n2);
        }
        else{
            alert("Incorrect key input, using automatic...");
        }
    }
    
    // keyless 
    for (let i = 1; i < 13; i ++) {
        for (let x = 0; x <26; x++){
            let t = affineShift(text, i, x);
            if (isEnglish(t)){
                key = i + "n+" + x;
                return t;
            }
        } 
    }
    return text;
}

function substitutionAEncrypt(text = globalText.slice(0,globalText.length)){
    //
    if (!key == ''){
        if (key.length <= 26){
            return applySubstitutionKey(text, generateFullKey(key).map((char) => alphaDict[char]));
        }else{
            alert("Incorrect key input, using random key...");
        }
    }

    //keyless
    key = ALPHA.map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value).map((char) => alphaDict[char]);
    return applySubstitutionKey(text, key); //generates random key using ALPHA
}

function substitutionADecrypt(text = globalText.slice(0,globalText.length)){
    //with key
    if (!key == ''){
        return applySubstitutionKey(text, generateFullKey(key).map((char) => alphaDict[char]));
    }
    //keyless - 0.133s
    // for (let i = 0; i < 5; i++){
    //     text =substitutionCipher(text);
    //     if (isEnglish(text)){
    //         return text;
    //     }
    // }
    return substitutionCipher(text);
}

function substitutionMEncrypt(text = globalText.slice(0,globalText.length)){
    // with key
    if (!key == ''){
        let subKey = ALPHA.slice(0).map((char) => alphaDict[char]);
        let thisKey = key.split(",").map((char)=>char.split(":"));
        if(thisKey.every((swap) => swap.length == 2 && swap.every((char)=> char.toUpperCase() in alphaDict))){
            for (pair of thisKey){
                subKey[alphaDict[pair[0].toUpperCase()]] = alphaDict[pair[1].toUpperCase()];
            }
            return applySubstitutionKey(text, subKey);
        };
    }
    return text;
}

function substitutionMDecrypt(text = globalText.slice(0,globalText.length)){
    return substitutionADecrypt(text);
}

function transpositionSEncrypt(text = globalText.slice(0,globalText.length)){
    // with key
    if (!key == ''){
        if (key.split("").every((char) => char.toUpperCase() in alphaDict)){
            let thisKey = key.split("").map((char)=>alphaDict[char.toUpperCase()]);
            if (text.length % thisKey.length ==0){
                return applyTranspositionKey(text, thisKey);
            }else{
                alert("Key length must be a factor of text length, using random key...")
            }  
        }else if (key.split(",").every((char) => parseInt(char) >= 0)){
            let thisKey = key.split(",").map((char)=>parseInt(char));
            if (text.length % thisKey.length ==0){
                return applyTranspositionKey(text, thisKey);
            }else{
                alert("Key length must be a factor of text length, using random key...")
            }  
        }else{
            alert("Incorrect key input, using random key...")
        }
    }

    //keyless
    randNum = rand(5,15);
    key = Array.from(Array(randNum).keys()).map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    text = [...text, ...Array(randNum - (text.length % randNum)).fill(23)]
    return applyTranspositionKey(text, key); //need to add random generating transpo key
}

function transpositionSDecrypt(text = globalText.slice(0,globalText.length)){
    // with key
    if (!key == ''){
        if (key.split("").every((char) => char.toUpperCase() in alphaDict)){
            let thisKey = key.split("").map((char)=>alphaDict[char.toUpperCase()]);
            if (text.length % thisKey.length ==0){
                return applyTranspositionKey(text, thisKey);
            }else{
                alert("Key length must be a factor of text length, using automatic decrypt...")
            }  
        }else if (key.split(",").every((char) => parseInt(char) >= 0)){
            let thisKey = key.split(",").map((char)=>parseInt(char));
            if (text.length % thisKey.length ==0){
                return applyTranspositionKey(text, thisKey);
            }else{
                alert("Key length must be a factor of text length, using automatic decrypt...")
            }  
        }else{
            alert("Incorrect key input, using automatic decrypt...")
        }
    }

    //keyless 
    let correct = [text, 1000000];
    for (let i = 2; i < 20; i++){
        if (true){//text.length % i == 0){
            let s = transpositionHillClimb(text,i);
            if(isEnglish(s)){
                if (bigramTest(s) < correct[1]){
                    correct =[s, bigramTest(s)]
                }
            }
        }
    }
    return correct[0];
}

function transpositionCEncrypt(text = globalText.slice(0,globalText.length)){
    //keyless
    return col
}

function transpositionCDecrypt(text = globalText.slice(0,globalText.length)){
    //keyless
    let correct = [text, 1000000];
    for (let i =2; i < 20; i++){
        if (text.length % i ==0){
            let s = transpositionHillClimb(columnsToTransposition(text, i), i);
            if (isEnglish(s)) {
                if (bigramTest(s) < correct[1]){
                    correct =[s, bigramTest(s)]
                }
            }
        }
    }
    return correct[0];
}

function vigenereEncrypt(text = globalText.slice(0,globalText.length)){
    // with key
    if (!key == ''){
        if (key.split("").every((char) => char.toUpperCase() in alphaDict)){
            return putVigenereTogether(text, key.split("").map((char) => alphaDict[char.toUpperCase()]));
        }else if(key.split(",").every((char) => parseInt(char) >= 0)){
            return putVigenereTogether(text, key.split(",").map((char)=>parseInt(char)))
        }else{
            alert("Enter key with only letters and no spaces e.g. ABCD" );
        } 
    }
    //keyless
    key = Array(rand(10,15)).fill(0)
    key.map((char, index) => key[index] = rand(0,25));
    return putVigenereTogether(text, key);
}

function vigenereDecrypt(text = globalText.slice(0,globalText.length)){
    // with key
    if (!key == ''){
        if (key.split("").every((char) => char.toUpperCase() in alphaDict)){
            return putVigenereTogether(text, key.split("").map((char) => 26 - mod(alphaDict[char.toUpperCase()],26)));
        }else if(key.split(",").every((char) => parseInt(char) >= 0)){
            return putVigenereTogether(text, key.split(",").map((char)=>26 - mod(parseInt(char),26)))
        }else{
            alert("Enter key with only letters and no spaces e.g. ABCD" );
        } 
    }
    //keyless
    let keyLength = getKeyLength(text);
    let allVals = returnEveryNth(text, keyLength);
    let shifts = [];
    for (let i =0; i < allVals.length; i++){
        scores = []
        for(let x =0; x < 26; x++){
                chi = chiTest(caesarShift(allVals[i], x));
                scores.push([x , chi])
        }
        scores = scores.sort(function(a,b) {return a[1]-b[1]});
        shifts.push(scores[0][0]);
    }
    t = putVigenereTogether(text, shifts);
    return t;
}

function keywordEncrypt(text = globalText.slice(0,globalText.length)){
    return substitutionADecrypt(text);
}

function keywordDecrypt(text = globalText.slice(0,globalText.length)){
    return substitutionAEncrypt(text);
}

function polybiusEncrypt(text = globalText.slice(0, globalText.length)){
    key = ALPHA.filter((char) => char != "J").map((char)=>alphaDict[char]);//ALPHA.map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value).map((char) => alphaDict[char]);
    let newText = []
    for(let i = 0; i < text.length; i+=2){
        let charNum = key.indexOf(text[i]);
        newText.push(Math.floor(charNum /5));
        newText.push(charNum % 5);
    }
    return newText;
}

function polybiusDecrypt(text = globalText.slice(0, globalText.length)){
    let newText = [];
    let encryptors = getPolybiusEncryptors(text).sort();
    for (let i = 0; i < text.length -1; i+=2){
        newText.push((encryptors.indexOf(text[i]) * encryptors.length) + encryptors.indexOf(text[i+1]) % 26);
    }
    return substitutionCipher(newText);
}

function morseCodeEncrypt(text=document.getElementById("textIn").split("")){

}

function morseCodeDecrypt(text=document.getElementById("textIn").split("/")){
    console.log(text)
}

function railFenceDecrypt(text=globalText.slice(0)){
    for (let n = 2; n < 20; n++){
        let col = returnEveryNth(text, n);
        for (let i =0; i < text.length; i++){
            
        }
    }
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

//--------------------------------------------

generateFullKey = (str) => [...str, ...ALPHA].filter((char, index, arr) => !arr.slice(0,index).includes(char));

function playfairDecrypt(){

}

function removePlayfairKey(text, key){
    key = generateFullKey(key.toLocaleUpperCase());
    for (let i = 0; i < text.length -1; i+=2) {
        bigram = text[i] + text[i+1];
        point1 = key.indexOf(bigram[0]);
        point2 = key.indexOf(bigram[1]);
        if (point1 %5 == point2%5){
            text[i] = ALPHA[(point1 - 5) % 25];
            text[i+1] = ALPHA[(point2 - 5) % 25];
        }else if(Math.floor(point1 / 5) == Math.floor(point2 / 5)){
            text[i] = ALPHA[(Math.floor(point1 / 5)*5) + mod((point1 -1),5)];
            text[i+1] = ALPHA[(Math.floor(point2 / 5)*5) + mod((point2 -1),5)];
        }else{
            text[i] = ALPHA[point2%5 + (Math.floor(point1 / 5) *5)];
            text[i+1] = ALPHA[point1%5 + (Math.floor(point2 / 5) *5)];
        }
    }
    return text;
}

function playfairEncrypt(){
    key = document.getElementById("encryptInputBox").value.toLocaleUpperCase();
    if (key.length <= 25){
        output(applyPlayfairKey(globalText, key));
    }else{
        alert("playfair encryption key must be 25 or less long");
    }
}

function applyPlayfairKey(text, key){
    key = generateFullKey(key.toLocaleUpperCase());
    for (let i = 0; i < text.length -1; i+=2){
        if (text[i] == text[i+1]){
            text.splice(i+1, 0, "X");
        }
    }
    if (text.length % 2 == 1){
        text.push("X");
    }
    for (let i = 0; i < text.length -1; i+=2) {
        bigram = text[i] + text[i+1];
        point1 = key.indexOf(bigram[0]);
        point2 = key.indexOf(bigram[1]);
        
        if (point1 %5 == point2%5){
            text[i] = key[(point1 + 5) % 25];
            text[i+1] = key[(point2 + 5) % 25];
        }else if(Math.floor(point1 / 5) == Math.floor(point2 / 5)){
            text[i] = key[(Math.floor(point1 / 5)*5) + ((point1 +1)%5)];
            text[i+1] = key[(Math.floor(point2 / 5)*5) + ((point2 +1)%5)];
        }else{
            text[i] = key[point2%5 + (Math.floor(point1 / 5) *5)];
            text[i+1] = key[point1%5 + (Math.floor(point2 / 5) *5)];
        }
    }
    return text;
}

function time(num, f){
    let t = "Considered an invitation do introduced sufficient understood instrument it. Of decisively friendship in as collecting at. No affixed be husband ye females brother garrets proceed. Least child who seven happy yet balls young. Discovery sweetness principle discourse shameless bed one excellent. Sentiments of surrounded friendship dispatched connection is he. Me or produce besides hastily up as pleased. Bore less when had and john shed hope. Demesne far hearted suppose venture excited see had has. Dependent on so extremely delivered by. Yet ﻿no jokes worse her why. Bed one supposing breakfast day fulfilled off depending questions. Whatever boy her exertion his extended. Ecstatic followed handsome drawings entirely mrs one yet outweigh. Of acceptance insipidity remarkably is invitation. Contented get distrusts certainty nay are frankness concealed ham. On unaffected resolution on considered of. No thought me husband or colonel forming effects. End sitting shewing who saw besides son musical adapted. Contrasted interested eat alteration pianoforte sympathize was. He families believed if no elegance interest surprise an. It abode wrong miles an so delay plate. She relation own put outlived may disposed. In by an appetite no humoured returned informed. Possession so comparison inquietude he he conviction no decisively. Marianne jointure attended she hastened surprise but she. Ever lady son yet you very paid form away. He advantage of exquisite resolving if on tolerably. Become sister on in garden it barton waited on. Necessary ye contented newspaper zealously breakfast he prevailed. Melancholy middletons yet understood decisively boy law she. Answer him easily are its barton little. Oh no though mother be things simple itself. Dashwood horrible he strictly on as. Home fine in so am good body this hope. Carriage quitting securing be appetite it declared. High eyes kept so busy feel call in. Would day nor ask walls known. But preserved advantage are but and certainty earnestly enjoyment. Passage weather as up am exposed. And natural related man subject. Eagerness get situation his was delighted. Dispatched entreaties boisterous say why stimulated. Certain forbade picture now prevent carried she get see sitting. Up twenty limits as months. Inhabit so perhaps of in to certain. Sex excuse chatty was seemed warmth. Nay add far few immediate sweetness earnestly dejection.Whether article spirits new her covered hastily sitting her. Money witty books nor son add. Chicken age had evening believe but proceed pretend mrs. At missed advice my it no sister. Miss told ham dull knew see she spot near can. Spirit her entire her called. Is post each that just leaf no. He connection interested so we an sympathize advantages. To said is it shed want do. Occasional middletons everything so to. Have spot part for his quit may. Enable it is square my an regard. Often merit stuff first oh up hills as he. Servants contempt as although addition dashwood is procured. Interest in yourself an do of numerous feelings cheerful confined. She suspicion dejection saw instantly. Well deny may real one told yet saw hard dear. Bed chief house rapid right the. Set noisy one state tears which. No girl oh part must fact high my he. Simplicity in excellence melancholy as remarkably discovered. Own partiality motionless was old excellence she inquietude contrasted. Sister giving so wicket cousin of an he rather marked. Of on game part body rich. Adapted mr savings venture it or comfort affixed friends.";
    t = t.toUpperCase();
    let a = performance.now();
    for (let i =0; i < num; i++){
        f();//t);
    }
    let b = performance.now();
    //console.log(f(t));
    console.log(((b - a) / 1000) / num);
}

function testAccuracy(num, cipher){
    let testTexts = [
            "Considered an invitation do introduced sufficient understood instrument it. Of decisively friendship in as collecting at. No affixed be husband ye females brother garrets proceed. Least child who seven happy yet balls young. Discovery sweetness principle discourse shameless bed one excellent. Sentiments of surrounded friendship dispatched connection is he. Me or produce besides hastily up as pleased. Bore less when had and john shed hope. Demesne far hearted suppose venture excited see had has. Dependent on so extremely delivered by. Yet ﻿no jokes worse her why. Bed one supposing breakfast day fulfilled off depending questions. Whatever boy her exertion his extended. Ecstatic followed handsome drawings entirely mrs one yet outweigh. Of acceptance insipidity remarkably is invitation. Contented get distrusts certainty nay are frankness concealed ham. On unaffected resolution on considered of. No thought me husband or colonel forming effects. End sitting shewing who saw besides son musical adapted. Contrasted interested eat alteration pianoforte sympathize was. He families believed if no elegance interest surprise an. It abode wrong miles an so delay plate. She relation own put outlived may disposed. In by an appetite no humoured returned informed. Possession so comparison inquietude he he conviction no decisively. Marianne jointure attended she hastened surprise but she. Ever lady son yet you very paid form away. He advantage of exquisite resolving if on tolerably. Become sister on in garden it barton waited on. Necessary ye contented newspaper zealously breakfast he prevailed. Melancholy middletons yet understood decisively boy law she. Answer him easily are its barton little. Oh no though mother be things simple itself. Dashwood horrible he strictly on as. Home fine in so am good body this hope. Carriage quitting securing be appetite it declared. High eyes kept so busy feel call in. Would day nor ask walls known. But preserved advantage are but and certainty earnestly enjoyment. Passage weather as up am exposed. And natural related man subject. Eagerness get situation his was delighted. Dispatched entreaties boisterous say why stimulated. Certain forbade picture now prevent carried she get see sitting. Up twenty limits as months. Inhabit so perhaps of in to certain. Sex excuse chatty was seemed warmth. Nay add far few immediate sweetness earnestly dejection.Whether article spirits new her covered hastily sitting her. Money witty books nor son add. Chicken age had evening believe but proceed pretend mrs. At missed advice my it no sister. Miss told ham dull knew see she spot near can. Spirit her entire her called. Is post each that just leaf no. He connection interested so we an sympathize advantages. To said is it shed want do. Occasional middletons everything so to. Have spot part for his quit may. Enable it is square my an regard. Often merit stuff first oh up hills as he. Servants contempt as although addition dashwood is procured. Interest in yourself an do of numerous feelings cheerful confined. She suspicion dejection saw instantly. Well deny may real one told yet saw hard dear. Bed chief house rapid right the. Set noisy one state tears which. No girl oh part must fact high my he. Simplicity in excellence melancholy as remarkably discovered. Own partiality motionless was old excellence she inquietude contrasted. Sister giving so wicket cousin of an he rather marked. Of on game part body rich. Adapted mr savings venture it or comfort affixed friends.",
            "MY DEAREST M,CAN IT REALLY BE SIXTEEN YEARS SINCE CAROLINE FIRST PROPOSED THIS VENTURE? I CANNOT BELIEVE IT AND WISH WITH ALL MY HEART THAT SHE COULD HAVE SEEN HER VISION TAKING SHAPE.LAST WEDNESDAY I TOOK THE OPPORTUNITY YOU SO KINDLY OFFERED TO SEE THE PROGRESS WITH THE FOUNDATION FOR MYSELF. I WAS VERY ENCOURAGED BY THE INDUSTRY ON DISPLAY, HOWEVER I LEFT WITH A CONCERN THAT WE MAY HAVE MISCALCULATED IN OUR PLANS TO HIDE THE FACILITY IN THE BASEMENT OF THE BUILDING. THE VENTILATION THERE WILL, OF NECESSITY, BE FAR MORE RESTRICTED THAN IT WOULD BE ON THE UPPER FLOORS, AS I KNOW FROM MY OWN RESEARCH. THE EVIDENCE FROM YOUR EXPERIMENTS SUGGESTS THAT OUR DEVICE WILL PRODUCE A VERY LARGE AMOUNT OF HEAT IN OPERATION. I CANNOT SAY FOR SURE, BUT IT SEEMS LIKELY THAT THIS WILL CAUSE PROBLEMS, BOTH FOR THE DEVICE ITSELF AND FOR ITS OPERATORS.LOOKING AT THE PLANS, I WONDERED BRIEFLY IF WE COULD HIDE IT INSTEAD ON AN UPPER FLOOR OF THE LIGHTHOUSE, BUT YOU ARE LIKELY TO HAVE MANY VISITORS WHO ARE INCLINED TO CURIOSITY, AND I SUSPECT THE SECRET WOULD NOT STAY SAFE FOR LONG. WE CANNOT TAKE ANY RISK THAT MIGHT EXPOSE US, AND EVEN IF WE KEEP IT BEHIND A LOCKED DOOR, THE NOISE IT WILL GENERATE IN OPERATION WILL PROPAGATE MORE EASILY ACROSS THE WHARF, LEADING TO QUESTIONS. IN THE BASEMENT WE CAN AT LEAST SUPPRESS THE NOISE, REDUCING THAT RISK, BUT THAT LEAVES THE ISSUE OF MANAGING THE HEAT.I AM AT A LOSS. ANY CHANGES WE WANT TO MAKE TO THE DESIGN OF THE LABORATORY AND ITS FACILITIES WILL NEED TO BE MADE VERY SOON, AS ONCE THE UPPER FLOORS ARE BUILT FURTHER HEAVY CONSTRUCTION WOULD ATTRACT UNWANTED ATTENTION. PERHAPS W WILL BE ABLE TO SUGGEST SOMETHING; HE IS, AFTER ALL, AN ENGINEER. IN ANY CASE, I WAS PLANNING TO ASK HIM TO JOIN US AS HEAD OF SECURITY. I UNDERSTAND THAT HE HAS SOME RATHER INTERESTING IDEAS ABOUT CODES AND CIPHERS.ON A LESS PRESSING MATTER, OUR FIRST EXPERIMENTS WITH THE PROTOTYPE ARE SHOWING SOME SUCCESS. IF WE HAD BEEN ABLE TO RUN THEM EARLIER THIS YEAR, WE MAY EVEN HAVE BEEN ABLE TO PROFIT FROM THE SCHLESWIG CONFLICT, AND IT MAY NOT BE TOO LATE TO DO SO IF WE CAN MOBILISE OUR AGENTS. THERE IS MUCH TO PLAY FOR HERE. OTHERS WILL BE SEEKING TO GAIN FROM THE CONFLICT, AND I SEE NO REASON WHY WE CANNOT DO SO TOO.EVER YOURS,FN",
            "HARRY, THANKS FOR YOUR EMAIL, I FORGOT YOU HAD SPENT TIME HERE IN THE ARCHAEOLOGISTS AND IT WAS GOOD TO BE REMINDED THAT IT CAN LEAD SOMEWHERE. IN THIS CASE I THINK THE BEST WE CAN HOPE FOR IS THAT WE WILL HAVE A NEW BUNCH OF RECRUITS TRAINED AND READY TO TACKLE MORE SERIOUS CHALLENGES, BUT I HAVE TO ADMIT THAT I AM GETTING MORE EXCITED ABOUT THIS CASE, EVEN IF IT IS JUST A TRAINING EXERCISE.THE ATTACHED MEMO FROM ABC REINFORCES WHAT WE LEARNED FROM THE LAST ONE. THE LIGHTHOUSE CONSPIRACY SEEMS TO BE A GROUP OF INFLUENTIAL VICTORIANS WHO ARE AIMING TO USE THEIR NEWFOUND TECHNOLOGICAL PROWESS TO PROFIT FROM WAR, FAMINE, PESTILENCE, AND ANY OTHER DISTURBANCE IN THE FORCE. I DON'T LIKE TO JUMP TO CONCLUSIONS, BUT I CAN'T HELP NOTICING THAT THE INITIALS COINCIDE WITH PEOPLE OF INTEREST TO BOSS. I CHECKED FARADAY'S INTELLIGENCE FILE AND AS YOU SAY, IT WAS EMPTY. IT IS HARD TO BELIEVE THAT A SCIENTIST OF HIS EMINENCE HAD ESCAPED NOTICE, SO IT SEEMS MORE LIKELY THAT THE REAL FILE HAS EITHER BEEN DELETED OR STORED SOMEWHERE MORE SECURE. PERHAPS YOU CAN MAKE ENQUIRIES? B MUST SURELY BE BABBAGE. ALL THE TALK IN THE ATTACHED LETTER IS ABOUT A DEVICE THAT SOUNDS LIKE A COMPUTER, AND THAT WOULD MEAN THAT AL IS ADA LOVELACE, WHO DIED SOME YEARS BEFORE THIS LETTER WAS WRITTEN. I CAN'T BE SURE WHO W OR N ARE, BUT MY GUESS IS THAT THIS N IS THE SAME PERSON AS FN IN THE PREVIOUS LETTER. AS FOR ABC, I HAVE A GUESS, BUT IT ALL SEEMS RATHER FANTASTICAL. AL AND B APPEAR IN SOME OF THE EARLIEST BOSS FILES, AND I ALWAYS ASSUMED THEY WERE ON THE SIDE OF THE ANGELS. COULD THEY HAVE BEEN DOUBLE AGENTS WORKING FOR BOSS INSIDE THE CONSPIRACY? GIVEN THAT IT IS THEIR WORK THAT SEEMS TO BE DRIVING IT ON, IT SEEMS MORE LIKELY THAT THE REVERSE IS TRUE. BUT THAT MEANS BOSS WAS RIDDLED WITH DOMESTIC INSURGENTS FROM THE START. I DON'T THINK THIS HAS THE SAME URGENCY AS YOUR DISCOVERY OF SOVIET AGENTS AT THE HEART OF BRITISH INTELLIGENCE, BUT IT IS STILL RATHER ALARMING.AS IS THE INCREASING SOPHISTICATION OF OUR PROTAGONISTS' COMMUNICATIONS. THEY ARE STILL ONLY RELYING ON SUBSTITUTION CIPHERS, BUT THEIR HEAD OF SECURITY, W, IS CLEARLY SMART ENOUGH TO KNOW THAT THIS IS TOO WEAK FOR SERIOUS USE, AND I SUSPECT THAT FUTURE LETTERS WILL BE PROTECTED BY SOMETHING MORE PROFESSIONAL. I WONDER IF HE WILL PUSH THEM TO THINK ABOUT USING POLYALPHABETIC CIPHERS, OR IF HE WILL JUST INTRODUCE SIMPLE CHANGES LIKE BLOCKING THE CIPHERTEXT.I THINK IT MIGHT PAY FOR ME TO MAKE A TRIP TO LONDON TO CARRY OUT SOME ENQUIRIES, SO I MAY BE OFF GRID FOR A COUPLE OF WEEKS. LET ME KNOW IF YOU HEAR ANYTHING USEFUL.ALL THE BEST,JODIE."
    ]
    let numSuccesful = 0;
    for (let x = 0; x < testTexts.length; x ++){
        for (let i = 0; i < num; i ++){
            let e = eval(cipher + "Encrypt")
            key = '';
            let d = eval(cipher + "Decrypt")
            let cText = e(cleanText(testTexts[x])[0]);
            key = '';
            let dec = d(cText.slice(0));
            if (cleanText(testTexts[x])[0].every((char, index) =>char == alphaDict["X"] ? char == dec[index] : true)){
                numSuccesful ++;
            }else{
                console.log(cText.map((char)=> ALPHA[char]).join(""))
            }
        }
    }
    console.log((numSuccesful / (testTexts.length * num))*100);
}

//------------------------------------------------------------
//ffs stupid javascript why do i gotta do this


var morseCodeRef = { 
    '.-':     'a',
    '-...':   'b',
    '-.-.':   'c',
    '-..':    'd',
    '.':      'e',
    '..-.':   'f',
    '--.':    'g',
    '....':   'h',
    '..':     'i',
    '.---':   'j',
    '-.-':    'k',
    '.-..':   'l',
    '--':     'm',
    '-.':     'n',
    '---':    'o',
    '.--.':   'p',
    '--.-':   'q',
    '.-.':    'r',
    '...':    's',
    '-':      't',
    '..-':    'u',
    '...-':   'v',
    '.--':    'w',
    '-..-':   'x',
    '-.--':   'y',
    '--..':   'z',
    '.----':  '1',
    '..---':  '2',
    '...--':  '3',
    '....-':  '4',
    '.....':  '5',
    '-....':  '6',
    '--...':  '7',
    '---..':  '8',
    '----.':  '9',
    '-----':  '0',
};

var bigrams = [
    "0.0003980324",
    "0.0020294455",
    "0.0041406460",
    "0.0034405166",
    "0.0001887000",
    "0.0013187785",
    "0.0020372353",
    "0.0005146171",
    "0.0032318468",
    "0.0002012572",
    "0.0011880571",
    "0.0088368302",
    "0.0036946134",
    "0.0161362431",
    "0.0001733450",
    "0.0019781818",
    "0.0000728628",
    "0.0097946367",
    "0.0087356061",
    "0.0111640000",
    "0.0011295152",
    "0.0019168917",
    "0.0009063007",
    "0.0001528230",
    "0.0026649110",
    "0.0001776911",
    "0.0020506935",
    "0.0001593750",
    "0.0000740912",
    "0.0000327816",
    "0.0045022926",
    "0.0000174259",
    "0.0000093698",
    "0.0000357272",
    "0.0010074776",
    "0.0000653561",
    "0.0000062424",
    "0.0016051893",
    "0.0000443574",
    "0.0000245425",
    "0.0018899522",
    "0.0000266322",
    "0.0000012749",
    "0.0010686733",
    "0.0003260015",
    "0.0000990433",
    "0.0018762791",
    "0.0000277700",
    "0.0000324202",
    "0.0000006986",
    "0.0012099721",
    "0.0000018806",
    "0.0046091962",
    "0.0000689279",
    "0.0006999081",
    "0.0000828919",
    "0.0045797949",
    "0.0000618922",
    "0.0000419946",
    "0.0046559099",
    "0.0019532456",
    "0.0000096033",
    "0.0016662530",
    "0.0013143006",
    "0.0000661271",
    "0.0000434876",
    "0.0061832355",
    "0.0000885550",
    "0.0000364342",
    "0.0012752507",
    "0.0003195114",
    "0.0027493988",
    "0.0010647338",
    "0.0000217903",
    "0.0000594925",
    "0.0000012257",
    "0.0002648664",
    "0.0000133932",
    "0.0040664974",
    "0.0014122429",
    "0.0008747385",
    "0.0009253369",
    "0.0062509333",
    "0.0009328767",
    "0.0005647703",
    "0.0010605063",
    "0.0050123397",
    "0.0001848618",
    "0.0001215838",
    "0.0007055631",
    "0.0008197965",
    "0.0006569006",
    "0.0030342123",
    "0.0007273242",
    "0.0000655193",
    "0.0013186194",
    "0.0024120209",
    "0.0036445899",
    "0.0013554897",
    "0.0002864312",
    "0.0011347523",
    "0.0000063395",
    "0.0005129450",
    "0.0000226723",
    "0.0100204737",
    "0.0022521993",
    "0.0059609240",
    "0.0107878308",
    "0.0042778434",
    "0.0030647167",
    "0.0019163316",
    "0.0017481308",
    "0.0037063924",
    "0.0002906928",
    "0.0005577169",
    "0.0053403249",
    "0.0041962898",
    "0.0113297472",
    "0.0031276101",
    "0.0032432845",
    "0.0003379724",
    "0.0178381361",
    "0.0131981417",
    "0.0076021230",
    "0.0008496812",
    "0.0024453511",
    "0.0034171991",
    "0.0013064745",
    "0.0017410082",
    "0.0001076439",
    "0.0019328589",
    "0.0002053952",
    "0.0003632619",
    "0.0001729891",
    "0.0019724877",
    "0.0014073402",
    "0.0001474882",
    "0.0003486493",
    "0.0027736999",
    "0.0000624091",
    "0.0000529367",
    "0.0006685369",
    "0.0002893790",
    "0.0001235768",
    "0.0043763211",
    "0.0002774768",
    "0.0000109858",
    "0.0019285683",
    "0.0004734865",
    "0.0031673619",
    "0.0007259036",
    "0.0000565860",
    "0.0002326256",
    "0.0000044663",
    "0.0001826868",
    "0.0000072121",
    "0.0025993190",
    "0.0002738996",
    "0.0003005325",
    "0.0002034611",
    "0.0033359381",
    "0.0003388637",
    "0.0003395566",
    "0.0022849461",
    "0.0016426757",
    "0.0000409209",
    "0.0000378874",
    "0.0005959091",
    "0.0002725430",
    "0.0005611372",
    "0.0018937247",
    "0.0002810287",
    "0.0000138178",
    "0.0016165024",
    "0.0009066973",
    "0.0016992999",
    "0.0008714890",
    "0.0000431941",
    "0.0003626144",
    "0.0000034176",
    "0.0002265900",
    "0.0000065942",
    "0.0083188661",
    "0.0002344991",
    "0.0003332596",
    "0.0001916583",
    "0.0232854497",
    "0.0001929369",
    "0.0000993511",
    "0.0003075760",
    "0.0063585867",
    "0.0000439178",
    "0.0000486537",
    "0.0002704518",
    "0.0003128957",
    "0.0003200548",
    "0.0045625445",
    "0.0002263229",
    "0.0000234130",
    "0.0008887343",
    "0.0005693694",
    "0.0019313839",
    "0.0006410148",
    "0.0000456830",
    "0.0003245101",
    "0.0000017405",
    "0.0003345070",
    "0.0000085719",
    "0.0023130703",
    "0.0006009175",
    "0.0049647958",
    "0.0029825175",
    "0.0028920389",
    "0.0013275310",
    "0.0022040453",
    "0.0001412269",
    "0.0001404038",
    "0.0000506757",
    "0.0005978371",
    "0.0041343828",
    "0.0024385083",
    "0.0202755339",
    "0.0049050723",
    "0.0007744038",
    "0.0000674437",
    "0.0027014356",
    "0.0086375754",
    "0.0087736845",
    "0.0001333640",
    "0.0021112308",
    "0.0002132358",
    "0.0002033612",
    "0.0000227470",
    "0.0004314863",
    "0.0003960944",
    "0.0000044818",
    "0.0000057283",
    "0.0000050653",
    "0.0003439648",
    "0.0000029231",
    "0.0000027804",
    "0.0000048472",
    "0.0000826934",
    "0.0000037198",
    "0.0000032300",
    "0.0000028096",
    "0.0000051659",
    "0.0000033422",
    "0.0006293396",
    "0.0000079831",
    "0.0000001670",
    "0.0000186098",
    "0.0000090946",
    "0.0000047196",
    "0.0006763942",
    "0.0000020640",
    "0.0000037194",
    "0.0000001728",
    "0.0000013235",
    "0.0000006612",
    "0.0006551698",
    "0.0001058849",
    "0.0000971333",
    "0.0000642863",
    "0.0024630793",
    "0.0001242660",
    "0.0000483950",
    "0.0001503413",
    "0.0013446311",
    "0.0000177645",
    "0.0000274763",
    "0.0001957178",
    "0.0001123040",
    "0.0004402821",
    "0.0004065562",
    "0.0000868737",
    "0.0000032157",
    "0.0001172537",
    "0.0007463547",
    "0.0003339367",
    "0.0001171607",
    "0.0000169246",
    "0.0001664227",
    "0.0000011755",
    "0.0001279555",
    "0.0000025883",
    "0.0053602293",
    "0.0005697549",
    "0.0005383890",
    "0.0023693978",
    "0.0070264485",
    "0.0006249866",
    "0.0002142564",
    "0.0002946370",
    "0.0053863275",
    "0.0000504985",
    "0.0002692302",
    "0.0056975361",
    "0.0005125921",
    "0.0001739810",
    "0.0036068105",
    "0.0005883168",
    "0.0000178413",
    "0.0003480683",
    "0.0020062894",
    "0.0015765660",
    "0.0010182261",
    "0.0002863669",
    "0.0004247818",
    "0.0000035769",
    "0.0031779890",
    "0.0000132545",
    "0.0050480417",
    "0.0009532012",
    "0.0002547859",
    "0.0001112654",
    "0.0062990119",
    "0.0001653714",
    "0.0000659400",
    "0.0001643948",
    "0.0028141961",
    "0.0000310497",
    "0.0000256794",
    "0.0001106646",
    "0.0008627192",
    "0.0001291352",
    "0.0029950011",
    "0.0018119658",
    "0.0000049393",
    "0.0001527751",
    "0.0009072014",
    "0.0007067196",
    "0.0008685761",
    "0.0000315240",
    "0.0002168347",
    "0.0000032955",
    "0.0004507566",
    "0.0000042254",
    "0.0054456123",
    "0.0008331604",
    "0.0035185414",
    "0.0106829185",
    "0.0063207369",
    "0.0011448165",
    "0.0089191083",
    "0.0009054797",
    "0.0040359824",
    "0.0003105216",
    "0.0007037720",
    "0.0008540416",
    "0.0008780795",
    "0.0011981373",
    "0.0043694616",
    "0.0006864103",
    "0.0000502811",
    "0.0005535405",
    "0.0049273337",
    "0.0117251583",
    "0.0008632034",
    "0.0005075090",
    "0.0009749867",
    "0.0000173085",
    "0.0010044314",
    "0.0000616219",
    "0.0015157325",
    "0.0014367087",
    "0.0017684380",
    "0.0017599419",
    "0.0006050487",
    "0.0070629049",
    "0.0009627666",
    "0.0007526741",
    "0.0012341485",
    "0.0001528822",
    "0.0007857238",
    "0.0031743952",
    "0.0048717699",
    "0.0131622499",
    "0.0023516548",
    "0.0024188588",
    "0.0000283703",
    "0.0105744307",
    "0.0031442791",
    "0.0046455721",
    "0.0071950425",
    "0.0016997679",
    "0.0033788152",
    "0.0001503374",
    "0.0004470016",
    "0.0000528560",
    "0.0027910157",
    "0.0000854128",
    "0.0000925754",
    "0.0000631716",
    "0.0036014934",
    "0.0000967057",
    "0.0000488267",
    "0.0006533905",
    "0.0012856257",
    "0.0000108792",
    "0.0000191986",
    "0.0022691803",
    "0.0002153556",
    "0.0000304443",
    "0.0027560552",
    "0.0011270233",
    "0.0000043031",
    "0.0030505994",
    "0.0005497145",
    "0.0008816749",
    "0.0008922373",
    "0.0000111248",
    "0.0001226631",
    "0.0000015758",
    "0.0000916132",
    "0.0000022425",
    "0.0000170039",
    "0.0000063150",
    "0.0000024669",
    "0.0000020069",
    "0.0000013922",
    "0.0000020300",
    "0.0000005936",
    "0.0000028383",
    "0.0000169715",
    "0.0000003104",
    "0.0000004678",
    "0.0000022208",
    "0.0000028480",
    "0.0000008806",
    "0.0000021725",
    "0.0000014019",
    "0.0000005779",
    "0.0000013818",
    "0.0000048211",
    "0.0000039115",
    "0.0009642231",
    "0.0000009741",
    "0.0000080176",
    "0.0000001769",
    "0.0000010539",
    "0.0000000648",
    "0.0066245906",
    "0.0007738467",
    "0.0016128253",
    "0.0020872734",
    "0.0140892225",
    "0.0007946647",
    "0.0010744220",
    "0.0006865444",
    "0.0063908015",
    "0.0001198292",
    "0.0010386834",
    "0.0011108011",
    "0.0017062375",
    "0.0016337711",
    "0.0067599226",
    "0.0008298062",
    "0.0000362924",
    "0.0013635610",
    "0.0049113392",
    "0.0049619390",
    "0.0012327473",
    "0.0006226562",
    "0.0007742613",
    "0.0000089391",
    "0.0020324420",
    "0.0000262323",
    "0.0069563463",
    "0.0012843478",
    "0.0024977605",
    "0.0008885607",
    "0.0072921691",
    "0.0014046751",
    "0.0004726433",
    "0.0038789618",
    "0.0059570026",
    "0.0001629096",
    "0.0005369610",
    "0.0011482112",
    "0.0012906082",
    "0.0009615789",
    "0.0055279658",
    "0.0024445683",
    "0.0001850884",
    "0.0008126050",
    "0.0043744534",
    "0.0124923222",
    "0.0023197753",
    "0.0002039910",
    "0.0020057765",
    "0.0000117885",
    "0.0005120732",
    "0.0000184638",
    "0.0060469055",
    "0.0008823650",
    "0.0012018185",
    "0.0005426565",
    "0.0097813510",
    "0.0007789899",
    "0.0003538390",
    "0.0270569804",
    "0.0099184545",
    "0.0001293840",
    "0.0001411459",
    "0.0012495322",
    "0.0008695074",
    "0.0004121337",
    "0.0106646216",
    "0.0007100685",
    "0.0000367961",
    "0.0036588247",
    "0.0043760320",
    "0.0044789313",
    "0.0019605098",
    "0.0001614545",
    "0.0020605898",
    "0.0000065114",
    "0.0018521464",
    "0.0000647546",
    "0.0010614850",
    "0.0006916696",
    "0.0013279869",
    "0.0008093042",
    "0.0011396141",
    "0.0001623199",
    "0.0011175259",
    "0.0000784762",
    "0.0008051293",
    "0.0000203898",
    "0.0001190698",
    "0.0023527213",
    "0.0010151689",
    "0.0035238780",
    "0.0001502976",
    "0.0012272875",
    "0.0000054083",
    "0.0040104542",
    "0.0036306403",
    "0.0035006293",
    "0.0000145794",
    "0.0000490390",
    "0.0000815730",
    "0.0000334898",
    "0.0001230213",
    "0.0000355531",
    "0.0009507987",
    "0.0000067510",
    "0.0000136499",
    "0.0000197984",
    "0.0067807830",
    "0.0000064961",
    "0.0000059168",
    "0.0000069848",
    "0.0021692321",
    "0.0000026438",
    "0.0000026523",
    "0.0000113392",
    "0.0000080997",
    "0.0000076506",
    "0.0005210974",
    "0.0000144716",
    "0.0000003441",
    "0.0000222972",
    "0.0000471987",
    "0.0000145491",
    "0.0000191553",
    "0.0000051638",
    "0.0000105473",
    "0.0000007382",
    "0.0000539027",
    "0.0000006089",
    "0.0038941480",
    "0.0000913063",
    "0.0001036958",
    "0.0001000539",
    "0.0030491966",
    "0.0000777528",
    "0.0000323510",
    "0.0027411097",
    "0.0035181702",
    "0.0000229954",
    "0.0000344495",
    "0.0001521190",
    "0.0001169454",
    "0.0008440118",
    "0.0021060078",
    "0.0000744071",
    "0.0000037568",
    "0.0002837000",
    "0.0004599140",
    "0.0003009377",
    "0.0000418313",
    "0.0000147845",
    "0.0001560106",
    "0.0000010818",
    "0.0001280367",
    "0.0000122189",
    "0.0002090937",
    "0.0000217480",
    "0.0001614187",
    "0.0000138990",
    "0.0001512321",
    "0.0000261396",
    "0.0000090860",
    "0.0000385278",
    "0.0002369810",
    "0.0000024581",
    "0.0000031569",
    "0.0000137797",
    "0.0000294839",
    "0.0000080326",
    "0.0000488360",
    "0.0004256803",
    "0.0000012525",
    "0.0000208241",
    "0.0000356944",
    "0.0003491962",
    "0.0000341186",
    "0.0000071961",
    "0.0000275945",
    "0.0000081061",
    "0.0000218146",
    "0.0000004815",
    "0.0016742215",
    "0.0006236601",
    "0.0007233951",
    "0.0004908127",
    "0.0015030326",
    "0.0005331119",
    "0.0002426112",
    "0.0005298809",
    "0.0010317026",
    "0.0000875735",
    "0.0000906432",
    "0.0004657445",
    "0.0005819146",
    "0.0003435733",
    "0.0021018104",
    "0.0005970829",
    "0.0000203401",
    "0.0004675946",
    "0.0017436166",
    "0.0015527179",
    "0.0001608445",
    "0.0000951607",
    "0.0007814440",
    "0.0000039187",
    "0.0000770035",
    "0.0000181033",
    "0.0002148685",
    "0.0000117138",
    "0.0000094902",
    "0.0000076099",
    "0.0003954256",
    "0.0000066275",
    "0.0000060981",
    "0.0000248926",
    "0.0001489399",
    "0.0000016574",
    "0.0000056108",
    "0.0000185099",
    "0.0000106458",
    "0.0000056060",
    "0.0000980582",
    "0.0000070278",
    "0.0000013351",
    "0.0000075587",
    "0.0000219681",
    "0.0000131714",
    "0.0000262569",
    "0.0000033160",
    "0.0000159258",
    "0.0000005696",
    "0.0000244838",
    "0.0000511722"
]

var alphaDict = {
    "A":0,
    "B":1,
    "C":2,
    "D":3,
    "E":4,
    "F":5,
    "G":6,
    "H":7,
    "I":8,
    "J":9,
    "K":10,
    "L":11,
    "M":12,
    "N":13,
    "O":14,
    "P":15,
    "Q":16,
    "R":17,
    "S":18,
    "T":19,
    "U":20,
    "V":21,
    "W":22,
    "X":23,
    "Y":24,
    "Z":25
}

var mostLikely = "ETAIONSHRDLCUMWFGYPBVKJXQZ".split("");
var mostLikelyNum = mostLikely.map((char)=>alphaDict[char]);

var check = {
    "A":0.0817,
    "B":0.0149,
    "C":0.0278,
    "D":0.0425,
    "E":0.127,
    "F":0.0223,
    "G":0.0202,
    "H":0.0609,
    "I":0.07,
    "J":0.0015,
    "K":0.0077,
    "L":0.0403,
    "M":0.0241,
    "N":0.0675,
    "O":0.0751,
    "P":0.0193,
    "Q":0.0001,
    "R":0.0599,
    "S":0.0633,
    "T":0.0906,
    "U":0.0276,
    "V":0.0098,
    "W":0.0236,
    "X":0.0015,
    "Y":0.0197,
    "Z":0.0007
};





//substitution solving code, as per the hill climbing / jakobsen method that we normally use, slightly modified but the difference
//is not noteworthy
function subTransCipher(text, bigramFreq){
    let freq = findMostLikely(text, ALPHA.length).map((char)=> parseInt(char[0]));
    let key = new Array(ALPHA.length).fill(0);
    for (i in key){
        key[freq[i]] = mostLikelyNum[i];
    }
    let score = bigramTestForSub(bigramFreq, key, text.length);
    for (let i =0; i < 100; i++){
        let newKey = subTransHillClimb(bigramFreq, key, text.length, score, freq);
        if (newKey == -1){
            break;
        }else{
            key = newKey[0].slice(0);
            score = newKey[1];
        }
    }
    //key = substitutionAnnealing(bigramFreq, key, text.length, score);
    return [key, score];
}

//basically the same, performs the hill climbing bits
function subTransHillClimb(freq, key, length, keyScore){
    function s(score, freq, key, length, a, b){
        let testKey = key.slice(0);
        let firstLetter = testKey[a];
        testKey[a] = testKey[b];
        testKey[b] = firstLetter;
        for (let k = 0; k < key.length; k ++) {
            var changes = [k * 26 + a, k * 26 + b, a * 26 + k, b * 26 + k];
            for (i of changes){
                score -= (freq[i] - (bigrams[key[Math.floor(i / 26)] * 26 + key[i % 26]]*length)) ** 2;
                score += (freq[i] - (bigrams[testKey[Math.floor(i / 26)] * 26 + testKey[i % 26]]*length)) ** 2;
            }
        }
        return [testKey,score];
    }
    for (let i = 0; i < key.length; i++){
        for (let x = i; x < key.length; x++){
            if (!(i == x)){
                let test = s(keyScore, freq, key, length, i, x);
                let score = test[1];
                if (score < keyScore){
                    testKey = test[0];
                    return [testKey,score];
                }
            }
        }
    }
    return -1;
}



function decryptSubTrans(text ,length){
    let columns = returnEveryNth(text, length); //split into columns
    let keyScores = [];
    for (let i =0; i < columns.length; i++){ //loop through each column
        for (let x =0; x<columns.length;x++){ //checking each column against current collumn
            if (!(x == i)){ //asserts we are not checking column against the same column
                let bigramCount = {}
                for (let b = 0; b < 676; b++){
                    bigramCount[b] = 0
                }
                for( let j = 0; j< columns[i].length; j++){ //generate frequency of bigrams
                    if (!(j >= columns[x].length)){
                        bigramCount[(columns[i][j] * 26) + columns[x][j]] ++;//creating dictionary of all bigram frequencies within 
                    }                                                        // the two comparing columns
                }
                let s = subTransCipher(text, bigramCount); //generates one likely substitution key from the column comparison bigram
                keyScores.push(s);//adds this key to the list of all possible key candidates
            }
        }
    }
    let best = []
    for (i of keyScores){
        let s = applySubstitutionKey(text, i[0])//applies one substitution key to the text meaning we are hopefully left with only transpo ciphertext
        let k = decryptTransposition(substitutionCipher(s), length);//uses our typical transpo method to find most likely transpo key
        console.log(k)
        let p = substitutionCipher(applyTranspositionKey(text, k))//applies transposition key and then does an extra sub-hill-climb for accuracy 
        best.push([s, bigramTest(s)])//pushes this text and its bigram score to array
    }
    best = best.sort(function(a,b) { //sorts array so that lowest bigram score is first
        return a[1] - b[1];
    });
    // for (i of best){
    //     console.log(i[0])
    // }
    console.log(best[0][0].map((char)=>ALPHA[char]).join("")) //prints text with lowest bigram score
}