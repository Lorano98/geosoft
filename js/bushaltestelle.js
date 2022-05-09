// define a class Bushaltestelle with its constructor
/**
 * @class
 */
class Bushaltestelle {
    /**
     * attributes from the api
     * @param {*} nr
     * @param {*} typ
     * @param {*} lbez
     * @param {*} kbez
     * @param {*} richtung
     * @param {*} geometry
     */
    constructor(nr, typ, lbez, kbez, richtung, geometry) {
        this.nr = nr;
        this.typ = typ;
        this.lbez = lbez;
        this.kbez = kbez;
        this.richtung = richtung;
        this.geometry = geometry;
    }

    /**
     * Berechnet die Distanz von einem Punkt zu dieser Bushaltestelle
     * @param {*} point
     * @returns distanz
     */
    berechneDistanz(point) {
        let lon1 = this.geometry.coordinates[0];
        let lat1 = this.geometry.coordinates[1];
        let lon2 = point[0];
        let lat2 = point[1];

        const R = 6371e3; // metres
        const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres

        return d;
    }

    /**
     * Gibt die Attribute des Objektes aus
     * @returns
     */
    printInfos() {
        return this.nr + ' ' + this.lbez + ' ' + this.richtung;
    }
}
