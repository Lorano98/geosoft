//Setzen des Titels
document.title = 'Abgabe 4';

var bushaltestellenMarker = [];
var rec = null;

// Karte mit Zentrum definieren
var map = L.map('map').setView([51.96, 7.62], 13);

// OSM Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Toolbar zum Zeichnen von Rechtecken
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: false,
        marker: false,
        circle: false,
        polyline: false
    }
});
map.addControl(drawControl);

// Event Listener, der aktiv wird, wenn fertig gezeichnet wurde
map.on(L.Draw.Event.CREATED, function (e) {
    rec = e.layer;
    map.addLayer(rec);

    // Bounding Box
    let bb = e.layer.getLatLngs();
    let poly = [];

    bb[0].forEach((item) => {
        poly.push([item.lat, item.lng]);
    });
    // Erste Koordinate nochmal hinzufügen
    poly.push([bb[0][0].lat, bb[0][0].lng]);

    bushaltestellenMarker.forEach((item) => {
        let c = item.getLatLng();
        // Löscht alle Bushaltestellen, die nicht in der Boundingbox liegen
        if (!turf.booleanPointInPolygon(turf.point([c.lat, c.lng]), turf.polygon([poly]))) {
            map.removeLayer(item);
        }
    });
});

// Löschen des letzten Rectangle
map.on(L.Draw.Event.DRAWSTART, function (e) {
    if (rec != null) {
        map.removeLayer(rec);
    }
});

loadBushaltestellen();

// Standortabfrage
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        standort = [position.coords.longitude, position.coords.latitude];
        // Standortarray wird umgedreht, da lat und lon vertauscht sind
        // Standort wird auf der Karte eingefügt
        L.marker(standort.reverse(), { zIndexOffset: 1000 }).addTo(map).bindPopup('Dein Standort');
    });
} else {
    window.alert('Ihr Browser unterstützt keine Geolocation.');
}

/**
 * Läd die Bushaltestellen
 */
function loadBushaltestellen() {
    fetch('https://rest.busradar.conterra.de/prod/haltestellen')
        .then((response) => {
            let res = response.json(); // return a Promise as a result
            console.log(res);
            res.then((data) => {
                // get the data in the promise result
                console.log(data);
                //bushaltestellenFetch = data.features;
                let haltestellenIcon = L.icon({
                    iconUrl: 'img/haltestelle.png',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    popupAnchor: [0, -10]
                });
                data.features.forEach((item) => {
                    let c = item.geometry.coordinates;
                    let p = item.properties;
                    // Popup
                    let popupText = item.properties.lbez + (p.richtung == undefined ? '' : ' ' + p.richtung);
                    // Speichern der Bushaltestellenmarker und hinzufügen zur Karte
                    bushaltestellenMarker.push(
                        L.marker([c[1], c[0]], { icon: haltestellenIcon, zIndexOffset: -1000 })
                            .addTo(map)
                            .bindPopup(popupText)
                    );
                });
            });
        })
        .catch((error) => console.log(error));
}
