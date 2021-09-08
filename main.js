const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const d = new Date();

function test(){
    alert("working " + d);
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function executeFunctionByName(functionName, context , args ) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }

//general function for decrypting any cipher
function decryptCalled(f){
    document.getElementById("textOut").value = "";
    //executeFunctionByName(f, window);
    executeFunctionByName(f,window)
}

function decryptCaesarCipher(){
    text = document.getElementById("textIn").value
    for (let i = 0; i < 26; i ++) {
        let t = caesarShift(text, i);
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

function decrpytAffineCipher(){
    text = document.getElementById("textIn").value
    for (let i = 1; i < 13; i ++) {
        for (let x = 0; x <26; x++){
            let t = affineShift(text, i, x);
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
function isEnglish(text){
    //to create
    return true;
}

//mapping of alpha to f as a index 0 in both etc.
function frequencyAnalysis(text){
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
