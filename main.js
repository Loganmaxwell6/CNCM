const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const d = new Date();

function test(){
    alert("working " + d);
}

function decryptCaesarCipher(){
    text = document.getElementById("textIn").value
    for (let i = 0; i < 26; i ++) {
        let t = caesarShift(text, i);
        if (isEnglish(t)){
            document.getElementById("textOut").value = t.toLowerCase();
            return t;
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

function isEnglish(text){
    //to create
    return true;
}