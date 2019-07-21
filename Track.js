function Track(id, measures_one, instrument, imageHandler) {
    this.id = id;
    this.Measures = measures_one.slice();
    this.instrument = instrument;
    this.iHandler = imageHandler;
}

Track.prototype.getMeasures = function() {
    return this.Measures;
}

Track.prototype.addMeasure = function(measure) {
    this.Measures.push(measure);
}