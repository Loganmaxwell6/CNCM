class Cipher{

    constructor(name, singleDecrypt, fullDecrypt, encrypt){
        this.name = name;
        this.single = singleDecrypt;
        this.full = fullDecrypt;
        this.encrypt = encrypt;

    }

    decrypt(full, single){
        decryptCalled();
        full(single);
    }

    check(){
        console.log(document.getElementById(this.name))
    }

    createButton(){
        let button = document.getElementById(this.name);
        button.addEventListener("click",this.decrypt.bind(this, this.full,this.single));
    }

}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const d = new Date();

window.onload = function(){
    caesar = new Cipher("caesarShift", caesarShift, decryptCaesarCipher, caesarShift);
    caesar.createButton();

    affine = new Cipher("affineShift", affineShift, decrpytAffineCipher, function(){});
    affine.createButton();
 
}

function test(){
    alert("working " + d);
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

//general function for decrypting any cipher
function decryptCalled(){
    document.getElementById("textOut").value = "";
}

function decryptCaesarCipher(f){
    text = document.getElementById("textIn").value
    for (let i = 0; i < 26; i ++) {
        let t = f(text, i);
        if (isEnglish(t)){
            document.getElementById("textOut").value += t.toLowerCase() +"\n";
        }
    }
}

function caesarShift(text, shift){
    text = text.toUpperCase().split("");
    let newString = "";
    for (i in text) {   
        if (ALPHA.includes(text[i])) {
            newString += ALPHA[(ALPHA.indexOf(text[i]) + shift)%26];
        }else{
            newString += text[i];
        }      
    } 
    return newString;
}

function decrpytAffineCipher(f){
    text = document.getElementById("textIn").value
    for (let i = 1; i < 13; i ++) {
        for (let x = 0; x <26; x++){
            let t = f(text, i, x);
            if (isEnglish(t)){
                document.getElementById("textOut").value += t.toLowerCase() +"\n";
            }
        }
        
    }
}

function affineShift(text,num,num2){
    let multis = ['1','9','21','15','3','19','7','23','11','5','17','25'];
    text = text.toUpperCase().split("");
    for (i in text){
        
        if (ALPHA.includes(text[i])){
            index = ALPHA.indexOf(text[i])+1;
            a = multis[num-1];
            b = mod(index-num2,26);
            num3 = a*b;
            num4 = num3%26;
            text[i] = ALPHA[num4-1];
        }
    }
    return text.join("");
}

//-------------------------------------------------------------
//logan will do this/is doing it
const check = JSON.parse(scoring);
function isEnglish(text){
    /**got:
     *  chiTest(text);
     * 
     * need:
     *  threshold implementation
     *  bigram score
     *  trigram score
     *  IoC
     * 
     * doing:
     *  
     */
    return true;
}

//mapping of alpha to f as a index 0 in both etc.
function observedCount(text){
    let o = [];
    for (let i = 0; i < 26; i++){
        while (true) {
            pos = text.indexOf(i, pos);
            if (pos >= 0) {
                n++;
                pos++;
            } else break;
        }
        o.push(n);
    }
    return o;
}

function expectedCount(t){
    let e = [];
    for(a in ALPHA){
        e.push(check[a] * t);
    }
    return e;
}

//observed - expected ^ 2 / expected
function chiHelper(o,e){
    let d = (o - e)**2;
    return d/e;
}

//<150 should be english
function chiTest(text){
    let o = observedCount(text);
    let e = expectedCount(text.length());
    let sum = 0;
    for(let i = 0; i < 26; i++){
        sum += chiHelper(o[i],e[i]);
    }
    return sum;
}

//------------------------------------------------------------
