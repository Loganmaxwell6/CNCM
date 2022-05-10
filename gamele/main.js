function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        }else{
            a[i].style.display = "none";
        }
    }
}

const randSize = 1000
const randSeed = 18
const randList = genRand()

const games = ['Absurdle', 'Antiwordle', 'Crosswordle', 'Dordle', 'Foodle', 'Globle', 'Heardle', 'Kilordle', 'Letterle', 'Lewdle', 'Nerdle', 'Octordle', 'Primle', 'Quordle', 'Scholardle', 'Semantle', 'Squirdle', 'Sweardle', 'Taylordle', 'Tradle', 'Wordle', 'Worldle']

const wordToday = []

function genRand(){
    let randMax = 2147483647
    function pseudoRandom(seed) {
        let value = seed;
        return function() {
            value = value * 16807 % randMax;
            return value;
        }
    }
    let generator = pseudoRandom(randSeed);
    return Array(randSize).fill(0).map(()=>Math.floor(generator() * games.length / randMax));
}

