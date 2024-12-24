const slider = document.getElementById('slider');
const sliderValue = document.getElementById('sliderValue');

slider.addEventListener('mouseup', async function () {
    sliderValue.textContent = slider.value / 10;
    penalty = sliderValue.textContent
    polylineGroup.clearLayers()
    
    var path = await aStar(route[0], route[1], graph)
    
    // Convert the path into a Leaflet polyline and add it to the map
    path = path == null ? [] : path
    const pathCoordinates = path.map(node => {
        const [lat, lng] = node.split(',').map(Number);
        return [lat, lng];
    });

    L.polyline(pathCoordinates, { color: 'green', weight: 4 }).addTo(polylineGroup);
    
});

const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');

var mode = "path"

function toggleButtons(selectedButton, otherButton) {
    // Highlight the selected button and disable the other
    selectedButton.classList.add('active');
    otherButton.classList.remove('active');
}

// Add event listeners to buttons
button1.addEventListener('click', () => {toggleButtons(button1, button2);mode = "path"});
button2.addEventListener('click', () => {toggleButtons(button2, button1);mode = "fill"});
button1.classList.add('active');

// Optional: Add active styling for the buttons
document.querySelectorAll('.toggleButton').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.toggleButton').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
    });
});

const button = document.getElementById("downloadButton")
button.addEventListener('click', function () {
    coordinatesToGPX(coordinates);
})

function clearMap(){
    map.eachLayer(function(layer) {
        if (layer instanceof L.Polyline || layer instanceof L.Marker || layer instanceof L.Rectangle) {
            map.removeLayer(layer);
        }
    });
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.kmz')) {
        const fileInput = document.getElementById("kmzUploader");
        const loadingCircle = document.getElementById("loadingContainer");

        fileInput.disabled = true;
        loadingCircle.style.display = "flex";

        waitForDOMUpdate().then(() => {
            loadKMZFromFile(file);
        });
    } else {
        alert('Please upload a valid KMZ file.');
    }
}

function finishUpload(){
    const loadingCircle = document.getElementById("loadingContainer")
    const removeButton = document.getElementById("removeFileButton")
    
    loadingCircle.style.display = "none"
    removeButton.style.display = "flex"
}

function removeFile() {
    const fileInput = document.getElementById("kmzUploader");
    const removeButton = document.getElementById("removeFileButton");

    fileInput.value = ""; // Clear the file input value
    fileInput.disabled = false
    removeButton.style.display = 'none'; // Hide the "Remove File" button

}

removeFile()