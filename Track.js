function Track(id, measures_one) {
    this.id = id;
    this.Measures = measures_one.slice();
}

Track.prototype.getMeasures = function() {
    return this.Measures;
}

Track.prototype.addMeasure = function(measure) {
    this.Measures.push(measure);
}