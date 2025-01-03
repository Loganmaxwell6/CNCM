scrollTime = 15;

//cookie for smelly friend
window.onload = () =>{
    let x  = document.cookie;
    if (x == ''){
        document.cookie = "style=defaultStyle;path=/";
    }
    setStyle(document.cookie.substring(6));
}

//Entire file is just for style dropdown stuff right now
function closeStyleDropdown(){
    document.getElementById("styleDropdownMenu").classList.remove("show");
}

function openStyleDropdown(){
    console.log("hwy")
    let d = document.getElementById("styleDropdownMenu");
    if (d.classList.contains("show")){
        d.classList.remove("show");
    }
    else{
        d.classList.add("show");
    }
}

function toggleMovingBackground(){
    console.log(document.getElementById('move').value)
    if (document.getElementById('move').checked){
        document.body.style.animation = "marquee 20s infinite linear"
    }else{
        document.body.style.animation = "marquee 0s infinite linear"
    }
}

/* changes the highlight colour and background for each style in the style dropdown */
function setStyle(style){
    var root = document.querySelector(':root');
    document.cookie = "style="+style+";path=/";
    switch(style) {
        case "biStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("bi-flag");
            root.style.setProperty('--highlight', 'rgba(116,77,152,1)');
            root.style.setProperty("--highlightdark", 'rgba(85,63,125,1)');
            bgsToNormal();
            break;

        case "prideStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("pride-flag");
            root.style.setProperty('--highlight', 'rgba(0,121,64,1)');
            root.style.setProperty("--highlightdark", 'rgba(1,87,47,1)');
            bgsToNormal();
            break;

        case "panStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("pan-flag");
            root.style.setProperty('--highlight', 'rgba(1,148,252,1)');
            root.style.setProperty("--highlightdark", 'rgba(0,87,150,1)');
            bgsToNormal();
            break;

        case "transStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("trans-flag");
            root.style.setProperty('--highlight', 'rgba(247,168,184,1)');
            root.style.setProperty("--highlightdark", 'rgba(196,133,146,1)');
            bgsToNormal();
            break;

        case "lesbianStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("lesbian-flag");
            root.style.setProperty('--highlight', 'rgba(247,168,184,1)');
            root.style.setProperty("--highlightdark", 'rgba(196,133,146,1)');
            bgsToNormal();
            break;

        case "transbianStyle":
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("transbian-flag");
            root.style.setProperty('--highlight', 'rgba(247,168,184,1)');
            root.style.setProperty("--highlightdark", 'rgba(196,133,146,1)');
            bgsToNormal();
            break;

        case 'darkMode':
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("dark-mode");
            root.style.setProperty('--highlight', '#666666');
            root.style.setProperty('--highlightdark', '#555555');
            bgsToNormal();
            break;

        case 'defaultStyle':
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("default-style");
            root.style.setProperty('--highlight', 'rgba(155,46,144,1)');
            root.style.setProperty('--highlightdark', 'rgba(117,34,109,1)');
            bgsToNormal();
            break;
            
        case 'benStyle':
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("ben-style");
            root.style.setProperty('--highlight', 'rgba(155,46,144,1)');
            root.style.setProperty('--highlightdark', 'rgba(117,34,109,1)');
            bgsToNormal();
            break;

        case 'bingusStyle':
            document.body.classList.remove(...document.body.classList);
            document.body.classList.add("bingus-style");
            root.style.setProperty('--highlight', 'rgba(198,155,154,1)');
            root.style.setProperty('--highlightdark', 'rgba(171,107,105,1)');
            bgsToNormal();
            break;
    }
}

/* sets background colours to how they are in dark mode. only not used in light mode */
function bgsToNormal() {
    var root = document.querySelector(':root');

    root.style.setProperty('--bg', 'hsl(0, 0%, 25%)');
    root.style.setProperty('--bgdark', 'hsl(0, 0%, 20%)');
    root.style.setProperty('--bglight', 'hsl(0, 0%, 30%)');
}