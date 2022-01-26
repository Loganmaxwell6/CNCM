function polluxCipher(text=globalText.slice(0)){
    let masterScore = 10000
    let masterKey = []
    for (let x= 0; x < 10; x++){
        let key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("").map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)        
        let score = bigramTest(morseToText(applyPolluxKey(text, key, i, x)));
        for (let i =0; i < 500; i++){
            let newKey = fullSwapTest(text, key, score);
            if (newKey == -1){
                console.log(i)
                break;
            }else{
                key = newKey[0].slice(0);
                score = newKey[1];
            }
        }
        if (score < masterScore){
            masterScore = score
            masterKey = key
        }
    }
        
    //key = substitutionAnnealing(bigramFreq, key, text.length, score);
    
    console.log(masterScore, masterKey)
    return removePlayfairKey(masterKey, text);
}

function applyPolluxKey(text, key, pointer1, pointer2){
    let newText = ""
    for (let i = 0; i < text.length; i++){
        if (key.indexOf(text[i]) < pointer1){
            newText += "."
        }else if(key.indexOf(text[i]) < pointer2 ){
            newText += "-"
        }else{
            newText += "/"
        }
    }
}

function morseToText(text){
    text = text.split("/");
    return text.map((char) => morse[char]);
}

function fullSwapTest(text, key, keyScore){
    function s(text, key){
        for (let y = 0; y < 36; y ++){
            let testKey = [...testKey.slice(y, length),...testKey.slice(0,y)];
            for (let i = 0; i< 26; i++){
                for (let x = i; x<26;x++){
                    return bigramTest(morseToText(applyPolluxKey(text, key, i, x)))
                }
            }
        }
        
    }
    for (let i = 0; i < key.length; i++){
        for (let x = i; x < key.length; x++){
            if (!(i == x)){
                let testKey = key.slice(0);
                let firstLetter = testKey[i];
                testKey[i] = testKey[x];
                testKey[x] = firstLetter;
                let test = s(text, testKey);
                let score = test;
                if (score < keyScore || (score - 50 < keyScore && Math.random(2) == 1)){
                    return [testKey,score];
                }
            }
        }
    }
    return -1;
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

function removeDotDash(text=globalText.slice()){
    dots = "123456789P".split("")
    dash = "ABCDEFGHIJKLMNOQRSTUVWXY".split("")
    slash = "Z".split("")
    let newText = ""
    console.log(text)
    for (let i = 0; i< text.length; i++){
        if (dots.includes(text[i])) {
            newText += "."
        }else if(dash.includes(text[i])){
            newText += "-"
        }else{
            newText += "/"
        }
        
    }
    return newText;
}

function removePlayfairKey(key, text){
    //key = generateFullKey(key.toLocaleUpperCase());
    let newText = "";
    for (let i = 0; i < text.length -1; i+=2) {
        point1 = key.indexOf(text[i]);
        point2 = key.indexOf(text[i+1]);
        if (point1 %6 == point2%6){
            newText += key[mod((point1 + 6),36)];
            newText += key[mod((point2 + 6),36)];
        }else if(Math.floor(point1 / 6) == Math.floor(point2 / 6)){
            newText += key[mod((point1 + 6),36)];
            newText += key[mod((point2 + 6),36)];
        }else{
            newText += key[point2%6 + (Math.floor(point1 / 6) *6)];
            newText += key[point1%6 + (Math.floor(point2 / 6) *6)];
        }
    }
    return newText;
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function substitutionCipher(text=invertBigrams(globalText.slice(0))){
    let masterScore = 10000
    let masterKey = []
    for (let x= 0; x < 50; x++){
        let key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("").map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)        
        let score = bigramTest(removePlayfairKey(key, text))
        for (let i =0; i < 500; i++){
            let newKey = fullSwapTest(text, key, score);
            if (newKey == -1){
                console.log(i)
                break;
            }else{
                key = newKey[0].slice(0);
                score = newKey[1];
            }
        }
        console.log(score)
        if (score < masterScore){
            masterScore = score
            masterKey = key
        }
    }
        
    //key = substitutionAnnealing(bigramFreq, key, text.length, score);
    
    console.log(masterScore, masterKey)
    return removePlayfairKey(masterKey, text);
}


function rand(s, e){
    if (s == 0){
        return (Math.floor(Math.random() * e+1));
    }
    else{
        return (Math.floor(Math.random() * (e-s)) + s);
    }
}

function fullSwapTest(text, key, keyScore){
    function s(text, key){
        return count = bigramTest(removePlayfairKey(key, text))
    }
    for (let i = 0; i < key.length; i++){
        for (let x = i; x < key.length; x++){
            if (!(i == x)){
                let randNum = rand(0,5);
                let testKey = key.slice(0);
                if (randNum == 1){
                    let i = Math.floor(Math.random() * length)
                    let x = Math.floor(Math.random(length) * length)
                    while(i == x){
                        x = Math.floor(Math.random(length) * length);
                    }
                    let firstLetter = testKey[i];
                    testKey[i] = testKey[x];
                    testKey[x] = firstLetter;
                }else if(randNum == 2){
                    let p = Math.floor(Math.random() * length);
                    testKey = [...testKey.slice(p, length),...testKey.slice(0,p)];
                }else if(randNum == 3){
                    testKey = testKey.reverse();
                }else{//if(randNum ==4){
                    for (let i = 0; i < length -1; i+=2){
                        let firstLetter = testKey[i];
                        testKey[i] = testKey[i+1];
                        testKey[i+1] = firstLetter;
                    }
                }
                let test = s(text, testKey);
                let score = test;
                if (score < keyScore || (score - 50 < keyScore && Math.random(2) == 1)){
                    return [testKey,score];
                }
            }
        }
    }
    return -1;
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

function expectedBigramCount(t){
    let e = [];
    for (let a = 0; a < ALPHA.length; a++){
        for (let b = 0; b < ALPHA.length; b++){
            e.push(bigrams[(a * 26) + b] * t);
        }
    }
    return e;
}

ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

function observedBigramCount(text){
    let o = [];
    for (let i = 0; i < 676; i++){
        o.push(0);
    }
    for (let i = 0; i < text.length-1; i++){
        if (ALPHA.includes(text[i])){
            o[(ALPHA.indexOf(text[i]) * 26) + (ALPHA.indexOf(text[i+1]))]++;
        }
        
    }
    return o;
}

function indexOfDigraphicCoincidence(text){
    let a = mostCommonBigram(text);
    console.log(a)
    o= [];
    for(const [key, value] of Object.entries(a)){
        o.push(value)
    }
    o = [...o, ...Array(1296 - o.length).fill(0)]
    let n = 0;
    let sum = 0;
    for (let i = 0; i < 1296; i++){
        sum += o[i] * (o[i] - 1);
        n += o[i];
    }
    console.log(sum, n)
    return (sum / (n * (n-1)));
}

function mostCommonBigram(text){
    text = text.split("");
    bgc = {};
    for (let i = 0; i < text.length - 1; i++){
        bgc[text[i] + text[i+1]] = 0;
    }
    for (let i = 0; i < text.length - 1; i++){
        bgc[text[i] + text[i+1]] += 1;
    }
    return bgc;
}

function invertBigrams(text){
    let t = text.match(/.{1,2}/g); // bruh
    for(let i = 0; i < t.length;i++){
        t[i] = t[i][1]+t[i][0];
    }
    return t.join("");
}

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

function playfairCipher(text){
    function s(text, key){
        return bScore(removePlayfairKey(key, text))
    }
    let swaps = [2, 3 , 5, 8, 20, 21, 23]
    let mKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("").map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)      
    let mScore = bScore(removePlayfairKey(mKey, text))
    for (let T = 10; T > 0; T--){
        let length = 36;//mKey.length;
        for (let gen = 50000; gen > 0; gen--){
            let testKey = mKey.slice(0);
            let randNum = 1//rand(0,4)
            if (randNum == 1){
                let i = Math.floor(Math.random() * length)
                let x = Math.floor(Math.random(length) * length)
                while(i == x){
                    i = Math.floor(Math.random() * length)
                    x = Math.floor(Math.random(length) * length);
                }
                let firstLetter = testKey[i];
                testKey[i] = testKey[x];
                testKey[x] = firstLetter;
            }
            let testScore = s(text, testKey);
            if (testScore < mScore || ( testScore - (100*T) < mScore && rand(0,10) == 1)){
                console.log(mScore)
                mScore = testScore
                mKey = testKey
            }
        }
        console.log(removePlayfairKey(mKey, text))
        console.log(mScore, mKey)
    }
    
    console.log(mKey, length, mScore)
    return removePlayfairKey(mKey, text);
}

function bScore(text){
    let sum = 0
    for (let i =0; i < text.length -1; i++){
        if ( text[i] in alphaDict && text[i+1] in alphaDict){
             sum += -Math.log(bigrams[alphaDict[text[i]] * 26 + alphaDict[text[i + 1]]])
        }else{
            if (parseInt(text[i]) > 0 || parseInt(text[i+1]) > 0){
                sum += 300
            }
        }
    }
    return sum;
}

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