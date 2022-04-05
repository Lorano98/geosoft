
// FÜhrt für jeden Eintrag in cities die Funktion berechneDistanz aus.
var ergebnis = [];
cities.forEach(item => {
    ergebnis.push(berechneDistanz(point[0], point[1], item[0], item[1]));
})

// Sortiert das Ergebnisarray.
ergebnis.sort();
// Gibt das Ergebnis im HTML aus.
ergebnis.forEach(item => {
    document.getElementById("ergebnis").innerHTML += item + "m<br>";
})

/**
 * Berechnung der Distanz zwischen zwei Punkten. Die Koordinaten werden in Dezimalzahlen angegeben.
 * @param {*} lon1 
 * @param {*} lat1 
 * @param {*} lon2 
 * @param {*} lat2 
 */
function berechneDistanz(lon1, lat1, lon2, lat2){

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres

    return d;

}