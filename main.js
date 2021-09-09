class Cipher{

    constructor(name, options){
        this.name = name;
        this.optionsPage = options;

        this.createButton();
    }

    openOptions(cls){
        cls.optionsPage.openOptions();//open options page
        openNewPage(cls);
    }

    createButton(){
        let button = document.getElementById(this.name);
        button.addEventListener("click", this.openOptions.bind(this, this)); //button opens options page on being clicked
    }

}

class optionsPage{
    constructor(options){
        this.options = options;
        
        this.initOptions();
    }

    //initialise buttons with their onclicks
    initOptions(){
        for (let i =0; i<this.options.length; i++){
            let current = this.options[i]; //one option in list of options that form the options page
            let button = document.getElementById(current.name); 
            button.addEventListener("click", function(){
                decryptCalled(current.click); //set onclick to perform this opttions function
            })
        }
    }

    //set all options visible and initialise
    openOptions(){

        for (let i =0; i<this.options.length; i++){
            let current = this.options[i]; //one option in list of options that form the options page
            let button = document.getElementById(current.name);  
            button.style.visibility = "visible"; //set button visible
        }
    }

    //close options page, set all hidden
    closeOptions(){
        for (let i =0; i<this.options.length; i++){
            let current = this.options[i];
            let button = document.getElementById(current.name);
            button.style.visibility = "hidden";
        }
    }
}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const d = new Date();

//calls the initialisation of the ciphers
window.onload = function(){
    initCiphers("caesarCipher", new optionsPage([{name:"caesarDecrypt", click:decryptCaesarCipher},{name:"caesarEncrypt", click:decryptCaesarCipher}]));
    initCiphers("affineCipher", new optionsPage([{name:"affineDecrypt", click:decryptAffineCipher}]));
}

function test(){
    alert("working " + d);
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function swapText(){
    if (!(document.getElementById("textOut").value == "")){
        document.getElementById("textIn").value = document.getElementById("textOut").value
        document.getElementById("textOut").value = ""
    }else{
        alert("No output text to swap")
    }
    
}

function openNewPage (page){
    t = typeof currentOpen;
    if (t == 'object'){
        if (!(currentOpen == page)){
            currentOpen.optionsPage.closeOptions();
        }
    }
    currentOpen = page;
}

//general function for calling the decrypt of a cipher, used in optionsPage class
function decryptCalled(f){
    document.getElementById("textOut").value = "";
    if(!(document.getElementById("textIn").value) == ''){
        f();
    }else{
        alert("Enter text into input box first")
    }
}

//initialises the ciphers
function initCiphers(cipherName, cipherOptionsPage){
    let cipher = new Cipher(cipherName, cipherOptionsPage);
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

function decryptAffineCipher(){
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
