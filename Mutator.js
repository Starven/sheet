function Mutator(measure) {

    this.measure = measure;

}

Mutator.prototype.setMeasure = function(measure) {
    this.measure = measure;
}

Mutator.prototype.mutateSection = function(sections, value, note, section_index, line, addedNote, alteration) {


    let position = {};
    let section = sections[section_index];

    //----- VALUE IS THE SAME -------------------------------


    if (value === section.value) {

        position = {x: sections[section_index].position.x + sections[section_index].width / 2, y: line.position.y};

        if (note != "rest") {

            sections[section_index].notes.push(new Note(addedNote, value, position, line, alteration));
            sections[section_index].notePosition = {x: sections[section_index].position.x + sections[section_index].width / 2, 
                y: line.position.y};

        } else {

            sections[section_index].notePosition = {x: sections[section_index].position.x + sections[section_index].width / 2,
                y: sections[section_index].position.y + 40};
            sections[section_index].notes = [];
        }

        sections[section_index].note = note;

        this.setBeats();
        this.analyseNotes();

    } else if (value < section.value) {

        //------- VALUE IS SMALLER ------------------------------

        sections[section_index].value = value;
        sections[section_index].note = note;
        sections[section_index].width = this.getSectionWidthByValue(value);
        position = {x: sections[section_index].position.x + sections[section_index].width / 2,
            y: line.position.y};

        //console.log("Added value: " + value);
        
        
        if (note != "rest") {

            sections[section_index].notes.push(new Note(addedNote, value, position, line, alteration));
            sections[section_index].notePosition = {x: sections[section_index].position.x + sections[section_index].width / 2,
                y: line.position.y};

        } else {

            sections[section_index].notePosition = {x: sections[section_index].position.x + sections[section_index].width / 2,
                y: sections[section_index].position.y + 40};
            sections[section_index].notes = [];

        }

       // console.log(sections[section_index].width);

        let totalvalue = 0;

        for (let s=0;s<sections.length;s++) {

            totalvalue += sections[s].value;
           // console.log(sections[s].value);
        }

        for (let n=0;n<sections[section_index].notes.length;n++) {

            position = {x: sections[section_index].position.x + sections[section_index].width / 2,
                y: sections[section_index].notes[n].line.position.y};
                
            sections[section_index].notes[n].duration = value;
            sections[section_index].notes[n].position = position;

           // console.log("newtest");
             //   console.log(position);

        }


        // this will have to be a return value?? change slightly how it functions

        //console.log(sections)
       // this.getFillSections(totalvalue, this.measure.timeSignature.value, [], section_index);
      // console.log("Fill Sections Value: " + value);
        this.getFillSections(totalvalue, value, [], section_index);


    } else if (value > section.value) {

        //------ VALUE IS LARGER ----------------------------------
 
        let diff = value-section.value;

        //check next sections

        //console.log("Value: " + value + " Section Value: " + section.value + " DIFF: " + diff);

        let spliced_sections = 0;

        for (let fs=section_index+1;fs<sections.length;fs++) {

            if (sections[fs].note === "rest") {

                let boopitidoo = false;

               // while (!boopitidoo) {

               // console.log("Value: " + value + " val + Section Value: " + sections[fs].value + diff + " DIFF: " + diff);

                if (diff + sections[fs].value === value) {

                    // ---- there is enough room 

                    spliced_sections += 1;

                    sections.splice(section_index+1, spliced_sections);
                    sections[section_index].notes = [];
                    sections[section_index].value = value;
                    sections[section_index].note = note;
                    sections[section_index].width = this.getSectionWidthByValue(value);
                    position = {x: sections[section_index].position.x + sections[section_index].width / 2,
                        y: line.position.y};

                    

                    sections[section_index].notes.push(new Note(addedNote, value, position, line, alteration));
                    sections[section_index].notePosition = {x: sections[section_index].position.x + sections[section_index].width / 2,
                        y: line.position.y};

                      //  console.log("Spliced Sections: " + spliced_sections);
                      //  console.log(sections);
                    boopitidoo = true;
                    break;

                } else if (diff + sections[fs].value < value) {
                    diff += sections[fs].value;
                } else {

                    //change section larger

                    sections[section_index].notes = [];
                    sections[section_index].value = value;
                    sections[section_index].note = note;
                    sections[section_index].width = this.getSectionWidthByValue(value);
                    position = {x: sections[section_index].position.x + sections[section_index].width / 2,
                        y: line.position.y};

                    sections[section_index].notes.push(new Note(addedNote, value, position, line, alteration));
                    sections[section_index].notePosition = {x: sections[section_index].position.x + sections[section_index].width / 2,
                        y: line.position.y};

                    //change next section smaller!

                    sections[section_index+1].notes = [];
                    sections[section_index+1].value = sections[section_index+1].value - diff;
                    sections[section_index+1].note = "rest";
                    sections[section_index+1].width = this.getSectionWidthByValue(sections[section_index+1].value);
                    position = {x: sections[section_index+1].position.x + sections[section_index+1].width,
                        y: line.position.y};
                    sections[section_index+1].position.x = position.x;
                    sections[section_index+1].notePosition = {x: sections[section_index].position.x + sections[section_index].width / 2,
                        y: sections[section_index+1].position.y + 40};

                    // check if the measure is complete

                    let totalvalue = 0;
                    let values = [];
                    for (let tv=0;tv<this.measure.sections.length;tv++) {

                        totalvalue += this.measure.sections[tv].value;
                        values.push(this.measure.sections[tv].value);

                    }

                    if (totalvalue < this.measure.timeSignature.value) {

                        this.fillMeasureSections(values, this.sections.length-1);

                    }
                    boopitidoo = true;
                }
 
               // }

            } else {

                // ---- no room for bigger value
                console.log("yeah?");
                break;

            }

        }

        this.setBeats();
        this.analyseNotes(); //<--- note sure about this yet

    }

    return this.measure.sections;

}

Mutator.prototype.getFillSections = function(value, biggest_value, values, section) {

    //console.log("Val: " + value + " biggest: " + biggest_value + "bar duration: " + this.measure.barDuration);


    if (value + biggest_value <= (this.measure.timeSignature.beats * this.getDurationByValue(this.measure.timeSignature.value))) { // this.measure.timeSignature.value
        
        if (value + biggest_value === (this.measure.timeSignature.beats * this.getDurationByValue(this.measure.timeSignature.value))) {
            values.push(biggest_value);
            let v = values.sort(function (a, b) { return a - b });
            this.fillMeasureSections(v, section);

        } else {

            values.push(biggest_value);
            this.getFillSections(value + biggest_value, biggest_value, values, section);

        }

    } else {



        //redoing this bit!
        biggest_value = biggest_value / 2;
        this.getFillSections(value, biggest_value, values, section);

    }

}

Mutator.prototype.getDurationByValue = function(value) {
    if (value == 8) {
        return 2;
    } else if (value == 4) {
        return 4;
    } else if (value == 16) {
        return 1;
    } else if (value == 2) {
        return 8;
    }
}

Mutator.prototype.fillMeasureSections = function(values, s) {


    for (let v=0;v<values.length;v++) {

        let last = this.measure.sections[s];
        let lastWidth = this.getSectionWidthByValue(last.value);

        this.measure.sections.splice(s, 0, (new section(values[v], "rest", 0, 
        {x: last.position.x + (this.getSectionWidthByValue(last.value)),
            y: last.position.y},
            this.getSectionWidthByValue(values[v]))));

    }
    this.setBeats();
    this.analyseNotes();

}

Mutator.prototype.setBeats = function() {

    this.measure.sections.sort(function (a, b) {
        return a.position.x - b.position.x;
    });

    let beat = 1;

    for (let sb=0;sb<this.measure.sections.length;sb++) {

        if (sb == 0) {

           // console.log("------------");
            this.measure.sections[sb].beat = beat;
            
           // console.log("Beat: " + beat + " section: " + this.measure.sections[sb] + "SB: " + sb);

        } else {

           /* this.measure.sections[sb].beat = this.measure.sections[sb-1].value + beat;
            beat = this.measure.sections[sb].beat;
            console.log("Beat: " + beat + " section: " + this.measure.sections[sb]); */

            // Above is the last "working" version (doesn't actually work properly), below is attempted fix


         //   console.log("Prev Section Value: " + this.measure.sections[sb-1].value + ", Prev Section Beat: " + this.measure.sections[sb-1].beat);
         //   console.log("VALUES: " + this.measure.sections[sb-1].value / this.measure.timeSignature.value);
            this.measure.sections[sb].beat = (this.measure.sections[sb-1].value / this.measure.timeSignature.value) + beat;
            beat = this.measure.sections[sb].beat;
           // console.log("Beat: " + beat + " section: " + this.measure.sections[sb] + "SB: " + sb);

            
    
        }

    }

    this.positionByBeat();

}

Mutator.prototype.positionByBeat = function() {

   // let test = this.measure.time
     //let div_width = (this.measure.width) / this.measure.timeSignature.value;

    let working_area = this.measure.width - (this.measure.xOffset) - this.measure.marginLeft;
    let beat_width = working_area / this.measure.timeSignature.value;
    

    let div_width = this.measure.timeSignature.beats * this.measure.timeSignature.value;//\(this.measure.width) / this.measure.timeSignature.value;
    let beat = 1;

    let section_diff = 0;

    for (let b = 0;b<this.measure.sections.length;b++) {

       // this.measure.sections[b].notePosition.x = this.measure.position.x + this.measure.xOffset;// - 25 + this.measure.sections[b].beat * div_width + this.measure.xOffset - (div_width / 4);
      // this.measure.sections[b].notePosition.x = (this.measure.position.x + this.measure.xOffset + this.measure.marginLeft) + this.measure.sections[b].beat * div_width - (div_width - (div_width / 64));
       this.measure.sections[b].notePosition.x = (this.measure.sections[b].position.x + this.measure.sections[b].width / 2);// - (div_width - (div_width / 64));

        //this.measure.sections[b].notePosition.x = (this.measure.position.x + this.measure.xOffset + this.measure.marginLeft) + (this.measure.sections[b].beat * beat_width) + b * beat_width / 2;// + (this.measure.sections[b].beat * beat_width / 2) - (beat_width / 4);

        for (let n=0;n<this.measure.sections[b].notes.length;n++) {

            this.measure.sections[b].notes[n].position.x = this.measure.sections[b].notePosition.x;// - this.measure.sections[b].width / 2;

            if (this.measure.marginLeft < this.measure.sections[b].width) {

             //   this.measure.sections[b].position.x = this.measure.sections[b].notePosition.x - this.measure.marginLeft;//(this.measure.sections[b].width / 2);
            
            } else {

             //   this.measure.sections[b].position.x = this.measure.sections[b].notePosition.x - (this.measure.sections[b].width / 2);

            }

        }

    }

}

Mutator.prototype.analyseNotes = function() {

    for (let s=0;s<this.measure.sections.length;s++) {

        let highest = 0;
        let lowest = 0;

        let highest_line = {};
        let lowest_line = {};

        let middleLine = 14;

        for (let n=0;n<this.measure.sections[s].notes.length;n++) {

            if (this.measure.sections[s].notes[n].position.y < highest || highest === 0) {

                highest = this.measure.sections[s].notes[n].position.y;
                highest_line = this.measure.sections[s].notes[n].line.number;
                this.measure.sections[s].highestNote = highest_line;

            }

            if (this.measure.sections[s].notes[n].position.y > lowest || lowest === 0) {

                lowest = this.measure.sections[s].notes[n].position.y;
                lowest_line = this.measure.sections[s].notes[n].line.number;
                this.measure.sections[s].lowestNote = lowest_line;

            }

        }

        let howhigh = middleLine - highest_line;
        let howlow = lowest_line - middleLine;

        if (howhigh > howlow) {

            if (highest_line < 10 && lowest_line < 10) {
                this.measure.sections[s].stemYPositions = {y1: highest, y2: this.measure.lines[14].position.y};
            } else {
                this.measure.sections[s].stemYPositions = {y1: highest, y2: (lowest + 40)};
            }

            
            this.measure.sections[s].stemDirection = "down";

        } else {

            this.measure.sections[s].stemYPositions = {y1: lowest, y2: (highest - 40)};
            this.measure.sections[s].stemDirection = "up";
        }

        

    }

    ///

    let connected_sections = {sections: [], highest: 0, lowest: 0, indexes: []};

    let connectedBelow = 3;

    for (let s=0;s<this.measure.sections.length;s++) {

       

        if (this.measure.sections[s+1] != undefined) {

            

            if (this.measure.sections[s].value === this.measure.sections[s+1].value && 
                this.measure.sections[s].note != "rest" &&
                this.measure.sections[s+1].note != "rest") {

                    if (this.measure.sections[s].value < connectedBelow) {

                        

                        this.measure.sections[s].connected = true;
                        this.measure.sections[s].connection = "connection";
                        this.measure.sections[s].connectedNote = {x: this.measure.sections[s+1].position.x, 
                            y: this.measure.sections[s+1].stemYPositions.y2};

                    }

            } else if (this.measure.sections[s-1] != undefined &&
                 this.measure.sections[s].value === this.measure.sections[s-1].value &&
                this.measure.sections[s+1].note === "rest" ||
                this.measure.sections[s-1] != undefined &&
                this.measure.sections[s].value === this.measure.sections[s-1].value &&
                this.measure.sections[s+1].value >= 1) {
                    if (this.measure.sections[s-1].connected && this.measure.sections[s].note != "rest") {
                        this.measure.sections[s].connected = true;
                        this.measure.sections[s].connection = "end";
                    }

                }
            
            else {
                if (this.measure.sections[s-1] != undefined) {
                    if (this.measure.sections[s-1].connected) {
                        this.measure.sections[s-1].connection = "end";
                    }
                }
            }

        } else if (this.measure.sections[s+1] == undefined && this.measure.sections[s-1].connected) {

            if (this.measure.sections[s].value <= this.measure.sections[s-1].value
                && this.measure.sections[s].note != "rest" && this.measure.sections[s-1].note != "rest") {

                    if (this.measure.sections[s].value < connectedBelow) {

                        this.measure.sections[s].connected = true;
                        this.measure.sections[s].connection = "end";
                        this.measure.sections[s].connectedNote = {x: this.measure.sections[s].position.x,
                            y: this.measure.sections[s].stemYPositions.y2};

                    }

                } 

        }

    }

    ///

    for (let s=0;s<this.measure.sections.length;s++) {

        if (this.measure.sections[s].connected || this.measure.sections[s].connected && s == (this.measure.sections.length-1)) {

            connected_sections.sections.push(this.measure.sections[s]);
            connected_sections.indexes.push(s);

        } else {

          //  if (connected_sections.sections.length > 0) {
                

           //     connected_sections.sections.push(this.measure.sections[s]);
           //     this.connectNotes(connected_sections.sections, connected_sections.indexes);
           //     connected_sections = {sections: [], highest: 0, lowest: 0, indexes: []};

           // }

        }

    }

    if (connected_sections.sections.length > 0) {

        connected_sections.sections.push(this.measure.sections[this.measure.sections.length-1]);
        this.connectNotes(connected_sections.sections, connected_sections.indexes);
        connected_sections = {sections: [], highest: 0, lowest: 0, indexes: []};

    }

}

Mutator.prototype.connectNotes = function(sections, indexes) {


    let middleLine = 14;

    let hightolow = sections.slice(0);
    hightolow.sort(function(a, b) {
        return a.notePosition.y - b.notePosition.y;
    });
    let highest = hightolow[0].notePosition.y;
    let lowest = hightolow[hightolow.length-1].notePosition.y;

    let stemDir = "down"; //default to up

    if (hightolow[0].highestNote <= 14) {
        stemDir = "up";
    } else if (hightolow[hightolow.length-1].lowestNote > 14) {
        stemDir = "down";
    } else {

        if ((middleLine - hightolow[0].highestNote) > (hightolow[0].lowestNote - middleLine) ) {

            stemDir = "down";

        } else {
            stemDir = "up";
        }

    }

   let howhigh = middleLine - hightolow[0].highestNote;


    for (let s=0;s<indexes.length;s++) {

            if (stemDir === "down") {
                this.measure.sections[indexes[s]].stemYPositions.y2 = lowest + 30;
                this.measure.sections[indexes[s]].connectedNote.y = lowest + 30;
                this.measure.sections[indexes[s]].stemDirection = stemDir;
            } else if (stemDir === "up") {
                this.measure.sections[indexes[s]].stemYPositions.y2 = highest - 30;
                this.measure.sections[indexes[s]].connectedNote.y = highest - 30;
                this.measure.sections[indexes[s]].stemDirection = stemDir;
            }
         
    }

}

Mutator.prototype.getSectionWidthByValue = function(value) {

   // let perc = value / this.measure.timeSignature.value;
   let perc = value / (this.measure.timeSignature.beats * this.getDurationByValue(this.measure.timeSignature.value));

    return this.measure.width * perc;

}