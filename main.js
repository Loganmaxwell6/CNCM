function test(){
    alert("function working");
}

function decryptCasearCipher(text){
    for (let i = 0; i < 26; i ++) {
        //implement check against dict here
        if (checkAgainstDict(casearShift(text, i))){
            
        }
    }
}

function casearShift(text, shift){
    text = text.toUpperCase().split("");
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let newString = "";
    for (i in text) {   
        if (alphabet.includes(text[i])) {
            newString += alphabet[(alphabet.indexOf(text[i]) + shift)%26];
        }else{
            newString += text[i];
        }      
    } 
    return newString;
}

function checkAgainstDict(text){
    //to create
    return true;
}