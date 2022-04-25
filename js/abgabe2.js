//Setzen des Titels
document.title = 'Abgabe 2';

// Metadaten setzen
var meta1 = document.createElement('meta');
meta1.setAttribute('name', 'author');
meta1.setAttribute('content', 'Eva Langstein');

var meta2 = document.createElement('meta');
meta2.setAttribute('name', 'description');
meta2.setAttribute('content', 'This is my cool website');

// Textfeld leeren
var textareaGeoJSON = document.getElementById('geojson');
textareaGeoJSON.value = '';

var standort = document.getElementById('standort');
standort.addEventListener('click', () => ermittlePosition());
var abstand = document.getElementById('abstand');
abstand.addEventListener('click', () => abstandBerechnen());

/**
 * Ermittelt den Browserstandort
 */
function ermittlePosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(createGeoJSON);
    } else {
        window.alert('Ihr Browser unterstützt keine Geolocation.');
    }
}

/**
 * Erstellt einen geoJSON String aus dem Standort
 * @param {*} position
 */
function createGeoJSON(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    let geojson = {
        type: 'Feature',
        properties: null,
        geometry: {
            type: 'Point',
            coordinates: [long, lat]
        }
    };

    textareaGeoJSON.value = JSON.stringify(geojson, null, 2);
}

/**
 * Berechnet den Abstand vom eingegebenen Punkt zu den POIs.
 */
function abstandBerechnen() {
    // Wandelt einen String in ein Objekt um.
    let geojson = JSON.parse(textareaGeoJSON.value);

    // Führt für jeden Eintrag im Array die Funktion berechneDistanz aus.
    var ergebnis2 = [];
    poi.features.forEach((item) => {
        ergebnis2.push([
            berechneDistanz(
                geojson.geometry.coordinates[0],
                geojson.geometry.coordinates[1],
                item.geometry.coordinates[0],
                item.geometry.coordinates[1]
            ),
            item.properties.name
        ]);
    });

    console.log(ergebnis2);

    // Sortiert das ergebnis1array.
    ergebnis2.sort(function (a, b) {
        return a[0] > b[0];
    });
    document.getElementById('ergebnis2').innerHTML = '';
    // Gibt das ergebnis1 im HTML aus.
    ergebnis2.forEach((item) => {
        document.getElementById('ergebnis2').innerHTML += item[1] + ': ' + item[0] + 'm<br>';
    });
    let coords = [];
    poi.features.forEach((item) => {
        coords.push(item.geometry.coordinates);
    });

    console.log(berechneDistanz(7.595876025644574, 51.969011917421255, 7.595725, 51.969422));
}
