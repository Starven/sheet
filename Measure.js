function Measure (measureNo, timeSig, keySig, clef, width, height, position, showClef, showKey, showTime) {

    this.measureNumber = measureNo;
    this.timeSignature = timeSig; // {beats: x, va: y}
    this.keySignature = keySig;
    this.clef = clef;

    this.barDuration = timeSig.beats * timeSig.value;

    this.offsetScale = 50;

    this.showClef = showClef;
    this.changeClef = false;
    this.showKey = showKey;
    this.showTime = showTime;

    this.showSections = false;
    this.measureSelected = false;


    this.xOffset = 0;
    if (this.showClef) {
        this.xOffset += this.offsetScale;
    } 
    if (this.showKey) {
        this.xOffset += this.offsetScale;
    }
    if (this.showTime) {
        this.xOffset += this.offsetScale;
    }

    this.marginLeft = 25;

    this.clefImage = null;


    this.beats = [];

    this.scale = 1.0;

    this.width = width;
    this.height = height;
    this.lines = [];
    this.position = position;
    this.sections = this.initSections(this.barDuration);
    //this.sections = [new section(this.timeSignature.beats, "rest", 16, {x: this.position.x + this.xOffset + this.marginLeft, y: this.position.y}, this.width)];
    this.hovered = false;

    console.log(this.sections);

    this.noteList = ["B", "A", "G", "F", "E", "D", "C"];
    
    //create Lines

    this.noteNumber = 6;
    this.noteInd = 0;
    if (this.clef === "treble") {
        noteNumber = 6;
        noteInd = 0;
    } else if (this.clef === "bass") {
        noteNumber = 5;
        noteInd = 5;
    }
    
    

    for (var number=0;number<30;number++) {
        var ledger = true;
        if (number % 2 == 0) {
            if (number >= 10 && number <= 18) {//} || number === 0 || number === 28) {
                ledger = false;
            } else {
                ledger = true;
            }
            
        } else {
            ledger = true;
            
        }

        var concat = this.noteList[noteInd] + noteNumber.toString();



        var sharpConcat = "";
        var flatConcat = "";

       //var noteList = ["B", "A", "G", "F", "E", "D", "C"]; //for reference

       // determine sharp string for line

        if (noteInd == this.noteList.length-1) {
            sharpConcat = concat + "#" + this.noteList[noteInd-1] + (noteNumber).toString() + "b";
        } else {
            if (noteInd == 0) {
                sharpConcat = this.noteList[this.noteList.length-1] + (noteNumber+1).toString();//concat + "#" + noteList[noteList.length-1] + (noteNumber-1).toString() + "b";
            } else {
                sharpConcat = concat + "#" + this.noteList[noteInd-1] + noteNumber.toString() + "b";
            }
        }

        //determine flat string for line

        if (noteInd == 0) {
            flatConcat = this.noteList[noteInd+1] + noteNumber.toString() + "#" + this.noteList[noteInd] + noteNumber.toString() + "b";
        } else {
            if (noteInd == this.noteList.length-1) {
                flatConcat = this.noteList[0] + (noteNumber-1).toString();
            } else {
                flatConcat = this.noteList[noteInd+1] + noteNumber.toString() + "#" + this.noteList[noteInd] + noteNumber.toString() + "b";
            }
        }

        if (noteInd < this.noteList.length-1) {
            noteInd++;
        } else {
            noteInd = 0;
            noteNumber -= 1;
        }
        
        //console.log(concat);

        this.lines.push(new Line(this.timeSignature.value, {x: this.position.x, y: this.position.y - this.height + (number * 10)}, this.width + this.xOffset + this.marginLeft, ledger, concat, sharpConcat, flatConcat, number));
    }


    this.previewMeasure = new PreviewMeasure(measureNo, timeSig, keySig, clef, this.width, this.position, this.sections, this.lines, this.xOffset, this.marginLeft);
    this.mutator = new Mutator(this);

}

Measure.prototype.returnTimeSignature = function() {
    return this.timeSignature;
}

Measure.prototype.drawImage = function() {

}

Measure.prototype.setClef = function(clef) {
    this.changeClef = true;
    this.clefImage = null;
    this.clef = clef;
}

Measure.prototype.toggleSelected = function() {
    this.measureSelected = !this.measureSelected;
}

Measure.prototype.isSelected = function() {
    return this.measureSelected;
}

Measure.prototype.initSections = function(value) {

    let sections = [];

   // let totalSectionValue = beats * (value / 4);
   let totalSectionValue = value;
    let totalInitialSectionValue = totalSectionValue;
    let xBuffer = 0;

    for (let s=0;s<this.timeSignature.beats;s++) {
        sections.push(new section(this.getDurationByValue(this.timeSignature.value), 'rest', totalSectionValue / this.timeSignature.beats, {x: this.position.x + this.xOffset + this.marginLeft + xBuffer, y: this.position.y}, this.getSectionWidthByValue(totalSectionValue / this.timeSignature.beats)));
        xBuffer += this.getSectionWidthByValue(totalSectionValue / this.timeSignature.beats);
    }

    
   /* if (totalSectionValue % 4 == 0) {
        if (totalSectionValue <= 16) {
            sections.push(new section(this.timeSignature.beats, "rest", totalSectionValue, {x: this.position.x + this.xOffset + this.marginLeft, y: this.position.y}, this.width));
            
        } else {
            sections.push(new section(this.timeSignature.beats, "rest", 16, {x: this.position.x + this.xOffset + this.marginLeft, y: this.position.y}, this.width));
            totalSectionValue -= 16;
            while (totalSectionValue > 16) {
                sections.push(new section(this.timeSignature.beats, "rest", totalSectionValue, {x: this.position.x + this.xOffset + this.marginLeft, y: this.position.y}, this.width));
                totalSectionValue -= 16;
                console.log("loopinboopin");
            }

            if (totalSectionValue % 2 == 0) {
                sections.push(new section(this.timeSignature.beats, "rest", totalSectionValue, {x: this.position.x + this.xOffset + this.marginLeft, y: this.position.y}, this.width));

            }

        }
    }*/

    return sections;

}

Measure.prototype.initSectionWidth = function(total) {

}

Measure.prototype.getDurationByValue = function(value) {
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

Measure.prototype.getSectionWidthByValue = function(value) {

    //let perc = value / this.timeSignature.value;
    let perc = value / this.barDuration;

    return this.width * perc;

}

Measure.prototype.render = function(context, canvas, camera, notate) {

    context.strokeStyle = "rgba(0,0,0,1)";
    context.beginPath();
    context.moveTo(camera.x + this.position.x, camera.y + (this.lines[10].position.y));
    context.lineTo(camera.x + this.position.x, camera.y + (this.lines[18].position.y));
    context.moveTo(camera.x + this.position.x + this.width + this.xOffset + this.marginleft, camera.y + (this.lines[10].position.y));

    //THIS MAKES THE BAR END RENDER, I DON'T KNOW WHY
    context.rect(camera.x + this.position.x + this.width + this.xOffset + this.marginLeft, camera.y + (this.lines[10].position.y), 0, 0);
    // CAN'T REMOVE RIGHT NOW AHHHH
    context.lineTo(camera.x + this.position.x + this.width + this.xOffset + this.marginLeft, camera.y + (this.lines[18].position.y));
    context.stroke();
    context.closePath();

        context.fillStyle = "rgb(0,0,0)";
     
         for (var l=0;l<this.lines.length;l++) {
             this.lines[l].render(context, canvas, camera);
         }

         if (!this.hovered || !notate) {
            for (var s=0;s<this.sections.length;s++) {
             
                for (var n=0;n<this.sections[s].notes.length;n++) {

                      renderNote(this.sections[s].notes[n], this.sections[s].notes[n].duration, this.sections[s].notes[n].position, context, canvas, camera, this.sections[s].notes[n].selected, this.sections[s].notes[n].line, false);
                }

              renderStem(this.sections[s], context, canvas, camera, false);
   
                if (this.sections[s].notes.length == 0) {
                   renderNote(this.sections[s].note, this.sections[s].value, this.sections[s].notePosition, context, canvas, camera, false, 0, false);
                }
               // 
            }
         }
     
         

         if (this.showSections && !this.hovered) {
            for (var s=0;s<this.sections.length;s++) {
                context.beginPath();
               context.strokeStyle = "rgb(0,0,115)";
               context.fillStyle = "rgba(0,0,200,0.2)";
               context.fillRect(camera.x + this.sections[s].position.x, camera.y + this.sections[s].position.y - 300, this.sections[s].width, 600);
               context.rect(camera.x + this.sections[s].position.x, camera.y + this.sections[s].position.y - 300, this.sections[s].width, 600);
               context.stroke();
               
            } 
         } 
    
    if (this.hovered && notate) {
        this.previewMeasure.render(context, canvas, camera);  

        if (this.showSections) {
            for (var s=0;s<this.previewMeasure.sections.length;s++) {
                 context.beginPath();
                 context.strokeStyle = "rgb(0,115,0)";
                 context.fillStyle = "rgba(0,200,0,0.5)";
                 context.fillRect(camera.x + this.previewMeasure.sections[s].position.x, camera.y + this.previewMeasure.sections[s].position.y - 300, this.previewMeasure.sections[s].width, 600);
                 context.rect(camera.x + this.previewMeasure.sections[s].position.x, camera.y + this.previewMeasure.sections[s].position.y - 300, this.previewMeasure.sections[s].width, 600);
                 context.stroke();
             } 
        }
        
        
    }

    if (this.measureSelected) {

        context.beginPath();
        context.strokeStyle = "rgb(239, 151, 43)";
        context.rect(camera.x + this.position.x, camera.y + this.position.y - 50, this.width + this.xOffset + this.marginLeft, 175);
        context.stroke();

    }

    if (this.showTime) {
        context.font="48px serif";
        context.fillStyle = "rgb(0,0,0)";
        context.fillText(this.timeSignature.beats.toString(), camera.x + this.position.x + (this.xOffset - (this.offsetScale / 2)), camera.y + this.position.y + 37); //need to fix scaling for time sig
        context.fillText(this.timeSignature.value.toString(), camera.x + this.position.x + (this.xOffset - (this.offsetScale / 2)), camera.y + this.position.y + 77); //need to fix scaling for time sig
    }

    //render clef?

    if (this.showClef) {

        if (this.clefImage == null || this.changeClef) {

            if (this.clef === "treble") {
                this.clefImage = renderClef(this.clef, context, canvas, {x: this.position.x - 8, y: this.position.y - 35}, 78, 155, camera);
            } else if (this.clef === "bass") {
                this.clefImage = renderClef(this.clef, context, canvas, this.position, 70, 70, camera);
            }

            this.changeClef = false;
            

        } else {

            if (this.clef === "treble") {
                context.drawImage(this.clefImage, camera.x + this.position.x - 8, camera.y + this.position.y - 35, 78, 155);
            } else if (this.clef === "bass") {
                context.drawImage(this.clefImage, camera.x + this.position.x, camera.y + this.position.y, 70, 70);
            }

        }
    }
   
}

Measure.prototype.getNoteTypeByDuration = function(duration) {
    if (duration === 2) {
        return "8";
    } else if (duration == 4){
        return "4";
    } else {
        return "4";
    }
}

Measure.prototype.mouseOver = function(mx, my){
    if (mx >= this.position.x && mx <= this.position.x + this.width + this.xOffset 
    && my >= this.position.y - this.height && my <= (this.position.y - this.height + (290))) {
        this.hovered = true;
        return true;
    } else {
        this.hovered = false;
    }
}

function returnAlteredNote(note, alteration) {

    let addedNote = note;
    let addedNum = note[1];
   // console.log("added num = " + addedNum);
    let alterN = "";

    if (alteration != 0) {

        for (let n=0;n<this.noteList.length;n++) {
            if (this.noteList[n] === addedNote[0]) {
                if (n + alteration >= 0 && n + alteration < this.noteList.length) {
                    if (alteration > 0) {
    
                        if (this.noteList[n] != "E" && this.noteList[n] != "B") {
                            alterN = this.noteList[n-1] + addedNum;
                        } else {
                            addedNote = this.noteList[n-1] + addedNum;
                        }
    
                    } else {
                        if (this.noteList[n] != "F" && this.noteList[n] != "C") {
                            alterN = this.noteList[n+1] + addedNum;
                        } else {
                            addedNote = this.noteList[n+1] + addedNum;
                        }
                    } 
                } else {
                    if (n + alteration < 0) {
                        alterN = this.noteList[this.noteList.length-1];
                    } else if (n + alteration >= this.noteList.length) {
                        alterN = this.noteList[0];
                    }
                }
                if (addedNote === note) {
                    let alteredString = (alteration > 0) ? "#" : "b";
                    let secondString = (alteredString === "#") ? "b" : "#";
                    alteredString = "#";
                    secondString = "b";
                    if (alteration > 0) {
                        addedNote += alteredString + alterN + secondString;
                    } else if (alteration < 0) {
                        let reversedNote = "";
                        reversedNote = alterN + secondString + addedNote + alteredString; 
                        addedNote = reversedNote;
                    }
                    
                }
                
            }
        }
    }

    return addedNote;
}

Measure.prototype.mutateSect = function(section, value, note, section_index, line, alteration) {

   // let addedNote = returnAlteredNote(line.note, alteration);
   let addedNote = returnAlteredNotes(line, alteration);

    this.mutator.mutateSection(this.sections, value, note, section_index, line, addedNote, alteration);

}

function returnAlteredNotes(line, alteration) {

    if (alteration > 0) {
        return line.sharpNote;
    } else if (alteration < 0) {
        return line.flatNote;
    } else {
        return line.note;
    }

}


Measure.prototype.mouseOverSection = function(mx, my) {
    for (var s=0;s<this.sections.length;s++) {
        if (mx >= this.sections[s].position.x && mx <= this.sections[s].position.x + this.sections[s].width 
            && my >= this.sections[s].position.y - 300 && my <= this.sections[s].position.y + 300) {
                
                return s;
                
            }
    }
    
}

Measure.prototype.setOffset = function(clef, key, time) {
    this.showClef = clef;
    this.showKey = key;
    this.showTime = time;

    this.xOffset = 0;
    if (this.showClef) {
        this.xOffset += 40;
    } 
    if (this.showKey) {
        this.xOffset += 40;
    }
    if (this.showTime) {
        this.xOffset += 40;
    }

    //set line width
    for (var l=0;l<this.lines.length;l++) {
        this.lines[l].setWidth(this.width + this.xOffset);
    }

    //set section x position


    var last = {};
    for (var s=0;s<this.sections.lengths;s++) {
        if (s == 0) {
            this.sections[s].position.x = this.position.x + this.xOffset;
            last = this.sections[s];
        } else {
            this.sections[s].position.x = last.position.x + this.xOffset;
        }
        
    }
}

function section(value, note, beat, position, width) {
    this.value = value;
    this.note = note; //note or rest
    this.notes = [];
    this.position = position;
    this.width = width;
    this.notePosition = {x: this.position.x + this.width / 2, y: position.y + 40}; //center notes in section
    this.stemDirection = "up";
    this.stemYPositions = {y1: 0, y2: 0};
    this.connected = false;
    this.connectedNote = {};
    this.beat = beat;
    this.highestNote = 0;
    this.lowestNote = 0;
}

section.prototype.removeNote = function(n) {
    this.notes.splice(n, 1);
    if (this.notes.length === 0) {
        this.note = "rest";
        this.notePosition = {x: this.position.x + this.width / 2, y: this.position.y + 40};
    }
}

//Preview Measure ay bb;

function PreviewMeasure(measureNo, timeSig, keySig, clef, width, position, sections, lines, xOffset, marginLeft) {
    this.measureNumber = measureNo;
    this.timeSignature = timeSig;
    this.keySignature = keySig;
    this.clef = clef;
    this.width = width;
    this.position = position;
    this.sections = JSON.parse(JSON.stringify(sections));
    this.lines = lines;
    this.xOffset = xOffset;
    this.marginLeft = marginLeft;
    this.mutator = new Mutator(this);
}

PreviewMeasure.prototype.setSections = function(sections) {
    this.sections = JSON.parse(JSON.stringify(sections));
}

PreviewMeasure.prototype.prev = function(measure, value, note, section, line, alteration) {

    var s = measure.sections[section];
    this.setSections(measure.sections);

   // let addedNote = returnAlteredNote(line.note, alteration);
    let addedNote = returnAlteredNotes(line, alteration);
    this.mutator.mutateSection(this.sections, value, note, section, line, addedNote, alteration);


}

PreviewMeasure.prototype.render = function(context, canvas, camera) {


    for (var s=0;s<this.sections.length;s++) {
        for (var n=0;n<this.sections[s].notes.length;n++) {
            renderNote(this.sections[s].notes[n], this.sections[s].notes[n].duration, this.sections[s].notes[n].position, context, canvas, camera, this.sections[s].notes[n].selected, this.sections[s].notes[n].line, true);
        }

        if (this.sections[s].notes.length == 0) {
            renderNote(this.sections[s].note, this.sections[s].value, this.sections[s].notePosition, context, canvas, camera, false, 0, true);
         }

       renderStem(this.sections[s], context, canvas, camera, true);
    }

    
}


//var noteList = ["B", "A", "G", "F", "E", "D", "C"];
