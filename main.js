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
        // }catch{
        //     alert("Please select a cipher from the dropdown")
        // }
    }
}

// decrypt
function decrypt(){
    if (selectedCipher == "determine"){
        eval(selectedCipher + "Cipher")();
    }else{
            var f = eval(selectedCipher + "Decrypt");
            output(input(f));
        //}catch{
        //     alert("Please select a cipher from the dropdown")
        // }
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
    return applyTranspositionKey(text, best[0]);
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
    //applies key to cipher to decrypt
    return key;
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
    for (let i = 0; i < length; i++){
        let column = [];
        for (let x = 0; x < num; x++){
            column.push(text[(i * num) +x]);
        }
        columns.push(column)
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
    let ioc = 0;
    for (let step = 2; step < limit; step++){
        let sum = 0;
        let allVals = returnEveryNth(text, step);     
        for (i of allVals){
            sum += indexOfCoincidence(i);
        }
        let avg = sum/step;
        if (avg > ioc && avg > 0.55|| avg > 0.055 && step > keyLength){
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
    for (let i = 0; i < 5; i++){
        text =substitutionCipher(text);
        if (isEnglish(text)){
            return text;
        }
    }
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
    key = Array.from(Array(10).keys()).map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
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
    let correct = ["", 1000000];
    for (let i = 2; i < 15; i++){
        if (text.length % i == 0){
            let s = transpositionHillClimb(text,i);
            if(isEnglish(s)){
                if (bigramTest(s) < correct[1])
                correct =[s, bigramTest(s)]
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
    for (let i =2; i < 15; i++){
        if (text.length % i ==0){
            let s = decryptTransposition(columnsToTransposition(text, i), i);
            if (isEnglish(s)) {
                return s;
            }
        }
    }
     
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
    key = ALPHA.map((char)=>alphaDict[char]);//ALPHA.map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value).map((char) => alphaDict[char]);
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
    console.log(newText);
    return substitutionCipher(newText);
}

function determineCipher(text = globalText.slice(0, globalText.length)){
    let c = chiTest(text);
    if (c < 120){
        return "Transposition";
    }
    let i = indexOfCoincidence(text);
    if (i >= 0.065 && i <= 0.068){
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
    console.log(f(t));
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
            if (cleanText(testTexts[x])[0].every((char, index) => char == dec[index])){
                numSuccesful ++;
            }else{
            }
        }
    }
    console.log((numSuccesful / (testTexts.length * num))*100);
}

//------------------------------------------------------------
//ffs stupid javascript why do i gotta do this

bigrams = [
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
    "Z":0.0007,
    "AA": "0.0003980324",
    "AB": "0.0020294455",
    "AC": "0.0041406460",
    "AD": "0.0034405166",
    "AE": "0.0001887000",
    "AF": "0.0013187785",
    "AG": "0.0020372353",
    "AH": "0.0005146171",
    "AI": "0.0032318468",
    "AJ": "0.0002012572",
    "AK": "0.0011880571",
    "AL": "0.0088368302",
    "AM": "0.0036946134",
    "AN": "0.0161362431",
    "AO": "0.0001733450",
    "AP": "0.0019781818",
    "AQ": "0.0000728628",
    "AR": "0.0097946367",
    "AS": "0.0087356061",
    "AT": "0.0111640000",
    "AU": "0.0011295152",
    "AV": "0.0019168917",
    "AW": "0.0009063007",
    "AX": "0.0001528230",
    "AY": "0.0026649110",
    "AZ": "0.0001776911",
    "BA": "0.0020506935",
    "BB": "0.0001593750",
    "BC": "0.0000740912",
    "BD": "0.0000327816",
    "BE": "0.0045022926",
    "BF": "0.0000174259",
    "BG": "0.0000093698",
    "BH": "0.0000357272",
    "BI": "0.0010074776",
    "BJ": "0.0000653561",
    "BK": "0.0000062424",
    "BL": "0.0016051893",
    "BM": "0.0000443574",
    "BN": "0.0000245425",
    "BO": "0.0018899522",
    "BP": "0.0000266322",
    "BQ": "0.0000012749",
    "BR": "0.0010686733",
    "BS": "0.0003260015",
    "BT": "0.0000990433",
    "BU": "0.0018762791",
    "BV": "0.0000277700",
    "BW": "0.0000324202",
    "BX": "0.0000006986",
    "BY": "0.0012099721",
    "BZ": "0.0000018806",
    "CA": "0.0046091962",
    "CB": "0.0000689279",
    "CC": "0.0006999081",
    "CD": "0.0000828919",
    "CE": "0.0045797949",
    "CF": "0.0000618922",
    "CG": "0.0000419946",
    "CH": "0.0046559099",
    "CI": "0.0019532456",
    "CJ": "0.0000096033",
    "CK": "0.0016662530",
    "CL": "0.0013143006",
    "CM": "0.0000661271",
    "CN": "0.0000434876",
    "CO": "0.0061832355",
    "CP": "0.0000885550",
    "CQ": "0.0000364342",
    "CR": "0.0012752507",
    "CS": "0.0003195114",
    "CT": "0.0027493988",
    "CU": "0.0010647338",
    "CV": "0.0000217903",
    "CW": "0.0000594925",
    "CX": "0.0000012257",
    "CY": "0.0002648664",
    "CZ": "0.0000133932",
    "DA": "0.0040664974",
    "DB": "0.0014122429",
    "DC": "0.0008747385",
    "DD": "0.0009253369",
    "DE": "0.0062509333",
    "DF": "0.0009328767",
    "DG": "0.0005647703",
    "DH": "0.0010605063",
    "DI": "0.0050123397",
    "DJ": "0.0001848618",
    "DK": "0.0001215838",
    "DL": "0.0007055631",
    "DM": "0.0008197965",
    "DN": "0.0006569006",
    "DO": "0.0030342123",
    "DP": "0.0007273242",
    "DQ": "0.0000655193",
    "DR": "0.0013186194",
    "DS": "0.0024120209",
    "DT": "0.0036445899",
    "DU": "0.0013554897",
    "DV": "0.0002864312",
    "DW": "0.0011347523",
    "DX": "0.0000063395",
    "DY": "0.0005129450",
    "DZ": "0.0000226723",
    "EA": "0.0100204737",
    "EB": "0.0022521993",
    "EC": "0.0059609240",
    "ED": "0.0107878308",
    "EE": "0.0042778434",
    "EF": "0.0030647167",
    "EG": "0.0019163316",
    "EH": "0.0017481308",
    "EI": "0.0037063924",
    "EJ": "0.0002906928",
    "EK": "0.0005577169",
    "EL": "0.0053403249",
    "EM": "0.0041962898",
    "EN": "0.0113297472",
    "EO": "0.0031276101",
    "EP": "0.0032432845",
    "EQ": "0.0003379724",
    "ER": "0.0178381361",
    "ES": "0.0131981417",
    "ET": "0.0076021230",
    "EU": "0.0008496812",
    "EV": "0.0024453511",
    "EW": "0.0034171991",
    "EX": "0.0013064745",
    "EY": "0.0017410082",
    "EZ": "0.0001076439",
    "FA": "0.0019328589",
    "FB": "0.0002053952",
    "FC": "0.0003632619",
    "FD": "0.0001729891",
    "FE": "0.0019724877",
    "FF": "0.0014073402",
    "FG": "0.0001474882",
    "FH": "0.0003486493",
    "FI": "0.0027736999",
    "FJ": "0.0000624091",
    "FK": "0.0000529367",
    "FL": "0.0006685369",
    "FM": "0.0002893790",
    "FN": "0.0001235768",
    "FO": "0.0043763211",
    "FP": "0.0002774768",
    "FQ": "0.0000109858",
    "FR": "0.0019285683",
    "FS": "0.0004734865",
    "FT": "0.0031673619",
    "FU": "0.0007259036",
    "FV": "0.0000565860",
    "FW": "0.0002326256",
    "FX": "0.0000044663",
    "FY": "0.0001826868",
    "FZ": "0.0000072121",
    "GA": "0.0025993190",
    "GB": "0.0002738996",
    "GC": "0.0003005325",
    "GD": "0.0002034611",
    "GE": "0.0033359381",
    "GF": "0.0003388637",
    "GG": "0.0003395566",
    "GH": "0.0022849461",
    "GI": "0.0016426757",
    "GJ": "0.0000409209",
    "GK": "0.0000378874",
    "GL": "0.0005959091",
    "GM": "0.0002725430",
    "GN": "0.0005611372",
    "GO": "0.0018937247",
    "GP": "0.0002810287",
    "GQ": "0.0000138178",
    "GR": "0.0016165024",
    "GS": "0.0009066973",
    "GT": "0.0016992999",
    "GU": "0.0008714890",
    "GV": "0.0000431941",
    "GW": "0.0003626144",
    "GX": "0.0000034176",
    "GY": "0.0002265900",
    "GZ": "0.0000065942",
    "HA": "0.0083188661",
    "HB": "0.0002344991",
    "HC": "0.0003332596",
    "HD": "0.0001916583",
    "HE": "0.0232854497",
    "HF": "0.0001929369",
    "HG": "0.0000993511",
    "HH": "0.0003075760",
    "HI": "0.0063585867",
    "HJ": "0.0000439178",
    "HK": "0.0000486537",
    "HL": "0.0002704518",
    "HM": "0.0003128957",
    "HN": "0.0003200548",
    "HO": "0.0045625445",
    "HP": "0.0002263229",
    "HQ": "0.0000234130",
    "HR": "0.0008887343",
    "HS": "0.0005693694",
    "HT": "0.0019313839",
    "HU": "0.0006410148",
    "HV": "0.0000456830",
    "HW": "0.0003245101",
    "HX": "0.0000017405",
    "HY": "0.0003345070",
    "HZ": "0.0000085719",
    "IA": "0.0023130703",
    "IB": "0.0006009175",
    "IC": "0.0049647958",
    "ID": "0.0029825175",
    "IE": "0.0028920389",
    "IF": "0.0013275310",
    "IG": "0.0022040453",
    "IH": "0.0001412269",
    "II": "0.0001404038",
    "IJ": "0.0000506757",
    "IK": "0.0005978371",
    "IL": "0.0041343828",
    "IM": "0.0024385083",
    "IN": "0.0202755339",
    "IO": "0.0049050723",
    "IP": "0.0007744038",
    "IQ": "0.0000674437",
    "IR": "0.0027014356",
    "IS": "0.0086375754",
    "IT": "0.0087736845",
    "IU": "0.0001333640",
    "IV": "0.0021112308",
    "IW": "0.0002132358",
    "IX": "0.0002033612",
    "IY": "0.0000227470",
    "IZ": "0.0004314863",
    "JA": "0.0003960944",
    "JB": "0.0000044818",
    "JC": "0.0000057283",
    "JD": "0.0000050653",
    "JE": "0.0003439648",
    "JF": "0.0000029231",
    "JG": "0.0000027804",
    "JH": "0.0000048472",
    "JI": "0.0000826934",
    "JJ": "0.0000037198",
    "JK": "0.0000032300",
    "JL": "0.0000028096",
    "JM": "0.0000051659",
    "JN": "0.0000033422",
    "JO": "0.0006293396",
    "JP": "0.0000079831",
    "JQ": "0.0000001670",
    "JR": "0.0000186098",
    "JS": "0.0000090946",
    "JT": "0.0000047196",
    "JU": "0.0006763942",
    "JV": "0.0000020640",
    "JW": "0.0000037194",
    "JX": "0.0000001728",
    "JY": "0.0000013235",
    "JZ": "0.0000006612",
    "KA": "0.0006551698",
    "KB": "0.0001058849",
    "KC": "0.0000971333",
    "KD": "0.0000642863",
    "KE": "0.0024630793",
    "KF": "0.0001242660",
    "KG": "0.0000483950",
    "KH": "0.0001503413",
    "KI": "0.0013446311",
    "KJ": "0.0000177645",
    "KK": "0.0000274763",
    "KL": "0.0001957178",
    "KM": "0.0001123040",
    "KN": "0.0004402821",
    "KO": "0.0004065562",
    "KP": "0.0000868737",
    "KQ": "0.0000032157",
    "KR": "0.0001172537",
    "KS": "0.0007463547",
    "KT": "0.0003339367",
    "KU": "0.0001171607",
    "KV": "0.0000169246",
    "KW": "0.0001664227",
    "KX": "0.0000011755",
    "KY": "0.0001279555",
    "KZ": "0.0000025883",
    "LA": "0.0053602293",
    "LB": "0.0005697549",
    "LC": "0.0005383890",
    "LD": "0.0023693978",
    "LE": "0.0070264485",
    "LF": "0.0006249866",
    "LG": "0.0002142564",
    "LH": "0.0002946370",
    "LI": "0.0053863275",
    "LJ": "0.0000504985",
    "LK": "0.0002692302",
    "LL": "0.0056975361",
    "LM": "0.0005125921",
    "LN": "0.0001739810",
    "LO": "0.0036068105",
    "LP": "0.0005883168",
    "LQ": "0.0000178413",
    "LR": "0.0003480683",
    "LS": "0.0020062894",
    "LT": "0.0015765660",
    "LU": "0.0010182261",
    "LV": "0.0002863669",
    "LW": "0.0004247818",
    "LX": "0.0000035769",
    "LY": "0.0031779890",
    "LZ": "0.0000132545",
    "MA": "0.0050480417",
    "MB": "0.0009532012",
    "MC": "0.0002547859",
    "MD": "0.0001112654",
    "ME": "0.0062990119",
    "MF": "0.0001653714",
    "MG": "0.0000659400",
    "MH": "0.0001643948",
    "MI": "0.0028141961",
    "MJ": "0.0000310497",
    "MK": "0.0000256794",
    "ML": "0.0001106646",
    "MM": "0.0008627192",
    "MN": "0.0001291352",
    "MO": "0.0029950011",
    "MP": "0.0018119658",
    "MQ": "0.0000049393",
    "MR": "0.0001527751",
    "MS": "0.0009072014",
    "MT": "0.0007067196",
    "MU": "0.0008685761",
    "MV": "0.0000315240",
    "MW": "0.0002168347",
    "MX": "0.0000032955",
    "MY": "0.0004507566",
    "MZ": "0.0000042254",
    "NA": "0.0054456123",
    "NB": "0.0008331604",
    "NC": "0.0035185414",
    "ND": "0.0106829185",
    "NE": "0.0063207369",
    "NF": "0.0011448165",
    "NG": "0.0089191083",
    "NH": "0.0009054797",
    "NI": "0.0040359824",
    "NJ": "0.0003105216",
    "NK": "0.0007037720",
    "NL": "0.0008540416",
    "NM": "0.0008780795",
    "NN": "0.0011981373",
    "NO": "0.0043694616",
    "NP": "0.0006864103",
    "NQ": "0.0000502811",
    "NR": "0.0005535405",
    "NS": "0.0049273337",
    "NT": "0.0117251583",
    "NU": "0.0008632034",
    "NV": "0.0005075090",
    "NW": "0.0009749867",
    "NX": "0.0000173085",
    "NY": "0.0010044314",
    "NZ": "0.0000616219",
    "OA": "0.0015157325",
    "OB": "0.0014367087",
    "OC": "0.0017684380",
    "OD": "0.0017599419",
    "OE": "0.0006050487",
    "OF": "0.0070629049",
    "OG": "0.0009627666",
    "OH": "0.0007526741",
    "OI": "0.0012341485",
    "OJ": "0.0001528822",
    "OK": "0.0007857238",
    "OL": "0.0031743952",
    "OM": "0.0048717699",
    "ON": "0.0131622499",
    "OO": "0.0023516548",
    "OP": "0.0024188588",
    "OQ": "0.0000283703",
    "OR": "0.0105744307",
    "OS": "0.0031442791",
    "OT": "0.0046455721",
    "OU": "0.0071950425",
    "OV": "0.0016997679",
    "OW": "0.0033788152",
    "OX": "0.0001503374",
    "OY": "0.0004470016",
    "OZ": "0.0000528560",
    "PA": "0.0027910157",
    "PB": "0.0000854128",
    "PC": "0.0000925754",
    "PD": "0.0000631716",
    "PE": "0.0036014934",
    "PF": "0.0000967057",
    "PG": "0.0000488267",
    "PH": "0.0006533905",
    "PI": "0.0012856257",
    "PJ": "0.0000108792",
    "PK": "0.0000191986",
    "PL": "0.0022691803",
    "PM": "0.0002153556",
    "PN": "0.0000304443",
    "PO": "0.0027560552",
    "PP": "0.0011270233",
    "PQ": "0.0000043031",
    "PR": "0.0030505994",
    "PS": "0.0005497145",
    "PT": "0.0008816749",
    "PU": "0.0008922373",
    "PV": "0.0000111248",
    "PW": "0.0001226631",
    "PX": "0.0000015758",
    "PY": "0.0000916132",
    "PZ": "0.0000022425",
    "QA": "0.0000170039",
    "QB": "0.0000063150",
    "QC": "0.0000024669",
    "QD": "0.0000020069",
    "QE": "0.0000013922",
    "QF": "0.0000020300",
    "QG": "0.0000005936",
    "QH": "0.0000028383",
    "QI": "0.0000169715",
    "QJ": "0.0000003104",
    "QK": "0.0000004678",
    "QL": "0.0000022208",
    "QM": "0.0000028480",
    "QN": "0.0000008806",
    "QO": "0.0000021725",
    "QP": "0.0000014019",
    "QQ": "0.0000005779",
    "QR": "0.0000013818",
    "QS": "0.0000048211",
    "QT": "0.0000039115",
    "QU": "0.0009642231",
    "QV": "0.0000009741",
    "QW": "0.0000080176",
    "QX": "0.0000001769",
    "QY": "0.0000010539",
    "QZ": "0.0000000648",
    "RA": "0.0066245906",
    "RB": "0.0007738467",
    "RC": "0.0016128253",
    "RD": "0.0020872734",
    "RE": "0.0140892225",
    "RF": "0.0007946647",
    "RG": "0.0010744220",
    "RH": "0.0006865444",
    "RI": "0.0063908015",
    "RJ": "0.0001198292",
    "RK": "0.0010386834",
    "RL": "0.0011108011",
    "RM": "0.0017062375",
    "RN": "0.0016337711",
    "RO": "0.0067599226",
    "RP": "0.0008298062",
    "RQ": "0.0000362924",
    "RR": "0.0013635610",
    "RS": "0.0049113392",
    "RT": "0.0049619390",
    "RU": "0.0012327473",
    "RV": "0.0006226562",
    "RW": "0.0007742613",
    "RX": "0.0000089391",
    "RY": "0.0020324420",
    "RZ": "0.0000262323",
    "SA": "0.0069563463",
    "SB": "0.0012843478",
    "SC": "0.0024977605",
    "SD": "0.0008885607",
    "SE": "0.0072921691",
    "SF": "0.0014046751",
    "SG": "0.0004726433",
    "SH": "0.0038789618",
    "SI": "0.0059570026",
    "SJ": "0.0001629096",
    "SK": "0.0005369610",
    "SL": "0.0011482112",
    "SM": "0.0012906082",
    "SN": "0.0009615789",
    "SO": "0.0055279658",
    "SP": "0.0024445683",
    "SQ": "0.0001850884",
    "SR": "0.0008126050",
    "SS": "0.0043744534",
    "ST": "0.0124923222",
    "SU": "0.0023197753",
    "SV": "0.0002039910",
    "SW": "0.0020057765",
    "SX": "0.0000117885",
    "SY": "0.0005120732",
    "SZ": "0.0000184638",
    "TA": "0.0060469055",
    "TB": "0.0008823650",
    "TC": "0.0012018185",
    "TD": "0.0005426565",
    "TE": "0.0097813510",
    "TF": "0.0007789899",
    "TG": "0.0003538390",
    "TH": "0.0270569804",
    "TI": "0.0099184545",
    "TJ": "0.0001293840",
    "TK": "0.0001411459",
    "TL": "0.0012495322",
    "TM": "0.0008695074",
    "TN": "0.0004121337",
    "TO": "0.0106646216",
    "TP": "0.0007100685",
    "TQ": "0.0000367961",
    "TR": "0.0036588247",
    "TS": "0.0043760320",
    "TT": "0.0044789313",
    "TU": "0.0019605098",
    "TV": "0.0001614545",
    "TW": "0.0020605898",
    "TX": "0.0000065114",
    "TY": "0.0018521464",
    "TZ": "0.0000647546",
    "UA": "0.0010614850",
    "UB": "0.0006916696",
    "UC": "0.0013279869",
    "UD": "0.0008093042",
    "UE": "0.0011396141",
    "UF": "0.0001623199",
    "UG": "0.0011175259",
    "UH": "0.0000784762",
    "UI": "0.0008051293",
    "UJ": "0.0000203898",
    "UK": "0.0001190698",
    "UL": "0.0023527213",
    "UM": "0.0010151689",
    "UN": "0.0035238780",
    "UO": "0.0001502976",
    "UP": "0.0012272875",
    "UQ": "0.0000054083",
    "UR": "0.0040104542",
    "US": "0.0036306403",
    "UT": "0.0035006293",
    "UU": "0.0000145794",
    "UV": "0.0000490390",
    "UW": "0.0000815730",
    "UX": "0.0000334898",
    "UY": "0.0001230213",
    "UZ": "0.0000355531",
    "VA": "0.0009507987",
    "VB": "0.0000067510",
    "VC": "0.0000136499",
    "VD": "0.0000197984",
    "VE": "0.0067807830",
    "VF": "0.0000064961",
    "VG": "0.0000059168",
    "VH": "0.0000069848",
    "VI": "0.0021692321",
    "VJ": "0.0000026438",
    "VK": "0.0000026523",
    "VL": "0.0000113392",
    "VM": "0.0000080997",
    "VN": "0.0000076506",
    "VO": "0.0005210974",
    "VP": "0.0000144716",
    "VQ": "0.0000003441",
    "VR": "0.0000222972",
    "VS": "0.0000471987",
    "VT": "0.0000145491",
    "VU": "0.0000191553",
    "VV": "0.0000051638",
    "VW": "0.0000105473",
    "VX": "0.0000007382",
    "VY": "0.0000539027",
    "VZ": "0.0000006089",
    "WA": "0.0038941480",
    "WB": "0.0000913063",
    "WC": "0.0001036958",
    "WD": "0.0001000539",
    "WE": "0.0030491966",
    "WF": "0.0000777528",
    "WG": "0.0000323510",
    "WH": "0.0027411097",
    "WI": "0.0035181702",
    "WJ": "0.0000229954",
    "WK": "0.0000344495",
    "WL": "0.0001521190",
    "WM": "0.0001169454",
    "WN": "0.0008440118",
    "WO": "0.0021060078",
    "WP": "0.0000744071",
    "WQ": "0.0000037568",
    "WR": "0.0002837000",
    "WS": "0.0004599140",
    "WT": "0.0003009377",
    "WU": "0.0000418313",
    "WV": "0.0000147845",
    "WW": "0.0001560106",
    "WX": "0.0000010818",
    "WY": "0.0001280367",
    "WZ": "0.0000122189",
    "XA": "0.0002090937",
    "XB": "0.0000217480",
    "XC": "0.0001614187",
    "XD": "0.0000138990",
    "XE": "0.0001512321",
    "XF": "0.0000261396",
    "XG": "0.0000090860",
    "XH": "0.0000385278",
    "XI": "0.0002369810",
    "XJ": "0.0000024581",
    "XK": "0.0000031569",
    "XL": "0.0000137797",
    "XM": "0.0000294839",
    "XN": "0.0000080326",
    "XO": "0.0000488360",
    "XP": "0.0004256803",
    "XQ": "0.0000012525",
    "XR": "0.0000208241",
    "XS": "0.0000356944",
    "XT": "0.0003491962",
    "XU": "0.0000341186",
    "XV": "0.0000071961",
    "XW": "0.0000275945",
    "XX": "0.0000081061",
    "XY": "0.0000218146",
    "XZ": "0.0000004815",
    "YA": "0.0016742215",
    "YB": "0.0006236601",
    "YC": "0.0007233951",
    "YD": "0.0004908127",
    "YE": "0.0015030326",
    "YF": "0.0005331119",
    "YG": "0.0002426112",
    "YH": "0.0005298809",
    "YI": "0.0010317026",
    "YJ": "0.0000875735",
    "YK": "0.0000906432",
    "YL": "0.0004657445",
    "YM": "0.0005819146",
    "YN": "0.0003435733",
    "YO": "0.0021018104",
    "YP": "0.0005970829",
    "YQ": "0.0000203401",
    "YR": "0.0004675946",
    "YS": "0.0017436166",
    "YT": "0.0015527179",
    "YU": "0.0001608445",
    "YV": "0.0000951607",
    "YW": "0.0007814440",
    "YX": "0.0000039187",
    "YY": "0.0000770035",
    "YZ": "0.0000181033",
    "ZA": "0.0002148685",
    "ZB": "0.0000117138",
    "ZC": "0.0000094902",
    "ZD": "0.0000076099",
    "ZE": "0.0003954256",
    "ZF": "0.0000066275",
    "ZG": "0.0000060981",
    "ZH": "0.0000248926",
    "ZI": "0.0001489399",
    "ZJ": "0.0000016574",
    "ZK": "0.0000056108",
    "ZL": "0.0000185099",
    "ZM": "0.0000106458",
    "ZN": "0.0000056060",
    "ZO": "0.0000980582",
    "ZP": "0.0000070278",
    "ZQ": "0.0000013351",
    "ZR": "0.0000075587",
    "ZS": "0.0000219681",
    "ZT": "0.0000131714",
    "ZU": "0.0000262569",
    "ZV": "0.0000033160",
    "ZW": "0.0000159258",
    "ZX": "0.0000005696",
    "ZY": "0.0000244838",
    "ZZ": "0.0000511722"
};
