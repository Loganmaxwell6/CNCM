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

    createButton(){
        window.onload=function(){
            document.getElementById('cipherButtons').appendChild(button);
        }
        let button = document.createElement("button");
        button.innerHTML = this.name;
        
        console.log(this.full , this.single)
        button.addEventListener("click",this.decrypt.bind(this, this.full,this.single));
        button.style.display='block';
    }

}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const d = new Date();

caesar = new Cipher("Caesar Shift", caesarShift, decryptCaesarCipher, caesarShift);
caesar.createButton();

affine = new Cipher("Affine Cipher", affineShift, decrpytAffineCipher, function(){});
affine.createButton();

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
    console.log(f);
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
     * 
     * need:
     *  threshold implementation
     *  bigram score
     *  trigram score
     *  IoC
     * 
     * doing:
     *  chi squared
     */
    return true;
}

//mapping of alpha to f as a index 0 in both etc.
function countLetter(text){
    let f = [];
    for (let i = 0; i < 26; i++){
        while (true) {
            pos = text.indexOf(i, pos);
            if (pos >= 0) {
                n++;
                pos++;
            } else break;
        }
        f.push(n);
    }
    return f;
}

//------------------------------------------------------------
