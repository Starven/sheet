function Sheet(canvas, context, title, composer) {

    this.title = title;
    this.composer = composer;

    this.canvas = canvas;
    this.context = context;

    this.Measures = [];
    this.Tracks = [];

    this.scale = 1.0;

    this.measureLength = 300;

    this.camera = {x: this.canvas.width / 2 - this.measureLength, y: 150};

    this.measure_over = -1;
    this.line_over = -1;
    this.section_over = -1;
    this.track_over = -1;

    this.mouse_clicked = false;
    this.touching = false;
    this.dragging = false;
    this.dragPos = {x: 0, y: 0};
    this.clickPos = {x: 0, y: 0};

    this.noteValue = 4;
    this.alteration = 0;
    this.insertRest = false;

    this.currentMeasure = 0;

    this.notate = false;
    this.notateRest = false;

    this.moveNotes = false;

    this.audioPlayer = new AudioPlayer(this.context, this.canvas, this.camera);
    this.audioPlayer.setVolume(-0.9);

    this.measuresSelected = [];
    this.selected_notes = [];

    this.uiColour = "rgb(130, 179, 216)";
    this.highlightColour = "rgb(239, 151, 43)";

    this.renderCanvasInterface = false;

    this.selectedClef = "treble"; //doesn't do anything yet
    this.selectedKeySig = "CMaj"; // doesn't do anything yet

    this.canvasUI = new CanvasUI(this.renderCanvasInterface);

    this.iHandler = new ImageHandler();

}

Sheet.prototype.newFile = function() {

    this.Tracks = [];
    this.Tracks.push(new Track(0,
        [new Measure(0, {beats: 4, value: 4}, "Am", "treble", (this.measureLength * this.scale), (this.measureLength * this.scale) / (this.measureLength / 100), {x: 50, y: 100}, true, false, true)], 
        "piano", this.iHandler));

   // this.Tracks.push(new Track(1, 
      //  [new Measure(1, {beats: 4, value: 4}, "Am", "bass", (this.measureLength * this.scale), (this.measureLength * this.scale) / (this.measureLength / 100), {x: 50, y: 400}, true, false, true)], "piano"));
}

Sheet.prototype.addMeasures = function() {

    for (let t=0;t<this.Tracks.length;t++) {
        let offset = this.Tracks[t].Measures[this.Tracks[t].Measures.length-1].xOffset + this.measureLength;
        let clef = this.Tracks[t].Measures[this.Tracks[t].Measures.length-1].clef;

        //create a new blank measure oh boy

        let new_measure = new Measure(this.Tracks[t].Measures.length, 
            {beats: this.Tracks[t].Measures[this.Tracks[t].Measures.length-1].timeSignature.beats, 
                value: this.Tracks[t].Measures[this.Tracks[t].Measures.length-1].timeSignature.value}, 
                "Am", clef, (this.measureLength * this.scale), (this.measureLength * this.scale) / (this.measureLength / 100), 
                {x: this.Tracks[t].Measures[this.Tracks[t].Measures.length-1].position.x + offset + this.Tracks[t].Measures[this.Tracks[t].Measures.length-1].marginLeft, 
                    y: this.Tracks[t].Measures[this.Tracks[t].Measures.length-1].position.y}, false, false, false, this.iHandler);
    

        this.Tracks[t].Measures.push(new_measure);
    }

    this.renderMeasures();
}

Sheet.prototype.renderMeasures = function() {

    this.context.fillStyle = "rgb(255,255,255)";
    this.context.fillRect(0,0, this.canvas.width, this.canvas.height);

    //render title and composer

    this.context.textAlign = "left";

    this.context.fillStyle = "rgb(0, 0, 0)";
    this.context.font = "48px Montserrat";
    this.context.fillText(this.title, this.camera.x + this.measureLength / 2, this.camera.y - 50);

    this.context.fillStyle = "rgb(0, 0, 0)";
    this.context.font = "16px Montserrat";
    this.context.fillText("Composer: " + this.composer, this.camera.x + this.measureLength / 2, this.camera.y - 20);


    //render tracks and measures


    for (let t=0;t<this.Tracks.length;t++) {
        for (let measure=0;measure<this.Tracks[t].Measures.length;measure++){
            this.Tracks[t].Measures[measure].render(this.context, this.canvas, this.camera, this.notate);
        }
    }

}


Sheet.prototype.playMeasure = function(measure) {
    for (let t=0;t<this.Tracks.length;t++) {

        let sections = this.audioPlayer.returnSections(this.Tracks[t].Measures[measure].sections, 0);
        let audioCtx = this.audioPlayer.getContext();
        let gainNode = this.audioPlayer.getGainNode();
        let destination = this.audioPlayer.getDestination();

        this.playback(sections, 0, audioCtx, gainNode, destination, t);

    }
}

Sheet.prototype.playback = function(sections, index, context, gainNode, destination, trackNumber) {

    if (true) { // Don't know why this is here?

        if (sections[index].note != 'rest') {

            let osc_list = []; //list of oscillators

            for (let n=0;n<sections[index].notes.length;n++) {

                sections[index].notes[n].selected = true;

                let os = context.createOscillator();
                os.connect(gainNode);
                os.connect(destination);
                os.type = 'sine';
                os.frequency.setValueAtTime(this.getFrequency(sections[index].notes[n].pitch), context.currentTime);
                osc_list.push(os);

            }

            for (let o=0;o<osc_list.length;o++) {

                osc_list[o].start(context.currentTime);
                osc_list[o].stop(context.currentTime + sections[index].value);
                this.renderMeasures();
            
            }

        }

        let nextIndex = ++index;

        let self = this;

        setTimeout(function() {

            console.log("Is something playing?");

            this.renderMeasures();

            if (sections[index].note != 'rest') {

                for (let n=0;n<sections[index].notes.length;n++) {

                    sections[index].notes[n].selected = false;

                }

            }

            if (index < sections.length - 1) {
                this.playback(sections, nextIndex, context, gainNode, destination, trackNumber);
            } else {
                if (this.currentMeasure < Tracks[0].Measures.length-1) {
                    if (trackNumber === Tracks.length-1) {

                        this.currentMeasure += 1;
                        this.playMeasure(this.currentMeasure);

                    }
                }
            }

            this.renderMeasures();


        }, 1000 * sections[index].value)

        this.renderMeasures();

    }

}

Sheet.prototype.deleteSelected = function() {

    this.selected_notes.sort(function(a, b) {
        return b.note - a.note;
    });

    for (let n=0;n<this.selected_notes.length;n++) {

        let sn = this.selected_notes[n];

        
        this.Tracks[sn.track].Measures[sn.measure].sections[sn.section].removeNote(sn.note);
        this.renderMeasures();

    }

    for (let n=0;n<this.selected_notes.length;n++) {
        let sn = this.selected_notes[n];
        this.Tracks[sn.track].Measures[sn.measure].previewMeasure.setSections(this.Tracks[sn.track].Measures[sn.measure].sections);
    }

    this.selected_notes = [];

}

Sheet.prototype.resize = function(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;

    this.renderMeasures();
}


Sheet.prototype.keyInput = function(e) {

    if (e.keyCode === 49) {
        this.noteValue = 16;
    } else if (e.keyCode === 50) {
        this.noteValue = 8;
    } else if (e.keyCode === 51) {
        this.noteValue = 4;
    } else if (e.keyCode === 52) {
        this.noteValue = 2;
    } else if (e.keyCode === 53) {
        this.noteValue = 1;
    } else if (e.keyCode === 190) {
        //dot note
        this.noteValue += (this.noteValue / 2);
    }

    if (e.keyCode === 82) {
        this.insertRest = !this.insertRest;
    }

    if (e.keyCode == 46) {
        //delete notes
        this.deleteSelected();
    }

    if (e.keyCode === 187) {
        this.addMeasures();
    }

    if (e.keyCode === 32) {
         //this.currentMeasure = 0;
         //this.playMeasure(0);
     }

     if (e.keyCode === 70) {
        this.Tracks[this.track_over].Measures[this.measure_over].showSections = !this.Tracks[this.track_over].Measures[this.measure_over].showSections;

     }


}

Sheet.prototype.mouseMove = function(cx, cy) {

    let rect = this.canvas.getBoundingClientRect();
    let x = cx - rect.left;
    let y = cy - rect.top;

    let mx = x;
    let my = y;

    x = x - this.camera.x;
    y = y - this.camera.y;

    let hovered = false;

    let UIHover = false; 

    if (!this.dragging) {

        

        for (let t=0;t<this.Tracks.length;t++) {

            for (let m=0;m<this.Tracks[t].Measures.length;m++) {

                let over = false;

                if (this.Tracks[t].Measures[m].mouseOver(x, y)) {

                    this.track_over = t;
                    this.renderMeasures();
                    hovered = true;

                } else {
                    this.renderMeasures();
                    hovered = false;
                }

                if (hovered) {

                    

                    for (let l=0;l<this.Tracks[t].Measures[m].lines.length;l++) {

                        if (this.Tracks[t].Measures[m].lines[l].mouseOver(x, y)) {

                            this.track_over = t;
                            this.measure_over = m;
                            this.line_over = l;
                            this.section_over = this.Tracks[t].Measures[m].mouseOverSection(x, y);

                            if (this.notate) { //ready to input notes, so preview the next mutation

                                let restNote = (this.insertRest) ? "rest" : "note";

                                if (this.section_over != undefined) {

                                    this.Tracks[t].Measures[this.measure_over].previewMeasure.prev(this.Tracks[t].Measures[m], 
                                        this.noteValue, 
                                        this.restNote,
                                        this.section_over,
                                        this.Tracks[t].Measures[this.measure_over].lines[this.line_over],
                                        this.alteration);

                                    hovered = true;

                                }
                            }
                            this.Tracks[t].Measures[m].lines[l].render(this.context, this.canvas, this.camera);

                        } else { //not in notation input mode

                            

                            for (let l=0;l<this.Tracks[t].Measures[m].lines.length;l++) {
                                if (this.Tracks[t].Measures[m].lines[l].mouseOver(x, y)) 
                                {
                                
                                    this.track_over = t;
                                    this.measure_over = m;
                                    this.line_over = l;
                                    this.section_over = this.Tracks[t].Measures[m].mouseOverSection(x, y);

                                }
                            }

                        }

                    }
                }

            }

        }
    }   else if (this.dragging) {

        this.camera.x = this.camera.x + (x - this.dragPos.x);
        this.camera.y = this.camera.y + (y - this.dragPos.y);

    }

    this.renderMeasures();

}

Sheet.prototype.inputNote = function(cx, cy, e, touch) {

    let rect = this.canvas.getBoundingClientRect();

    let x = cx - rect.left;
    let y = cy - rect.top;

    x = x - this.camera.x;
    y = y - this.camera.y;

    this.mouseDown = true;

    if (!this.mouse_clicked && e.button === 0 || touch) {

        if (this.Tracks[this.track_over].Measures[this.measure_over] != undefined && 
            this.Tracks[this.track_over].Measures[this.measure_over].lines[this.line_over] != undefined &&
            this.Tracks[this.track_over] != undefined) {

            if (this.notate) {

                let restNote = (this.insertRest) ? "rest" : "note";

                this.Tracks[this.track_over].Measures[this.measure_over].mutateSect(this.Tracks[this.track_over].Measures[this.measure_over].sections[this.section_over],
                    this.noteValue,
                    restNote,
                    this.section_over,
                    this.Tracks[this.track_over].Measures[this.measure_over].lines[this.line_over], 
                    this.alteration);

                this.Tracks[this.track_over].Measures[this.measure_over].previewMeasure.setSections(this.Tracks[this.track_over].Measures[this.measure_over].sections);

                this.renderMeasures();

            } else {
                for (n=0;n<this.Tracks[this.track_over].Measures[this.measure_over].sections[this.section_over].notes.length;n++) {
                    if (this.Tracks[this.track_over].Measures[this.measure_over].sections[this.section_over].notes[n].mouseOver(x, y)) {
                        this.Tracks[this.track_over].Measures[this.measure_over].sections[this.section_over].notes[n].selected = !this.Tracks[this.track_over].Measures[this.measure_over].sections[this.section_over].notes[n].selected;

                        this.selectNote(this.track_over, this.measure_over, this.section_over, n);

                    }
                }
            }

        }

    }

    if (!this.dragging && e.button === 1 || !this.dragging && touch) {

        if (touch) {
            if (!this.notate) {
                this.dragging = true;
                this.dragPos = {x: x, y: y};
            }
        } else {
            this.dragging = true;
            this.dragPos = {x: x, y: y};
        }

        

    }

}

Sheet.prototype.mouseUp = function() {

    if (this.dragging) {
        this.dragging = !this.dragging;
    }

}

Sheet.prototype.selectNote = function(track, measure, section, note) {

    let note_in_array = false;

    for (let n=0;n<this.selected_notes.length;n++) {

        if (this.selected_notes[n].track == track &&
            this.selected_notes[n].measure == measure &&
            this.selected_notes[n].section == section &&
            this.selected_notes[n].note == note) {
                note_in_array = true;
                console.log("IN ARRAY");

            this.selected_notes.splice(n, 1);
        }

    }

    if (!note_in_array) {
        this.selected_notes.push({track: track, measure: measure, section: section, note: note});
    }

}








