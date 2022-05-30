/*
// Führt für jeden Eintrag im Array die Funktion berechneDistanz aus.
var ergebnis1 = [];
cities.forEach((item) => {
    ergebnis1.push(berechneDistanz(point[0], point[1], item[0], item[1]));
});

// Sortiert das ergebnis1array.
ergebnis1.sort(function (a, b) {
    return a - b;
});
document.getElementById('ergebnis1').innerHTML = '';
// Gibt das ergebnis1 im HTML aus.
ergebnis1.forEach((item) => {
    document.getElementById('ergebnis1').innerHTML += item + 'm<br>';
});
*/
/**
 * Berechnung der Distanz zwischen zwei Punkten. Die Koordinaten werden in Dezimalzahlen angegeben.
 * @param {*} lon1
 * @param {*} lat1
 * @param {*} lon2
 * @param {*} lat2
 */
function berechneDistanz(lon1, lat1, lon2, lat2) {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return d;
}
