//Setzen des Titels
document.title = 'Abgabe 3';

// Eigener Standort
var standort = [];
// Array von Bushaltestelle Objekten
var busse = [];

var naechsteBushaltestelleButton = document.getElementById('naechsteBushaltestellen');
naechsteBushaltestelleButton.addEventListener('click', () => naechsteBushaltestellen());

/**
 * Bestimmt den Standort
 */
function naechsteBushaltestellen() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(standortSetzen);
    } else {
        window.alert('Ihr Browser unterstützt keine Geolocation.');
    }
}

/**
 * Speichert den Standort und führt ein XHR Objekt aus
 * @param {*} position
 */
function standortSetzen(position) {
    standort = [];
    standort.push(position.coords.longitude);
    standort.push(position.coords.latitude);

    var x = new XMLHttpRequest();
    // Funktion, die ausgeführt wird, sobald die Daten geladen sind
    x.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            showNearbyPlaces(res);
        }
    };
    // Ausführen des Requests
    x.open('GET', 'https://rest.busradar.conterra.de/prod/haltestellen', true);
    x.send();
}

/**
 * Nach Ausführung des Requests werden die Distanzen berechnet und sortiert
 * @param {*} res
 */
function showNearbyPlaces(res) {
    let contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    res.features.forEach((item) => {
        // Erstellen des Bushaltestellen Objekts
        let h = new Bushaltestelle(
            item.properties.nr,
            item.properties.typ,
            item.properties.lbez,
            item.properties.kbez,
            item.properties.richtung,
            item.geometry
        );
        // Speichern im Array
        busse.push(h);
    });

    // Sortiert nach den Distanzen
    busse.sort(function (a, b) {
        return a.berechneDistanz(standort) > b.berechneDistanz(standort);
    });

    // Ausgabe im ContentDiv
    busse.forEach((item) => {
        contentDiv.innerHTML += item.printInfos() + item.berechneDistanz(standort) + 'm<br>';
    });
}
