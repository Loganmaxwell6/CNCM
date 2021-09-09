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
    a = performance.now();
    text = document.getElementById("textIn").value
    for (let i = 1; i < 13; i ++) {
        for (let x = 0; x <26; x++){
            let t = affineShift(text, i, x);
            if (isEnglish(t)){
                document.getElementById("textOut").value += t.toLowerCase() +"\n";
            }
        }
        
    }
    b = performance.now();
    aT = b - a;
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
    return chiTest(text) <= 60;
}

//mapping of alpha to f as a index 0 in both etc.
function observedCount(text){
    let o = {};
    for (let i = 0; i < 26; i++){
        o[i] =0;
    }
    
    for (let i = 0; i <text.length; i++){
        o[alphaDict[text[i]]] ++;
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

//------------------------------------------------------------
//ffs stupid javascript why do i gotta do this
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

aT = 0;
bT= 0;

function time(d, num){
    
    let a = performance.now();
    for (let i = 0; i<num; i++){
        isEnglish("Considered an invitation do introduced sufficient understood instrument it. Of decisively friendship in as collecting at. No affixed be husband ye females brother garrets proceed. Least child who seven happy yet balls young. Discovery sweetness principle discourse shameless bed one excellent. Sentiments of surrounded friendship dispatched connection is he. Me or produce besides hastily up as pleased. Bore less when had and john shed hope. Demesne far hearted suppose venture excited see had has. Dependent on so extremely delivered by. Yet ﻿no jokes worse her why. Bed one supposing breakfast day fulfilled off depending questions. Whatever boy her exertion his extended. Ecstatic followed handsome drawings entirely mrs one yet outweigh. Of acceptance insipidity remarkably is invitation. Contented get distrusts certainty nay are frankness concealed ham. On unaffected resolution on considered of. No thought me husband or colonel forming effects. End sitting shewing who saw besides son musical adapted. Contrasted interested eat alteration pianoforte sympathize was. He families believed if no elegance interest surprise an. It abode wrong miles an so delay plate. She relation own put outlived may disposed. In by an appetite no humoured returned informed. Possession so comparison inquietude he he conviction no decisively. Marianne jointure attended she hastened surprise but she. Ever lady son yet you very paid form away. He advantage of exquisite resolving if on tolerably. Become sister on in garden it barton waited on. Necessary ye contented newspaper zealously breakfast he prevailed. Melancholy middletons yet understood decisively boy law she. Answer him easily are its barton little. Oh no though mother be things simple itself. Dashwood horrible he strictly on as. Home fine in so am good body this hope. Carriage quitting securing be appetite it declared. High eyes kept so busy feel call in. Would day nor ask walls known. But preserved advantage are but and certainty earnestly enjoyment. Passage weather as up am exposed. And natural related man subject. Eagerness get situation his was delighted. Dispatched entreaties boisterous say why stimulated. Certain forbade picture now prevent carried she get see sitting. Up twenty limits as months. Inhabit so perhaps of in to certain. Sex excuse chatty was seemed warmth. Nay add far few immediate sweetness earnestly dejection.Whether article spirits new her covered hastily sitting her. Money witty books nor son add. Chicken age had evening believe but proceed pretend mrs. At missed advice my it no sister. Miss told ham dull knew see she spot near can. Spirit her entire her called. Is post each that just leaf no. He connection interested so we an sympathize advantages. To said is it shed want do. Occasional middletons everything so to. Have spot part for his quit may. Enable it is square my an regard. Often merit stuff first oh up hills as he. Servants contempt as although addition dashwood is procured. Interest in yourself an do of numerous feelings cheerful confined. She suspicion dejection saw instantly. Well deny may real one told yet saw hard dear. Bed chief house rapid right the. Set noisy one state tears which. No girl oh part must fact high my he. Simplicity in excellence melancholy as remarkably discovered. Own partiality motionless was old excellence she inquietude contrasted. Sister giving so wicket cousin of an he rather marked. Of on game part body rich. Adapted mr savings venture it or comfort affixed friends.");
    }
    d = new Date()
    let b = performance.now()
    console.log((b-a)/1000);
    console.log(bT/ 1000, aT/1000);
}