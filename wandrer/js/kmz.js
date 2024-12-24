  // Function to handle loading KMZ files
  function loadKMZFromFile(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const arrayBuffer = event.target.result;

        // Use JSZip to unzip the KMZ file
        JSZip.loadAsync(arrayBuffer).then(function(zip) {
            // Find all KML files in the KMZ archive
            const kmlFiles = Object.keys(zip.files).filter(fileName => fileName.endsWith('.kml'));

            if (kmlFiles.length > 0) {
                // Process each KML file
                kmlFiles.forEach(function(kmlFileName) {
                    zip.files[kmlFileName].async('string').then(function(kmlText) {
                        processKMLToGraph(kmlText)
                    });
                });
            } else {
                console.error('No KML files found in the KMZ archive.');
            }
        }).catch(function(error) {
            console.error('Error unzipping KMZ file:', error);
        });
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };

    reader.readAsArrayBuffer(file);
}