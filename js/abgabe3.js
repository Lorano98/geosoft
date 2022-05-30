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
    standort = [position.coords.longitude, position.coords.latitude];

    let x = new XMLHttpRequest();
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
    contentDiv.innerHTML = '<b>Nächste Haltestellen:<br></b>';

    busse = [];

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

    // Ausgabe im Div
    busse.forEach((item) => {
        contentDiv.innerHTML += item.printInfos() + ': ' + item.berechneDistanz(standort).toFixed(2) + 'm<br>';
    });

    naechsteFahrt();
}

/**
 * Erstellt ein Request für die Abfahrten der nächsten Haltestelle
 */
function naechsteFahrt() {
    let x = new XMLHttpRequest();
    // Funktion, die ausgeführt wird, sobald die Daten geladen sind
    x.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            showNearbyFahrten(res);
        }
    };
    // Ausführen des Requests
    x.open(
        'GET',
        // Filter nach nächstem Bus und 5 Minuten
        'https://rest.busradar.conterra.de/prod/haltestellen/' + busse[0].nr + '/abfahrten?sekunden=300"',
        true
    );
    x.send();
}

/**
 * Zeigt die Fahrten an
 * @param {*} res
 */
function showNearbyFahrten(res) {
    let fahrtDiv = document.getElementById('naechsteFahrt');
    fahrtDiv.innerHTML = '<b>Nächste Abfahrten an Station ' + busse[0].printInfos() + ':</b><br>';

    if (res.length == 0) {
        fahrtDiv.innerHTML += 'Keine Abfahrten in den nächsten 5 Minuten.';
    } else {
        res.forEach((item) => {
            fahrtDiv.innerHTML +=
                'Linie ' +
                item.linienid +
                ' Richtung ' +
                item.richtungstext +
                ' um ' +
                toTime(item.abfahrtszeit) +
                '<br>';
        });
    }
}

/**
 * Wandelt die Unix Zeit in normale Zeit um über ein Date Objekt
 * @param {*} unix
 * @returns
 */
function toTime(unix) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = '0' + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = '0' + date.getSeconds();

    // Will display time in 10:30:23 format
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
}
